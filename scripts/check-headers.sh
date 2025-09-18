#!/bin/bash

# HTTP Headers Validation Script
# Usage: BASE_URL=https://example.com bash scripts/check-headers.sh

set -euo pipefail

# Configuration
BASE_URL="${BASE_URL:-http://localhost:4173}"
TEMP_DIR=$(mktemp -d)
EXIT_CODE=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    EXIT_CODE=1
}

# Check if curl is available
if ! command -v curl &> /dev/null; then
    log_error "curl is required but not installed"
    exit 1
fi

# Check if BASE_URL is set
if [[ -z "$BASE_URL" ]]; then
    log_error "BASE_URL environment variable is required"
    echo "Usage: BASE_URL=https://your-domain.com bash scripts/check-headers.sh"
    exit 1
fi

log_info "Starting HTTP headers validation for: $BASE_URL"

# Function to check headers for a given URL
check_headers() {
    local url="$1"
    local type="$2" # "html" or "asset"
    local headers_file="$TEMP_DIR/headers_${type}.txt"
    
    log_info "Checking headers for $type: $url"
    
    # Fetch headers with curl
    if ! curl -sI --connect-timeout 10 --max-time 30 "$url" > "$headers_file" 2>/dev/null; then
        log_error "Failed to fetch headers from: $url"
        return 1
    fi
    
    # Convert headers to lowercase for case-insensitive matching
    local headers_lower="$TEMP_DIR/headers_${type}_lower.txt"
    tr '[:upper:]' '[:lower:]' < "$headers_file" > "$headers_lower"
    
    # Check HTTP status
    local status_line=$(head -n1 "$headers_file")
    if [[ ! "$status_line" =~ 200 ]]; then
        log_error "$type - Non-200 response: $status_line"
        return 1
    fi
    
    # Expected headers configuration
    local -A expected_headers
    local -A expected_values
    
    if [[ "$type" == "html" ]]; then
        # HTML file headers - short cache
        expected_headers["cache-control"]=1
        expected_values["cache-control"]="max-age=300|must-revalidate"
    elif [[ "$type" == "asset" ]]; then
        # Asset file headers - long cache + immutable
        expected_headers["cache-control"]=1
        expected_values["cache-control"]="max-age=31536000|immutable"
    fi
    
    # Security headers (required for both)
    expected_headers["x-content-type-options"]=1
    expected_values["x-content-type-options"]="nosniff"
    
    expected_headers["referrer-policy"]=1
    expected_values["referrer-policy"]="strict-origin-when-cross-origin"
    
    expected_headers["x-frame-options"]=1
    expected_values["x-frame-options"]="deny"
    
    # Check each expected header
    for header in "${!expected_headers[@]}"; do
        if ! grep -q "^${header}:" "$headers_lower"; then
            log_error "$type - Missing header: $header"
        else
            local header_value=$(grep "^${header}:" "$headers_lower" | cut -d: -f2- | sed 's/^ *//' | tr -d '\r')
            
            if [[ -n "${expected_values[$header]:-}" ]]; then
                if [[ "$header_value" =~ ${expected_values[$header]} ]]; then
                    log_success "$type - $header: $header_value"
                else
                    log_warning "$type - $header value may be incorrect: $header_value"
                    log_info "    Expected pattern: ${expected_values[$header]}"
                fi
            else
                log_success "$type - $header: $header_value"
            fi
        fi
    done
    
    # Optional but recommended headers
    local -a optional_headers=("content-security-policy" "permissions-policy" "x-xss-protection")
    
    for header in "${optional_headers[@]}"; do
        if grep -q "^${header}:" "$headers_lower"; then
            local header_value=$(grep "^${header}:" "$headers_lower" | cut -d: -f2- | sed 's/^ *//' | tr -d '\r')
            log_success "$type - Optional $header: ${header_value:0:50}${header_value:50:+...}"
        else
            log_warning "$type - Optional header not found: $header"
        fi
    done
    
    return 0
}

# Function to find an asset file with hash
find_asset_file() {
    local asset_list_url="${BASE_URL}/index.html"
    local temp_html="$TEMP_DIR/index.html"
    
    log_info "Fetching index.html to find hashed asset files..."
    
    if ! curl -s --connect-timeout 10 --max-time 30 "$asset_list_url" > "$temp_html" 2>/dev/null; then
        log_error "Failed to fetch index.html from: $asset_list_url"
        return 1
    fi
    
    # Look for JavaScript files with hash in /assets/
    local js_file=$(grep -oE '/assets/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]{8,}\\.js' "$temp_html" | head -n1)
    
    if [[ -n "$js_file" ]]; then
        echo "${BASE_URL}${js_file}"
        return 0
    fi
    
    # Fallback: try common patterns
    local fallback_patterns=("/assets/index.js" "/assets/main.js" "/assets/app.js")
    for pattern in "${fallback_patterns[@]}"; do
        local test_url="${BASE_URL}${pattern}"
        if curl -sI --connect-timeout 5 --max-time 10 "$test_url" | grep -q "200"; then
            echo "$test_url"
            return 0
        fi
    done
    
    return 1
}

# Main validation flow
main() {
    echo "🌐 HTTP Headers Validation Report"
    echo "================================"
    echo "Target: $BASE_URL"
    echo "Time: $(date)"
    echo ""
    
    # Check HTML file headers
    echo "📄 HTML File Headers:"
    echo "--------------------"
    if check_headers "$BASE_URL/" "html"; then
        log_success "HTML headers validation completed"
    fi
    echo ""
    
    # Find and check asset file headers
    echo "📦 Asset File Headers:"
    echo "---------------------"
    if asset_url=$(find_asset_file); then
        log_info "Found asset file: $(basename "$asset_url")"
        if check_headers "$asset_url" "asset"; then
            log_success "Asset headers validation completed"
        fi
    else
        log_warning "Could not find hashed asset file for testing"
        log_info "Manually specify an asset URL if needed"
    fi
    echo ""
    
    # Summary
    echo "📊 Validation Summary:"
    echo "---------------------"
    if [[ $EXIT_CODE -eq 0 ]]; then
        log_success "All critical headers are properly configured"
        echo "🎉 Headers validation passed!"
    else
        log_error "Some headers are missing or misconfigured"
        echo "💡 Review the _headers file and deployment configuration"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    
    exit $EXIT_CODE
}

# Handle script interruption
trap 'echo ""; log_info "Script interrupted, cleaning up..."; rm -rf "$TEMP_DIR"; exit 130' INT TERM

# Run main function
main "$@"
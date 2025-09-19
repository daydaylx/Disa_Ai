# Security Headers & CSP Change Process

## Current Configuration

**Headers Location:** `public/_headers` (deployed to `dist/_headers` by Vite)
**Deployment:** Cloudflare Pages (primary and single source of truth)

## Content Security Policy (CSP) Management

### Current CSP
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://openrouter.ai; worker-src 'self'; manifest-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
```

### CSP Change Process

#### 1. When to Update CSP
- Adding external APIs or services
- Integrating third-party scripts (analytics, CDNs)
- Adding external fonts or resources
- Enabling new browser features

#### 2. Change Workflow

**Step 1: Document the Need**
- Create feature PR with clear justification
- Explain WHAT external resource is needed
- Explain WHY it's necessary for the feature
- Document security implications

**Step 2: Minimal Addition**
- Add ONLY the minimum required domains/sources
- Avoid wildcards (`*`) when possible
- Use specific hostnames instead of broad patterns

**Step 3: Test & Validate**
```bash
# Local testing
npm run build
npm run preview
# Test feature functionality

# Validate headers
BASE_URL=http://localhost:4173 bash scripts/check-headers.sh
```

**Step 4: PR Documentation**
Include in PR description:
```markdown
## CSP Changes
- **Added:** `https://fonts.googleapis.com` to `style-src`
- **Reason:** Google Fonts integration for improved typography
- **Risk:** Low - Google Fonts is a trusted CDN
- **Validation:** ✅ Headers script passed
```

#### 3. Common CSP Additions

**Google Fonts:**
```
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
```

**Analytics (Google Analytics):**
```
script-src 'self' https://www.google-analytics.com;
connect-src 'self' https://www.google-analytics.com;
```

**CDN Assets:**
```
script-src 'self' https://cdn.jsdelivr.net;
style-src 'self' https://cdn.jsdelivr.net;
```

**External APIs:**
```
connect-src 'self' https://api.example.com;
```

#### 4. Security Review Checklist

Before approving CSP changes, verify:
- [ ] Minimum necessary permissions granted
- [ ] No broad wildcards used
- [ ] External domains are trustworthy
- [ ] Alternative solutions considered
- [ ] Change documented in PR
- [ ] Headers validation script passes

#### 5. Emergency CSP Bypass

For critical production issues, temporary CSP relaxation:

1. Create hotfix branch
2. Add minimal CSP exception with `TEMPORARY:` comment
3. Deploy fix
4. Create follow-up PR to properly implement solution
5. Remove temporary exception

Example:
```
# TEMPORARY: Allow inline styles for hotfix - remove in PR #123
style-src 'self' 'unsafe-inline';
```

## Monitoring & Validation

### Automated Checks
- Headers validation runs in CI (`scripts/check-headers.sh`)
- CSP violations logged in browser console during development

### Manual Testing
```bash
# Test headers locally
npm run build && npm run preview
BASE_URL=http://localhost:4173 bash scripts/check-headers.sh

# Test on production
BASE_URL=https://your-domain.com bash scripts/check-headers.sh
```

### CSP Violation Monitoring
Monitor browser console for CSP violations:
```javascript
// Add to development builds for CSP testing
document.addEventListener('securitypolicyviolation', (e) => {
  console.warn('CSP Violation:', e.violatedDirective, e.blockedURI);
});
```

## Best Practices

1. **Principle of Least Privilege:** Only add permissions you actually need
2. **Document Everything:** Every CSP change should be justified and documented
3. **Regular Audits:** Review CSP quarterly for unused permissions
4. **Test Thoroughly:** Always test new CSP settings locally before deploying
5. **No Wildcards:** Avoid `*` and `data:` unless absolutely necessary

## References

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
from playwright.sync_api import sync_playwright

def verify_manifest(page):
    # Navigate to the page
    page.goto("http://localhost:5173")

    # 1. Check for Manifest Link
    manifest_link = page.locator('link[rel="manifest"]')
    href = manifest_link.get_attribute("href")
    print(f"Manifest Href: {href}")
    assert href == "/manifest.webmanifest"

    # 2. Check for PNG Favicon
    favicon_png = page.locator('link[rel="icon"][type="image/png"]')
    href_png = favicon_png.get_attribute("href")
    print(f"PNG Favicon Href: {href_png}")
    assert href_png == "/app-icons/icon-48.png"

    # 3. Check for Apple Touch Icon
    apple_icon = page.locator('link[rel="apple-touch-icon"]')
    href_apple = apple_icon.get_attribute("href")
    print(f"Apple Icon Href: {href_apple}")
    assert href_apple == "/app-icons/icon-180.png"

    # 4. Check for OG Image
    og_image = page.locator('meta[property="og:image"]')
    content_og = og_image.get_attribute("content")
    print(f"OG Image Content: {content_og}")
    assert content_og == "https://disaai.de/app-icons/icon-512.png"

    print("Meta tags verification successful.")

def verify_noscript_fallback(browser):
    # New context with JS disabled
    context = browser.new_context(java_script_enabled=False)
    page = context.new_page()
    page.goto("http://localhost:5173")

    # Check if fallback content is visible
    # The style in noscript forces .fallback-content to display: flex !important
    # But since we are rendering client side, the initial HTML (index.html) has the fallback content in a div.
    # The div #root contains the fallback content initially?
    # Let's check index.html again.
    # <div id="root"> <div class="fallback-content" ...> ... </div> </div>
    # Yes, it is there by default.

    fallback = page.locator(".fallback-content")
    if fallback.is_visible():
        print("Fallback content is visible with JS disabled.")
        # Check if the image inside fallback points to correct icon
        img = fallback.locator("img")
        src = img.get_attribute("src")
        print(f"Fallback Image Src: {src}")
        assert src == "/app-icons/icon-192.png"

        page.screenshot(path="verification/noscript_fallback.png")
        print("Screenshot taken: verification/noscript_fallback.png")
    else:
        print("Fallback content NOT visible.")
        print(page.content())

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            page = browser.new_page()
            verify_manifest(page)
            verify_noscript_fallback(browser)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

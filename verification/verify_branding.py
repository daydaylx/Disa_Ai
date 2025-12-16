from playwright.sync_api import sync_playwright

def verify_chat_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to verify mobile-first design
        page = browser.new_page(viewport={"width": 375, "height": 812})

        try:
            # Wait for server
            page.goto("http://localhost:3000")
            page.wait_for_selector('h1:has-text("Disa")')

            # Wait for animations to settle
            page.wait_for_timeout(1000)

            # Check for the NotchFrame wrapper around Hero
            # We look for a div with 'relative' and 'rounded-2xl' that contains the H1
            # Note: Playwright selectors can be tricky with CSS classes, but we can check visual appearance via screenshot

            page.screenshot(path="verification/home_mobile.png")
            print("Screenshot saved to verification/home_mobile.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_chat_layout()


from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/test-legacy-composer")

        # Wait for the composer to be visible
        page.wait_for_selector(".mobile-composer")

        # Click the emoji button
        emoji_btn = page.locator("button[title=\"Emoji auswählen\"]")
        emoji_btn.click()

        # Wait for emoji picker to appear (it has a specific class from the library or just check for the container)
        page.wait_for_selector(".EmojiPickerReact")

        # Click an emoji (e.g. the first one or search)
        # We can just click on a visible emoji. The library usually uses buttons for emojis.
        # Let's try to click the first emoji button we find inside the picker.
        first_emoji = page.locator(".EmojiPickerReact button.epr-emoji").first
        first_emoji.click()

        # Check if the textarea has the emoji
        textarea = page.locator("textarea")
        value = textarea.input_value()
        print(f"Textarea value: {value}")

        if len(value) > 0:
            print("Emoji insertion successful")
        else:
            print("Emoji insertion failed")

        page.screenshot(path="verification/emoji_picker.png")
        browser.close()

if __name__ == "__main__":
    run()

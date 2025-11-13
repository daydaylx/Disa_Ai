import { test } from "@playwright/test";
import fs from "fs";

test("Get Rendered HTML", async ({ page }) => {
  await page.goto("http://localhost:5174/chat");
  await page.waitForTimeout(5000); // Wait for the app to render
  const html = await page.content();
  fs.writeFileSync("rendered.html", html);
});

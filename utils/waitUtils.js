export async function thinkTime(page, seconds = 2) {
    await page.waitForTimeout(seconds * 1000);
}
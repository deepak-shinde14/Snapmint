const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
    });

    const context = await browser.newContext({
        httpCredentials: {
            username: 'snapmint',
            password: 'ciHns$@NKSa',
        },
    });

    const page = await context.newPage();
    await page.goto('https://qa.snapmint.com/');

    await page.pause(); // Opens Playwright Inspector
})();
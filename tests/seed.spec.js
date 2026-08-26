// tests/seed.spec.js
import { test, expect } from '../fixtures/testFixture';
import { DataGenerator } from '../utils/dataGenerator.js';

test('Seed Test for AI reference', async ({ page, websitePage }) => {
    // Generate random data
    const randomMobile = DataGenerator.randomMobile();

    // Example page interaction using your custom page object models
    await page.goto('https://website.qa.snmt.link/');

    // Assertions
    await expect(page).toHaveTitle(/Snapmint/);
});
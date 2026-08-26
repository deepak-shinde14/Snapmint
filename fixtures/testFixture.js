import { test as base, chromium, expect } from '@playwright/test';

import { MerchantDemoPage } from '../pages/MerchantDemoPage';
import { KycPage } from '../pages/KycPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { WebsitePage } from '../pages/WebsitePage';
import { AddressPage } from '../pages/AddressPage';
import { PaymentPage } from '../pages/PaymentPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';

export const test = base.extend({

    page: async ({ }, use) => {
        const context = await chromium.launchPersistentContext(
            './playwright-profile',
            {
                headless: false,
                channel: 'chrome',
            }
        );

        const page = context.pages()[0] || await context.newPage();

        await use(page);

        await context.close();
    },

    merchantPage: async ({ page }, use) => {
        await use(new MerchantDemoPage(page));
    },

    kycPage: async ({ page }, use) => {
        await use(new KycPage(page));
    },

    orderPage: async ({ page }, use) => {
        await use(new OrderConfirmationPage(page));
    },

    websitePage: async ({ page }, use) => {
        await use(new WebsitePage(page));
    },

    addressPage: async ({ page }, use) => {
        await use(new AddressPage(page));
    },

    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },

    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },

});

export { expect };
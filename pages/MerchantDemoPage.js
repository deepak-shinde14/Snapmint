import { expect } from '@playwright/test';

export class MerchantDemoPage {

    constructor(page) {
        this.page = page;

        this.mobile = page.locator('#new-mobile');
        this.merchantId = page.locator('input[name="merchant_id"]');
        this.storeId = page.locator('input[name="store_id"]');
        this.orderId = page.locator('input[name="order_id"]');
        this.orderValue = page.locator('input[name="order_value"]');
        this.shippingFees = page.locator('input[name="shipping_fees"]');
        this.resetUserData = page.locator('#reset_user_data');
        this.fullName = page.locator('input[name="full_name"]');
        this.email = page.locator('input[name="email"]');
        this.resetLoanAddresses = page.locator('#reset_loan_addresses');
        this.resetShippingAddresses = page.locator('#reset_shipping_addresses');
        this.resetCartProducts = page.locator('#reset_cart_products');
        this.checksumRadio = page.getByRole('radio').nth(3);

        this.createChecksumBtn =
            page.getByRole('button', { name: 'create checksum' });

        this.submitBtn =
            page.getByRole('button', { name: /submit/i });

        this.checkoutHeader = page.locator('div').filter({ hasText: /Order value ₹/i });
    }

    async open() {
        try {
            await this.page.goto('/merchant-demo');
        } catch {
            await this.page.goto('https://snapmint:ciHns$%40NKSa@admin.qa.snmt.link/merchant-demo');
        }
    }

    async fillMerchantDetails(data) {
        if (data.mobile) {
            await this.mobile.click();
            await this.mobile.fill(data.mobile);
        }

        if (data.merchantId) {
            await this.merchantId.click();
            await this.merchantId.fill(data.merchantId);
        }

        if (data.storeId) {
            await this.storeId.click();
            await this.storeId.fill(data.storeId);
        }

        if (data.orderId) {
            await this.orderId.click();
            await this.orderId.fill(data.orderId);
        }

        if (data.orderValue) {
            await this.orderValue.click();
            await this.orderValue.fill(data.orderValue);
        }

        if (data.shippingFees) {
            await this.shippingFees.click();
            await this.shippingFees.fill(data.shippingFees);
        }

        if (await this.resetUserData.isVisible().catch(() => false)) {
            await this.resetUserData.click();
        }

        if (data.fullName) {
            await this.fullName.click();
            await this.fullName.fill(data.fullName);
        }

        if (data.email) {
            await this.email.click();
            await this.email.fill(data.email);
        }

        if (await this.resetLoanAddresses.isVisible().catch(() => false)) {
            await this.resetLoanAddresses.click();
        }

        if (await this.resetShippingAddresses.isVisible().catch(() => false)) {
            await this.resetShippingAddresses.click();
        }

        if (await this.resetCartProducts.isVisible().catch(() => false)) {
            await this.resetCartProducts.click();
        }

        await this.checksumRadio.check();
    }

    async submitMerchantForm() {
        await this.createChecksumBtn.click();
        await expect(this.submitBtn).toBeVisible({ timeout: 10000 });
        await this.submitBtn.click();
    }

    async verifyCheckoutHeader(expectedText = 'Order value ₹') {
        const header = this.page.locator('div').filter({ hasText: expectedText });
        await expect(header.first()).toBeVisible({ timeout: 30000 });
    }
}
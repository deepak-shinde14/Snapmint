import { expect } from '@playwright/test';

export class MerchantDemoPage {

    constructor(page) {
        this.page = page;

        this.mobile = page.locator('#new-mobile');
        this.merchantId = page.locator('input[name="merchant_id"]');
        this.orderId = page.locator('input[name="order_id"]');
        this.orderValue = page.locator('input[name="order_value"]');
        this.fullName = page.locator('input[name="full_name"]');
        this.email = page.locator('input[name="email"]');

        this.createChecksumBtn =
            page.getByRole('button', { name: 'create checksum' });

        this.submitBtn =
            page.getByRole('button', { name: 'submit' });
    }

    async open() {
        await this.page.goto('/merchant-demo');
    }

    async fillMerchantDetails(data) {

        await this.mobile.fill(data.mobile);

        await this.merchantId.fill(data.merchantId);

        await this.orderId.fill(data.orderId);

        await this.orderValue.fill(data.orderValue);

        await this.fullName.fill(data.fullName);

        await this.email.fill(data.email);

        await this.page.getByRole('radio').nth(3).check();
    }

    async submitMerchantForm() {
        await this.createChecksumBtn.click();

        const submitBtn = this.page.getByRole('button', { name: /submit/i });

        await expect(submitBtn).toBeVisible({ timeout: 10000 });
        await submitBtn.click();
    }
}
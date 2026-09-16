import { expect } from '@playwright/test';

export class OrderConfirmationPage {

    constructor(page) {

        this.page = page;

        this.confirmOrder =
            page.getByRole('button', {
                name: 'Confirm Order'
            });
    }

    async confirm() {
        await expect(this.confirmOrder).toBeVisible({ timeout: 30000 });

        await this.confirmOrder.click();
    }

    async verifyWebSuccess() {
        await expect(this.page.getByText(/Payment Received/i)).toBeVisible({ timeout: 60000 });
        await expect(this.page.getByText(/Payment id/i).first()).toBeVisible({ timeout: 60000 });
    }

    async verifyMerchantSuccess() {
        await this.page.waitForURL(/.*success.*/, { timeout: 60000 });
        await expect(this.page).toHaveURL(/.*success.*/);
    }
}
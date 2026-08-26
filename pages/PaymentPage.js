export class PaymentPage {
    constructor(page) {
        this.page = page;

        // Old flow
        this.planOption = page.locator('div').filter({
            hasText: /Pay only .* Now/i,
        }).first();
        this.planCheckbox = page.getByRole('checkbox').first();
        this.payInstallmentsBtn = page.getByRole('button', {
            name: /Pay in \d+ Monthly Installments/i,
        });

        this.upiOption = page.getByText(/Enter UPI ID/i);
        this.upiInput = page.getByPlaceholder(' ');
        this.payUpiBtn = page.getByRole('button', { name: /Pay ₹/i });

        this.simulationTrigger = page.getByText(/stimulate success\/failure/i);

        // New flow
        this.confirmOrderBtn = page.getByRole('button', {
            name: 'Confirm Order',
        });
    }

    async continueCheckout(upiId = '999999999@upi') {
        // Allow navigation/redirects to complete
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(1000);
        // ----------------------------
        // New Flow
        // Confirm Order -> Success
        // ----------------------------
        if (await this.confirmOrderBtn.isVisible().catch(() => false)) {
            console.log('New checkout flow detected.');

            await this.confirmOrderBtn.click();
            return;
        }

        // ----------------------------
        // Old Flow
        // EMI Plan -> UPI
        // ----------------------------
        if (await this.payInstallmentsBtn.isVisible().catch(() => false)) {
            console.log('Old checkout flow detected.');

            if (await this.planCheckbox.isVisible().catch(() => false)) {
                await this.planCheckbox.check();
            }

            await this.payInstallmentsBtn.click();

            await this.payViaUPI(upiId);
            await this.simulateSuccess();
            return;
        }

        throw new Error('Unable to determine checkout flow.');
    }

    async payViaUPI(upiId) {
        await this.upiOption.waitFor({ state: 'visible' });

        await this.upiOption.click();
        await this.upiInput.fill(upiId);
        await this.payUpiBtn.click();
    }

    async simulateSuccess() {
        const popupPromise = this.page.waitForEvent('popup');

        await this.simulationTrigger.click();

        const popup = await popupPromise;

        await popup
            .getByRole('button', {
                name: 'Simulate Success transaction',
            })
            .click();

        await popup.getByRole('button', { name: 'GOT IT' }).click();
    }
}
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

        // Net Banking and PayU simulator flow
        this.selectPaymentMethodAccordion = page.getByText(/Select Payment Method/i);
        this.netBankingOption = page.getByText('Net Banking', { exact: true }).or(page.getByText(/Net Banking/i));
        this.bankHdfc = page.getByRole('img', { name: /HDFB/i }).or(page.getByText(/HDFB|HDFC/i));
        this.termsCheckbox = page.getByLabel('').or(page.getByRole('checkbox')).or(page.locator('input[type="checkbox"]'));
        this.payBtn = page.getByRole('button', { name: /Pay ₹|Pay/i });

        this.payuUsernameInput = page.getByRole('textbox', { name: /Enter payu as username/i }).or(page.locator('input[name="username"]'));
        this.payuPasswordInput = page.getByRole('textbox', { name: /Enter payu as password/i }).or(page.locator('input[name="password"]'));
        this.payuSubmitBtn = page.getByRole('button', { name: /Submit/i });
        this.payuSimulateSuccessBtn = page.getByRole('button', { name: /Simulate Success Response/i });
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

        // ----------------------------
        // Merchant Flow
        // Net Banking -> PayU Simulator
        // ----------------------------
        if (await this.netBankingOption.isVisible().catch(() => false) || this.page.url().includes('/dp')) {
            console.log('Merchant Net Banking checkout flow detected.');
            await this.handleMerchantPayment();
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

    async payViaNetBanking({ bank = 'HDFB' } = {}) {
        await this.page.waitForLoadState('domcontentloaded');

        // Only click accordion if Net Banking option is not visible yet
        if (!(await this.netBankingOption.first().isVisible().catch(() => false))) {
            if (await this.selectPaymentMethodAccordion.first().isVisible({ timeout: 5000 }).catch(() => false)) {
                await this.selectPaymentMethodAccordion.first().click().catch(() => {});
            }
        }

        // Click Net Banking
        await this.netBankingOption.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.netBankingOption.first().click();

        // Select Bank (e.g. HDFB)
        const bankLocator = bank === 'HDFB'
            ? this.bankHdfc.first()
            : this.page.getByRole('img', { name: new RegExp(bank, 'i') }).or(this.page.getByText(bank)).first();
        await bankLocator.waitFor({ state: 'visible', timeout: 15000 });
        await bankLocator.click();

        // Accept terms checkbox if present
        const checkbox = this.termsCheckbox.first();
        if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
            await checkbox.check();
        }

        // Click Pay button
        await this.payBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.payBtn.first().click();
    }

    async completePayUSimulation({ username = 'payu', password = 'payu' } = {}) {
        // Wait for PayU simulation username field
        await this.payuUsernameInput.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.payuUsernameInput.first().click();
        await this.payuUsernameInput.first().fill(username);

        await this.payuPasswordInput.first().click();
        await this.payuPasswordInput.first().fill(password);

        await this.payuSubmitBtn.first().click();

        // Wait for Simulate Success Response button
        await this.payuSimulateSuccessBtn.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.payuSimulateSuccessBtn.first().click();
    }

    async handleMerchantPayment({ bank = 'HDFB', username = 'payu', password = 'payu' } = {}) {
        await this.payViaNetBanking({ bank });
        await this.completePayUSimulation({ username, password });
    }
}
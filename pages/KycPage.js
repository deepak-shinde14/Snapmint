export class KycPage {

    constructor(page) {

        this.page = page;
        this.otpField = page.getByText(/Enter OTP sent to/i);
        this.otpInput = page.getByRole('textbox');
        this.panField = page.locator('#pan');
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.goToDigilockerBtn = page.getByRole('button', { name: /Go to DigiLocker|Proceed to DigiLocker/i });
        this.successBtn = page.getByRole('button', { name: /Success/i });
    }

    async enterOtp(otp) {
        const isOtpVisible = await this.otpField
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        if (!isOtpVisible) {
            console.log('OTP page skipped.');
            return false;
        }

        await this.otpInput.fill(otp);
        return true;
    }

    async enterPan(pan) {
        await this.panField.waitFor({ state: 'visible' });
        await this.panField.pressSequentially(pan, { delay: 50 });
        await this.nextBtn.click();
    }

    async selectGender(gender = 'Male') {
        const genderRadio = this.page.getByRole('radio', {
            name: gender,
            exact: true,
        });

        if (await genderRadio.isVisible().catch(() => false)) {
            await genderRadio.check();
            console.log(`${gender} selected.`);
        } else {
            console.log('Gender selection skipped.');
        }
    }

    async selectWebGender(gender = 'Male') {
        const genderRadio = await this.page.getByRole('radio', { name: gender, exact: true });
        if (await genderRadio.isVisible().catch(() => false)) {
            await genderRadio.check();
            console.log(`${gender} selected.`);
        } else {
            console.log('Gender selection skipped.');
        }
    }

    async selectDob() {
        const dobPicker = this.page.locator('.ant-picker-input');

        const isVisible = await dobPicker.isVisible().catch(() => false);

        if (!isVisible) {
            console.log('DOB selection skipped.');
            return;
        }

        await dobPicker.click();

        // Switch to decade view if needed
        await this.page.getByRole('button', { name: '2008' }).click();

        // Select year
        await this.page
            .locator('.ant-picker-dropdown')
            .getByText('2000', { exact: true })
            .click();

        // Select month
        await this.page.getByText('May', { exact: true }).click();

        // Select day
        await this.page.getByRole('cell', { name: '27', exact: true }).click();

        console.log('DOB selected.');
    }

    async selectWebDob(day = '1', month = 'Jan', year = '2000') {
        const dayDropdown = this.page.locator('#rc_select_0');

        if (!(await dayDropdown.isVisible().catch(() => false))) {
            console.log('DOB selection skipped.');
            return;
        }

        // Day
        await dayDropdown.click();
        await this.page.locator('.ant-select-item-option', { hasText: day }).click();

        // Month
        await this.page.locator('#rc_select_1').click();
        await this.page.locator('.ant-select-item-option', { hasText: month }).click();

        // Year
        await this.page.locator('#rc_select_2').click();
        await this.page.locator('.ant-select-item-option', { hasText: year }).click();

        console.log('DOB selected.');
    }

    async handleWebDigilocker() {
        // Skip if DigiLocker flow is not applicable
        const isDigilockerVisible = await this.goToDigilockerBtn
            .isVisible({ timeout: 3000 })
            .catch(() => false);

        if (!isDigilockerVisible) {
            console.log('Digilocker skipped.');
            return;
        }

        // Optional trigger
        const trigger = this.page
            .locator('div')
            .filter({ hasText: /^Go To Digilocker$/ })
            .nth(1);

        if (await trigger.isVisible().catch(() => false)) {
            await trigger.click();
        }

        await this.goToDigilockerBtn.click();

        await this.successBtn.waitFor({
            state: 'visible',
            timeout: 15000,
        });

        await this.successBtn.click();

        console.log('Digilocker completed.');
    }

    async proceed() {

        const isNextBtnVisible = await this.nextBtn
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        if (!isNextBtnVisible) {
            console.log('Next button not visible. Skipping proceed.');
            return false;
        }
        await this.nextBtn.click();
        return true;
    }
}
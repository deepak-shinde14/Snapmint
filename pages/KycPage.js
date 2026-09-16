export class KycPage {

    constructor(page) {
        this.page = page;
        this.otpField = page.getByRole('textbox', { name: /Enter OTP/i }).or(page.getByText(/Enter OTP/i)).first();
        this.otpInput = page.getByRole('textbox', { name: /Enter OTP/i }).or(page.getByRole('textbox')).first();
        this.panField = page.locator('#pan, input[name="pan"]').or(page.getByPlaceholder(' ')).first();
        this.genderRadio = page.getByRole('radio', { name: /Male/i });
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.verifyCreditBtn = page.getByRole('button', { name: /Verify Credit Eligibility|Verify/i });
        this.goToDigilockerBtn = page.getByRole('button', { name: /Go to DigiLocker|Proceed to DigiLocker/i });
        this.successBtn = page.getByRole('button', { name: /Success/i });
    }

    async enterOtp(otp) {
        const input = this.page.getByRole('textbox', { name: /Enter OTP/i }).or(this.otpInput).first();
        const isOtpVisible = await input
            .isVisible({ timeout: 10000 })
            .catch(() => false);

        if (!isOtpVisible) {
            console.log('OTP page skipped.');
            return false;
        }

        await input.click();
        await input.fill(otp);

        // If "Verify Credit Eligibility" button becomes enabled, click it
        const verifyBtn = this.verifyCreditBtn.first();
        if (await verifyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.page.waitForTimeout(500);
            if (await verifyBtn.isEnabled({ timeout: 3000 }).catch(() => false)) {
                await verifyBtn.click().catch(() => {});
            }
        }
        return true;
    }

    async enterPan(pan, clickNext = false) {
        const panInput = this.page.getByPlaceholder(' ').or(this.page.locator('#pan')).or(this.page.locator('input[name="pan"]')).first();
        await panInput.waitFor({ state: 'visible', timeout: 30000 });
        await panInput.click();
        await panInput.fill(pan);
        if (clickNext) {
            await this.nextBtn.click();
        }
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

    async selectMerchantDob(day = '5', month = 'May', year = '2002') {
        const daySelect = this.page.locator('#rc_select_0');
        if (!(await daySelect.isVisible({ timeout: 5000 }).catch(() => false))) {
            console.log('Merchant DOB select dropdown not visible, trying fallback...');
            return await this.selectDob();
        }

        // 1. Day
        await daySelect.click();
        const dayOption = this.page.getByTitle(String(day)).or(this.page.locator('.ant-select-item-option', { hasText: new RegExp(`^${day}$`) }));
        await dayOption.first().click();

        // 2. Month
        const monthSelect = this.page.locator('#rc_select_1');
        await monthSelect.click();
        const monthOption = this.page.getByTitle(month).or(this.page.locator('.ant-select-item-option', { hasText: month }));
        await monthOption.first().click();

        // 3. Year
        const yearSelect = this.page.locator('#rc_select_2');
        await yearSelect.click();
        const yearOption = this.page.getByTitle(String(year)).or(this.page.locator('.ant-select-item-option', { hasText: new RegExp(`^${year}$`) }));

        try {
            await yearOption.first().scrollIntoViewIfNeeded({ timeout: 2000 });
            await yearOption.first().click({ timeout: 2000 });
        } catch {
            const intermediate = this.page.getByText('2004');
            if (await intermediate.first().isVisible().catch(() => false)) {
                await intermediate.first().click().catch(() => {});
            }
            await yearOption.first().scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
            await yearOption.first().click();
        }

        console.log(`Merchant DOB selected: ${day}-${month}-${year}`);
    }

    async fillPersonalDetails({ pan, gender = 'Male', dob = { day: '5', month: 'May', year: '2002' } }) {
        if (pan) {
            await this.enterPan(pan, false);
        }

        await this.selectGender(gender);

        if (dob) {
            await this.selectMerchantDob(dob.day, dob.month, dob.year);
        }

        await this.proceed();
    }

    async handleDigilocker() {
        await this.goToDigilockerBtn.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.goToDigilockerBtn.first().click();

        await this.successBtn.first().waitFor({
            state: 'visible',
            timeout: 30000,
        });

        await this.successBtn.first().click();
        console.log('Digilocker success clicked, waiting for KYC completion/redirect...');

        // Wait for page to navigate away from /kyc or reach /dp
        await this.page.waitForURL((url) => !url.href.includes('/kyc') || url.href.includes('/dp'), {
            timeout: 60000,
        }).catch(() => {});

        // Wait for loading backdrop overlay to clear if present
        await this.page.locator('.backdrop-blur-\\[20px\\]').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

        console.log('Digilocker completed. Current URL:', this.page.url());
    }

    async isPersonalDetailsVisible() {
        const url = this.page.url();
        if (url.includes('/dp') || url.includes('/otp') || url.includes('/address') || url.includes('/kyc')) {
            return false;
        }

        if (url.includes('/profile')) {
            return true;
        }

        return (
            await this.genderRadio.first().isVisible().catch(() => false) ||
            await this.page.locator('#rc_select_0').isVisible().catch(() => false)
        );
    }

    async proceed() {
        const button = this.page.getByRole('button', { name: /Next|Verify Credit Eligibility|Verify|Proceed|Submit/i }).first();

        const isVisible = await button
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        if (!isVisible) {
            console.log('Next/Proceed button not visible. Skipping proceed.');
            return false;
        }

        if (await button.isEnabled({ timeout: 3000 }).catch(() => false)) {
            await button.click().catch(() => {});
            return true;
        }
        return false;
    }
}
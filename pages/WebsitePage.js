import { expect } from '@playwright/test';

export class WebsitePage {
    constructor(page) {
        this.page = page;
        this.signUpBtn = page.getByRole('button', { name: 'Sign Up' });
        this.mobileInput = page.locator('#mobile');
        this.signInSignUpHeader = page.getByText('Sign In / Sign Up');
        this.getOtpBtn = page.getByRole('button', { name: 'Get OTP' });
        this.otpSentText = page.getByText('OTP sent to +91');
        this.otpInput = page.getByRole('textbox', { name: 'OTP' });
        this.nextBtn = page.getByRole('button', { name: 'Next', exact: true });

        // Product page selectors
        this.productEmiOption = page.getByText(/x 3 months/i).first(); // Matches EMI plan on product page
        this.buyEmiBtn = page.getByRole('button', { name: 'Buy on 3 months EMI' });
        this.sizeDropdown = page.getByRole('combobox').nth(1);
        this.sizeOption = page.getByTitle('5 (UK/INDIA)');
    }

    async open() {
        await this.page.goto('/', {
            waitUntil: 'load',
            timeout: 60000,
        });
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await expect(
            this.page.getByRole('button', { name: 'Sign Up' })
        ).toBeVisible();
    }

    async signUp(mobile, otp) {
        await this.signUpBtn.click();
        console.log('Clicked Sign Up button');

        // Handle client-side hydration delay where the first click might not trigger the modal
        try {
            await this.mobileInput.waitFor({ state: 'visible', timeout: 5000 });
        } catch (e) {
            console.log('Sign Up modal did not appear. Retrying click...');
            await this.signUpBtn.click();
            await this.mobileInput.waitFor({ state: 'visible', timeout: 10000 });
        }
        //await expect(this.page.signInSignUpHeader).toBeVisible();
        await this.mobileInput.click();
        console.log('Clicked Mobile Input field');
        await this.mobileInput.click();
        await this.mobileInput.fill(mobile);
        await expect(this.getOtpBtn).toBeVisible();
        await this.getOtpBtn.click();
        await expect(this.otpSentText).toBeVisible();
        await expect(this.otpInput).toBeVisible();
        await this.otpInput.click();
        await this.otpInput.fill(otp);
        await this.nextBtn.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.signUpBtn).toBeHidden({
            timeout: 60000,
        });
        console.log('Current URL:', this.page.url());
        console.log('Title:', await this.page.title());
        await this.page.screenshot({
            path: 'after-next.png',
            fullPage: true,
        });
    }

    async selectProductAndBuy() {
        await this.page.goto('p/oneplus-nord-buds-2r-true-wireless-in-ear-earbuds-with-mic-12-4mm-drivers-playback-upto-38hr-case-4-mic-design-ip55-rating-deep-grey-truly-wireless-earphones-tws-on-emi?source=home',
            {
                waitUntil: 'domcontentloaded',
            }
        );

        const emiText = this.page.getByText(/Pay only .* now/i);
        if (await emiText.isVisible()) {
            await emiText.click();
        }
        await this.productEmiOption.click();
        await this.buyEmiBtn.click();

        // Handle size dropdown if visible
        if (await this.sizeDropdown.isVisible()) {
            await this.sizeDropdown.click();
            await this.sizeOption.click();
            await this.page.locator('html').click();
            await this.buyEmiBtn.click();
        }
    }
}

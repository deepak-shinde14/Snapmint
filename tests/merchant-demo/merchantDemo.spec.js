import { test } from '../../fixtures/testFixture';
import merchantData from '../../test-data/merchantDemo.json';

async function waitForNextState(kycPage, orderPage) {
    await Promise.any([
        kycPage.otpField.waitFor({ state: 'visible', timeout: 60000 }),
        kycPage.panField.waitFor({ state: 'visible', timeout: 60000 }),
        kycPage.goToDigilockerBtn.waitFor({ state: 'visible', timeout: 60000 }),
        orderPage.confirmOrder.waitFor({ state: 'visible', timeout: 60000 }),
    ]).catch(() => { });
}

async function determineNextAction(page, kycPage, orderPage) {
    await page.waitForLoadState('domcontentloaded');

    if (await kycPage.otpField.isVisible().catch(() => false))
        return 'OTP';

    if (await kycPage.panField.isVisible().catch(() => false))
        return 'PERSONAL_DETAILS';

    if (await kycPage.goToDigilockerBtn.isVisible().catch(() => false))
        return 'DIGILOCKER';

    if (await orderPage.confirmOrder.isVisible().catch(() => false))
        return 'CONFIRM_ORDER';

    return 'UNKNOWN';
}

test('Merchant Demo Complete Journey', async ({
    page,
    merchantPage,
    kycPage,
    orderPage,
}) => {

    await merchantPage.open();

    await merchantPage.fillMerchantDetails({
        mobile: merchantData.mobile,
        merchantId: merchantData.merchantId,
        orderId: merchantData.orderId,
        orderValue: merchantData.orderValue,
        fullName: merchantData.fullName,
        email: merchantData.email,
    });

    await merchantPage.submitMerchantForm();

    await page.waitForURL(/pay\.qa\.snmt\.link/, {
        timeout: 600000,
    });

    // Prevent infinite loops
    for (let i = 0; i < 10; i++) {

        await waitForNextState(kycPage, orderPage);

        const state = await determineNextAction(page, kycPage, orderPage);

        console.log(`Current State: ${state}`);
        console.log(`URL: ${page.url()}`);

        switch (state) {

            case 'OTP':
                console.log('Entering OTP...');
                await kycPage.enterOtp(merchantData.merchantDemoOtp);
                await kycPage.proceed();
                break;

            case 'PERSONAL_DETAILS':
                console.log('Filling Personal Details...');
                await kycPage.enterPan(merchantData.pan);
                await kycPage.selectGender();
                await kycPage.selectDob();
                await kycPage.goToDigilockerBtn.click();
                break;

            case 'DIGILOCKER':
                console.log('Handling Digilocker...');
                await kycPage.goToDigilockerBtn.click();
                await kycPage.successBtn.click();
                break;

            case 'CONFIRM_ORDER':
                console.log('Confirming Order...');
                await orderPage.confirm();
                return;

            case 'UNKNOWN':
            default: {
                const url = page.url();

                console.log('Unknown state');
                console.log(url);

                console.log({
                    otp: await kycPage.otpField.isVisible().catch(() => false),
                    pan: await kycPage.panField.isVisible().catch(() => false),
                    digilocker: await kycPage.goToDigilockerBtn.isVisible().catch(() => false),
                    confirm: await orderPage.confirmOrder.isVisible().catch(() => false),
                });

                await page.screenshot({
                    path: `test-results/unknown-state-${Date.now()}.png`,
                    fullPage: true,
                });

                if (url.includes('/failed') || url.includes('/failure')) {
                    throw new Error(`Merchant flow failed. URL: ${url}`);
                }

                throw new Error(`Unexpected page state. URL: ${url}`);
            }
        }
    }

    throw new Error('Merchant flow exceeded maximum number of steps.');
});
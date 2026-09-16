import { test, expect } from '../../fixtures/testFixture';
import merchantData from '../../test-data/merchantDemo.json';

async function waitForNextState(kycPage, addressPage, paymentPage, orderPage) {
    await Promise.any([
        kycPage.otpField.waitFor({ state: 'visible', timeout: 30000 }),
        addressPage.addressLine1.waitFor({ state: 'visible', timeout: 30000 }),
        kycPage.genderRadio.first().waitFor({ state: 'visible', timeout: 30000 }),
        kycPage.goToDigilockerBtn.waitFor({ state: 'visible', timeout: 30000 }),
        paymentPage.netBankingOption.first().waitFor({ state: 'visible', timeout: 30000 }),
        paymentPage.payBtn.first().waitFor({ state: 'visible', timeout: 30000 }),
        paymentPage.payuUsernameInput.first().waitFor({ state: 'visible', timeout: 30000 }),
        paymentPage.payuSimulateSuccessBtn.first().waitFor({ state: 'visible', timeout: 30000 }),
        orderPage.confirmOrder.waitFor({ state: 'visible', timeout: 30000 }),
    ]).catch(() => { });
}

async function determineNextAction(page, kycPage, addressPage, paymentPage, orderPage) {
    await page.waitForLoadState('domcontentloaded');

    const url = page.url();
    if (url.includes('/success')) {
        return 'SUCCESS';
    }

    if (url.includes('payu') ||
        await paymentPage.payuUsernameInput.first().isVisible().catch(() => false) ||
        await paymentPage.payuSimulateSuccessBtn.first().isVisible().catch(() => false)) {
        return 'PAYU_SIMULATION';
    }

    if (url.includes('/dp') ||
        await paymentPage.netBankingOption.first().isVisible().catch(() => false) ||
        await paymentPage.selectPaymentMethodAccordion.first().isVisible().catch(() => false) ||
        await paymentPage.payBtn.first().isVisible().catch(() => false)) {
        return 'PAYMENT';
    }

    if (url.includes('/otp') || await kycPage.otpField.isVisible().catch(() => false))
        return 'OTP';

    if (url.includes('/address') || await addressPage.addressLine1.isVisible().catch(() => false))
        return 'ADDRESS';

    if (url.includes('/profile') || await kycPage.isPersonalDetailsVisible())
        return 'PERSONAL_DETAILS';

    // If on /kyc and polling, wait for redirect
    if (url.includes('/kyc')) {
        if (url.includes('poll=true')) {
            console.log('KYC is polling/processing, waiting for redirect...');
            await page.waitForURL((u) => !u.href.includes('/kyc') || u.href.includes('/dp'), { timeout: 30000 }).catch(() => {});
            return await determineNextAction(page, kycPage, addressPage, paymentPage, orderPage);
        }
        if (await kycPage.goToDigilockerBtn.first().isVisible().catch(() => false)) {
            return 'DIGILOCKER';
        }
    }

    if (await kycPage.goToDigilockerBtn.first().isVisible().catch(() => false))
        return 'DIGILOCKER';

    if (await orderPage.confirmOrder.isVisible().catch(() => false))
        return 'CONFIRM_ORDER';

    return 'UNKNOWN';
}

test('Merchant Demo Complete Journey', async ({
    page,
    merchantPage,
    kycPage,
    addressPage,
    paymentPage,
    orderPage,
}) => {

    const allowedBaseUrls = [
        'https://admin.qa.snmt.link',
        'https://pay.qa.snmt.link',
        'https://api.qa.snmt.link',
        'https://apis.qa.snmt.link',
        'https://qaapi.snapmint.com',
        'https://qa-super-apis.snapmint.com',
        'https://apis.qa.snapmint.com',
        'https://pay.qa.snapmint.com',
        'https://qa.snapmint.com',
    ];

    function shouldLog(url) {
        return allowedBaseUrls.some(base => url.startsWith(base)) || url.includes('snmt.link') || url.includes('snapmint.com');
    }

    page.on('request', async (request) => {
        if (!shouldLog(request.url())) return;

        console.log("\n========== REQUEST ==========");
        console.log("Resource Type :", request.resourceType());
        console.log("Method :", request.method());
        console.log("URL    :", request.url());
        console.log("Headers:", request.headers());

        if (request.postData()) {
            console.log("Body   :", request.postData());
        }
    });

    page.on('response', async (response) => {
        if (!shouldLog(response.url())) return;

        console.log("\n========== RESPONSE ==========");
        console.log("Status :", response.status());
        console.log("URL    :", response.url());

        try {
            console.log("Body   :", await response.text());
        } catch (e) {
            console.log("Unable to read response body");
        }
    });

    // 1. Open Merchant Demo page
    await merchantPage.open();

    // 2. Fill Merchant Demo form with updated locators and test data
    await merchantPage.fillMerchantDetails({
        mobile: merchantData.mobile,
        merchantId: merchantData.merchantId,
        storeId: merchantData.storeId,
        orderId: merchantData.orderId,
        orderValue: merchantData.orderValue,
        shippingFees: merchantData.shippingFees,
        fullName: merchantData.fullName,
        email: merchantData.email,
    });

    // 3. Submit Merchant Form
    await merchantPage.submitMerchantForm();

    // 4. Wait for redirect to checkout URL
    await page.waitForURL(/pay\.qa\.snmt\.link/, {
        timeout: 600000,
    });

    // Optional verification of order value header
    await merchantPage.verifyCheckoutHeader().catch(() => {});

    // 5. Handle dynamic checkout journey
    for (let i = 0; i < 15; i++) {

        await waitForNextState(kycPage, addressPage, paymentPage, orderPage);

        const state = await determineNextAction(page, kycPage, addressPage, paymentPage, orderPage);

        console.log(`Current State: ${state}`);
        console.log(`URL: ${page.url()}`);

        switch (state) {

            case 'OTP':
                console.log('Entering OTP...');
                await kycPage.enterOtp(merchantData.merchantDemoOtp);
                await kycPage.proceed();
                break;

            case 'ADDRESS':
                console.log('Filling Shipping Address...');
                await addressPage.fillMerchantAddress(
                    merchantData.addressLine1,
                    merchantData.addressLine2,
                    merchantData.pincode
                );
                break;

            case 'PERSONAL_DETAILS':
                console.log('Filling Personal Details...');
                await kycPage.fillPersonalDetails({
                    pan: merchantData.pan,
                    gender: merchantData.gender,
                    dob: merchantData.dob,
                });
                break;

            case 'DIGILOCKER':
                console.log('Handling Digilocker...');
                await kycPage.handleDigilocker();
                break;

            case 'PAYMENT':
                console.log('Selecting Net Banking payment...');
                await paymentPage.payViaNetBanking({
                    bank: merchantData.bank || 'HDFB',
                });
                break;

            case 'PAYU_SIMULATION':
                console.log('Completing PayU Simulation...');
                await paymentPage.completePayUSimulation({
                    username: merchantData.payuUsername || 'payu',
                    password: merchantData.payuPassword || 'payu',
                });
                await orderPage.verifyMerchantSuccess();
                return;

            case 'CONFIRM_ORDER':
                console.log('Confirming Order...');
                await orderPage.confirm();
                return;

            case 'SUCCESS':
                console.log('Merchant flow completed successfully.');
                await orderPage.verifyMerchantSuccess();
                return;

            case 'UNKNOWN':
            default: {
                const url = page.url();

                if (url.includes('/success')) {
                    console.log('Success URL detected in UNKNOWN state.');
                    await orderPage.verifyMerchantSuccess();
                    return;
                }

                console.log('Unknown state');
                console.log(url);

                console.log({
                    otp: await kycPage.otpField.isVisible().catch(() => false),
                    address: await addressPage.addressLine1.isVisible().catch(() => false),
                    pan: await kycPage.panField.isVisible().catch(() => false),
                    digilocker: await kycPage.goToDigilockerBtn.isVisible().catch(() => false),
                    netbanking: await paymentPage.netBankingOption.first().isVisible().catch(() => false),
                    payu: await paymentPage.payuUsernameInput.first().isVisible().catch(() => false),
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
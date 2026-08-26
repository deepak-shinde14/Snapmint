import { test } from '../../fixtures/testFixture';
import merchantData from '../../test-data/merchantDemo.json';

test('Website EMI Purchase Flow', async ({
    page,
    websitePage,
    addressPage,
    kycPage,
    paymentPage,
    orderPage,
}) => {

    const allowedBaseUrls = [
        'https://qa.snapmint.com',
        'https://qaapi.snapmint.com',
        'https://qa-super-apis.snapmint.com',
        'https://apis.qa.snapmint.com',
        'https://pay.qa.snapmint.com',
    ];

    function shouldLog(url) {
        return allowedBaseUrls.some(base => url.startsWith(base));
    }

    page.on('request', async (request) => {
        if (!shouldLog(request.url())) return;

        console.log("\n========== REQUEST ==========");
        console.log("Resource Type :", request.resourceType(),);
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

    // 1. Open the website and Sign Up/Sign In
    await websitePage.open();

    await websitePage.signUp(merchantData.mobile, merchantData.websiteOtp);

    // 2. Select product and proceed to EMI purchase
    await websitePage.selectProductAndBuy();

    // 3. Enter shipping address details
    await addressPage.fillAddress('A-27, gajanan nagar', 'ulhasnagar', 'Near Railway Station', '452001');

    // 4. Fill KYC Personal Details (Gender and Date of Birth)
    await kycPage.selectWebGender('Male');
    await kycPage.selectWebDob('1', 'Jan', '2000');
    await kycPage.proceed();

    // 5. Authenticate via mock Digilocker
    await kycPage.handleWebDigilocker();

    // 6. Continue checkout (handles both old and new flows)
    await paymentPage.continueCheckout('999999999@upi');

    // 7. Verify the order and payment success state
    await orderPage.verifyWebSuccess();
});

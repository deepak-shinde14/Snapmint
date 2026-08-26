# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/merchant-demo/merchantDemo.spec.js >> Merchant Demo Complete Journey
- Location: tests/merchant-demo/merchantDemo.spec.js:31:5

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForURL: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://pay.qa.snmt.link/?cv2=true&id=259050&merchant_id=1616&message=Success&mobile=9195865388&status=Success&token=3m9VbswmVjB7quDM6hTe"
============================================================
```

# Test source

```ts
  1   | import { test } from '../../fixtures/testFixture';
  2   | import merchantData from '../../test-data/merchantDemo.json';
  3   | 
  4   | async function waitForNextState(kycPage, orderPage) {
  5   |     await Promise.any([
  6   |         kycPage.otpField.waitFor({ state: 'visible', timeout: 60000 }),
  7   |         kycPage.panField.waitFor({ state: 'visible', timeout: 60000 }),
  8   |         kycPage.goToDigilockerBtn.waitFor({ state: 'visible', timeout: 60000 }),
  9   |         orderPage.confirmOrder.waitFor({ state: 'visible', timeout: 60000 }),
  10  |     ]).catch(() => { });
  11  | }
  12  | 
  13  | async function determineNextAction(page, kycPage, orderPage) {
  14  |     await page.waitForLoadState('domcontentloaded');
  15  | 
  16  |     if (await kycPage.otpField.isVisible().catch(() => false))
  17  |         return 'OTP';
  18  | 
  19  |     if (await kycPage.panField.isVisible().catch(() => false))
  20  |         return 'PERSONAL_DETAILS';
  21  | 
  22  |     if (await kycPage.goToDigilockerBtn.isVisible().catch(() => false))
  23  |         return 'DIGILOCKER';
  24  | 
  25  |     if (await orderPage.confirmOrder.isVisible().catch(() => false))
  26  |         return 'CONFIRM_ORDER';
  27  | 
  28  |     return 'UNKNOWN';
  29  | }
  30  | 
  31  | test('Merchant Demo Complete Journey', async ({
  32  |     page,
  33  |     merchantPage,
  34  |     kycPage,
  35  |     orderPage,
  36  | }) => {
  37  | 
  38  |     await merchantPage.open();
  39  | 
  40  |     await merchantPage.fillMerchantDetails({
  41  |         mobile: merchantData.mobile,
  42  |         merchantId: merchantData.merchantId,
  43  |         orderId: merchantData.orderId,
  44  |         orderValue: merchantData.orderValue,
  45  |         fullName: merchantData.fullName,
  46  |         email: merchantData.email,
  47  |     });
  48  | 
  49  |     await merchantPage.submitMerchantForm();
  50  | 
> 51  |     await page.waitForURL(/pay\.qa\.snmt\.link/, {
      |                ^ Error: page.waitForURL: Target page, context or browser has been closed
  52  |         timeout: 600000,
  53  |     });
  54  | 
  55  |     // Prevent infinite loops
  56  |     for (let i = 0; i < 10; i++) {
  57  | 
  58  |         await waitForNextState(kycPage, orderPage);
  59  | 
  60  |         const state = await determineNextAction(page, kycPage, orderPage);
  61  | 
  62  |         console.log(`Current State: ${state}`);
  63  |         console.log(`URL: ${page.url()}`);
  64  | 
  65  |         switch (state) {
  66  | 
  67  |             case 'OTP':
  68  |                 console.log('Entering OTP...');
  69  |                 await kycPage.enterOtp(merchantData.merchantDemoOtp);
  70  |                 await kycPage.proceed();
  71  |                 break;
  72  | 
  73  |             case 'PERSONAL_DETAILS':
  74  |                 console.log('Filling Personal Details...');
  75  |                 await kycPage.enterPan(merchantData.pan);
  76  |                 await kycPage.selectGender();
  77  |                 await kycPage.selectDob();
  78  |                 await kycPage.goToDigilockerBtn.click();
  79  |                 break;
  80  | 
  81  |             case 'DIGILOCKER':
  82  |                 console.log('Handling Digilocker...');
  83  |                 await kycPage.goToDigilockerBtn.click();
  84  |                 await kycPage.successBtn.click();
  85  |                 break;
  86  | 
  87  |             case 'CONFIRM_ORDER':
  88  |                 console.log('Confirming Order...');
  89  |                 await orderPage.confirm();
  90  |                 return;
  91  | 
  92  |             case 'UNKNOWN':
  93  |             default: {
  94  |                 const url = page.url();
  95  | 
  96  |                 console.log('Unknown state');
  97  |                 console.log(url);
  98  | 
  99  |                 console.log({
  100 |                     otp: await kycPage.otpField.isVisible().catch(() => false),
  101 |                     pan: await kycPage.panField.isVisible().catch(() => false),
  102 |                     digilocker: await kycPage.goToDigilockerBtn.isVisible().catch(() => false),
  103 |                     confirm: await orderPage.confirmOrder.isVisible().catch(() => false),
  104 |                 });
  105 | 
  106 |                 await page.screenshot({
  107 |                     path: `test-results/unknown-state-${Date.now()}.png`,
  108 |                     fullPage: true,
  109 |                 });
  110 | 
  111 |                 if (url.includes('/failed') || url.includes('/failure')) {
  112 |                     throw new Error(`Merchant flow failed. URL: ${url}`);
  113 |                 }
  114 | 
  115 |                 throw new Error(`Unexpected page state. URL: ${url}`);
  116 |             }
  117 |         }
  118 |     }
  119 | 
  120 |     throw new Error('Merchant flow exceeded maximum number of steps.');
  121 | });
```
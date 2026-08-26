import { test, expect } from '../fixtures/testFixture';
import { DataGenerator } from '../utils/dataGenerator.js';
import { adminLoginPage } from '../pages/admin/AdminLoginPage.js';
import { JsonHelper } from '../utils/jsonHelper.js';

let randomMobile;
let randomPAN;
let randomEmail;

test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status === 'passed') {
    JsonHelper.updateMerchantDemo({ mobile: randomMobile, pan: randomPAN, email: randomEmail });
  }
});

test('Search for a random non-existent user by MOBILE or PAN', async ({ page, adminLoginPage }) => {

  randomMobile = DataGenerator.randomMobile();
  randomPAN = DataGenerator.randomPan();
  randomEmail = DataGenerator.randomEmail();

  console.log(`Generated Mobile for test: ${randomMobile}`);
  console.log(`Generated PAN for test: ${randomPAN}`);
  console.log(`Generated PAN for test: ${randomEmail}`);

  await adminLoginPage.open({
    mobile: randomMobile
  });

  await adminLoginPage.open({
    pan: randomPAN
  });

  await adminLoginPage.open({
    email: randomEmail
  });

  if (adminLoginPage.ssoLoginButton.isVisible()) {
    await adminLoginPage.ssoLogin();
  } else {

    // Make sure you have ADMIN_EMAIL and ADMIN_PASSWORD in your .env file
    await adminLoginPage.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

  }
  await adminLoginPage.open(randomMobile, randomPAN);

});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/website/websiteFlow.spec.js >> Website EMI Purchase Flow
- Location: tests/website/websiteFlow.spec.js:4:5

# Error details

```
Error: Unable to determine checkout flow.
```

# Page snapshot

```yaml
- generic [ref=e7]:
  - paragraph [ref=e8]: User not found.
  - button "Pay with UPI/Others" [ref=e9] [cursor=pointer]
  - paragraph [ref=e10]: Redirecting you in 20 sec...
```

# Test source

```ts
  1  | export class PaymentPage {
  2  |     constructor(page) {
  3  |         this.page = page;
  4  | 
  5  |         // Old flow
  6  |         this.planOption = page.locator('div').filter({
  7  |             hasText: /Pay only .* Now/i,
  8  |         }).first();
  9  |         this.planCheckbox = page.getByRole('checkbox').first();
  10 |         this.payInstallmentsBtn = page.getByRole('button', {
  11 |             name: /Pay in \d+ Monthly Installments/i,
  12 |         });
  13 | 
  14 |         this.upiOption = page.getByText(/Enter UPI ID/i);
  15 |         this.upiInput = page.getByPlaceholder(' ');
  16 |         this.payUpiBtn = page.getByRole('button', { name: /Pay ₹/i });
  17 | 
  18 |         this.simulationTrigger = page.getByText(/stimulate success\/failure/i);
  19 | 
  20 |         // New flow
  21 |         this.confirmOrderBtn = page.getByRole('button', {
  22 |             name: 'Confirm Order',
  23 |         });
  24 |     }
  25 | 
  26 |     async continueCheckout(upiId = '999999999@upi') {
  27 |         // Allow navigation/redirects to complete
  28 |         await this.page.waitForLoadState('networkidle').catch(() => { });
  29 |         await this.page.waitForTimeout(1000);
  30 |         // ----------------------------
  31 |         // New Flow
  32 |         // Confirm Order -> Success
  33 |         // ----------------------------
  34 |         if (await this.confirmOrderBtn.isVisible().catch(() => false)) {
  35 |             console.log('New checkout flow detected.');
  36 | 
  37 |             await this.confirmOrderBtn.click();
  38 |             return;
  39 |         }
  40 | 
  41 |         // ----------------------------
  42 |         // Old Flow
  43 |         // EMI Plan -> UPI
  44 |         // ----------------------------
  45 |         if (await this.payInstallmentsBtn.isVisible().catch(() => false)) {
  46 |             console.log('Old checkout flow detected.');
  47 | 
  48 |             if (await this.planCheckbox.isVisible().catch(() => false)) {
  49 |                 await this.planCheckbox.check();
  50 |             }
  51 | 
  52 |             await this.payInstallmentsBtn.click();
  53 | 
  54 |             await this.payViaUPI(upiId);
  55 |             await this.simulateSuccess();
  56 |             return;
  57 |         }
  58 | 
> 59 |         throw new Error('Unable to determine checkout flow.');
     |               ^ Error: Unable to determine checkout flow.
  60 |     }
  61 | 
  62 |     async payViaUPI(upiId) {
  63 |         await this.upiOption.waitFor({ state: 'visible' });
  64 | 
  65 |         await this.upiOption.click();
  66 |         await this.upiInput.fill(upiId);
  67 |         await this.payUpiBtn.click();
  68 |     }
  69 | 
  70 |     async simulateSuccess() {
  71 |         const popupPromise = this.page.waitForEvent('popup');
  72 | 
  73 |         await this.simulationTrigger.click();
  74 | 
  75 |         const popup = await popupPromise;
  76 | 
  77 |         await popup
  78 |             .getByRole('button', {
  79 |                 name: 'Simulate Success transaction',
  80 |             })
  81 |             .click();
  82 | 
  83 |         await popup.getByRole('button', { name: 'GOT IT' }).click();
  84 |     }
  85 | }
```
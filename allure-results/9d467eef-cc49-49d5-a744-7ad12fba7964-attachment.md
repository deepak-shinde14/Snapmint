# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/website/websiteFlow.spec.js >> Website EMI Purchase Flow
- Location: tests/website/websiteFlow.spec.js:4:5

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  getByRole('button', { name: 'Deliver to this address' })
Expected: hidden
Received: visible
Timeout:  15000ms

Call log:
  - Expect "toBeHidden" with timeout 15000ms
  - waiting for getByRole('button', { name: 'Deliver to this address' })
    - locator resolved to <button class=" bg-secondaryText snap-primary-button w-full flex-1">Deliver to this address</button>
    33 × unexpected value "visible"
       - locator resolved to <button class="bg-primary text-darkGreen  snap-primary-button w-full flex-1">Deliver to this address</button>
    - unexpected value "visible"

```

```yaml
- button "Deliver to this address"
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { findWorkingLocator } from '../utils/locatorHelper.js';
  3  | 
  4  | export class AddressPage {
  5  |     constructor(page) {
  6  |         this.page = page;
  7  |     }
  8  | 
  9  |     async fillAddress(line1, line2, landmark, pin) {
  10 | 
  11 |         // Address Line 1
  12 |         const addressLine1 = await findWorkingLocator(
  13 |             [
  14 |                 // Preferred locator
  15 |                 this.page.getByRole('textbox', {
  16 |                     name: 'Flat / House no / Building / Company name'
  17 |                 }),
  18 | 
  19 |                 // Fallbacks
  20 |                 this.page.locator('#addressLine1'),
  21 |                 this.page.locator('#addressLineOne')
  22 |             ],
  23 |             'Address Line 1'
  24 |         );
  25 | 
  26 |         // Address Line 2
  27 |         const addressLine2 = await findWorkingLocator(
  28 |             [
  29 |                 this.page.getByRole('textbox', {
  30 |                     name: 'Area / Colony / Street / Village'
  31 |                 }),
  32 | 
  33 |                 this.page.locator('#addressLine2'),
  34 |                 this.page.locator('#addressLineTwo')
  35 |             ],
  36 |             'Address Line 2'
  37 |         );
  38 | 
  39 |         // Landmark
  40 |         const landmarkField = await findWorkingLocator(
  41 |             [
  42 |                 this.page.getByRole('textbox', {
  43 |                     name: 'Landmark'
  44 |                 }),
  45 | 
  46 |                 this.page.locator('#landmark')
  47 |             ],
  48 |             'Landmark'
  49 |         );
  50 | 
  51 |         // Pin Code
  52 |         const pincode = await findWorkingLocator(
  53 |             [
  54 |                 this.page.getByRole('textbox', {
  55 |                     name: 'Pin Code'
  56 |                 }),
  57 | 
  58 |                 this.page.locator('#pincode'),
  59 | 
  60 |                 this.page.getByLabel('Pin Code')
  61 |             ],
  62 |             'Pin Code'
  63 |         );
  64 | 
  65 |         // Deliver button
  66 |         const deliverBtn = await findWorkingLocator(
  67 |             [
  68 |                 this.page.getByRole('button', {
  69 |                     name: 'Deliver to this address'
  70 |                 }),
  71 | 
  72 |                 this.page.getByText('Deliver to this address', {
  73 |                     exact: true
  74 |                 })
  75 |             ],
  76 |             'Deliver to this address button'
  77 |         );
  78 | 
  79 |         // Perform actions
  80 |         await addressLine1.fill(line1);
  81 | 
  82 |         await addressLine2.fill(line2);
  83 | 
  84 |         await landmarkField.fill(landmark);
  85 | 
  86 |         await pincode.fill(pin);
  87 | 
  88 |         await deliverBtn.click();
  89 | 
  90 |         // Wait until address page disappears
> 91 |         await expect(deliverBtn).toBeHidden({
     |                                  ^ Error: expect(locator).toBeHidden() failed
  92 |             timeout: 15000
  93 |         });
  94 |     }
  95 | }
```
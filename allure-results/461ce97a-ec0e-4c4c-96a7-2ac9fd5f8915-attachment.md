# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/website/websiteFlow.spec.js >> Website EMI Purchase Flow
- Location: tests/website/websiteFlow.spec.js:4:5

# Error details

```
ReferenceError: expect is not defined
```

# Page snapshot

```yaml
- generic [ref=e11]:
  - paragraph [ref=e12]: Please enter your delivery address
  - generic [ref=e15]:
    - textbox "Flat / House no / Building / Company name" [ref=e16]:
      - /placeholder: " "
      - text: A-27, gajanan nagar
    - generic [ref=e17]: Flat / House no / Building / Company name
  - generic [ref=e20]:
    - textbox "Area / Colony / Street / Village" [ref=e21]:
      - /placeholder: " "
      - text: ulhasnagar
    - generic [ref=e22]: Area / Colony / Street / Village
  - generic [ref=e25]:
    - textbox "Landmark" [ref=e26]:
      - /placeholder: " "
      - text: Near Railway Station
    - generic [ref=e27]: Landmark
  - generic [ref=e28]:
    - generic [ref=e31]:
      - textbox "Pin Code" [ref=e32]:
        - /placeholder: " "
        - text: "452001"
      - generic [ref=e33]: Pin Code
    - generic [ref=e34]:
      - generic [ref=e36]:
        - textbox "City" [disabled] [ref=e37]:
          - /placeholder: " "
        - generic [ref=e38]: City
      - generic [ref=e39]: Please Enter city
  - button "Deliver to this address" [active] [ref=e41] [cursor=pointer]
```

# Test source

```ts
  1  | import { findWorkingLocator } from '../utils/locatorHelper.js';
  2  | 
  3  | export class AddressPage {
  4  |     constructor(page) {
  5  |         this.page = page;
  6  |     }
  7  | 
  8  |     async fillAddress(line1, line2, landmark, pin) {
  9  | 
  10 |         // Address Line 1
  11 |         const addressLine1 = await findWorkingLocator(
  12 |             [
  13 |                 // Preferred locator
  14 |                 this.page.getByRole('textbox', {
  15 |                     name: 'Flat / House no / Building / Company name'
  16 |                 }),
  17 | 
  18 |                 // Fallbacks
  19 |                 this.page.locator('#addressLine1'),
  20 |                 this.page.locator('#addressLineOne')
  21 |             ],
  22 |             'Address Line 1'
  23 |         );
  24 | 
  25 |         // Address Line 2
  26 |         const addressLine2 = await findWorkingLocator(
  27 |             [
  28 |                 this.page.getByRole('textbox', {
  29 |                     name: 'Area / Colony / Street / Village'
  30 |                 }),
  31 | 
  32 |                 this.page.locator('#addressLine2'),
  33 |                 this.page.locator('#addressLineTwo')
  34 |             ],
  35 |             'Address Line 2'
  36 |         );
  37 | 
  38 |         // Landmark
  39 |         const landmarkField = await findWorkingLocator(
  40 |             [
  41 |                 this.page.getByRole('textbox', {
  42 |                     name: 'Landmark'
  43 |                 }),
  44 | 
  45 |                 this.page.locator('#landmark')
  46 |             ],
  47 |             'Landmark'
  48 |         );
  49 | 
  50 |         // Pin Code
  51 |         const pincode = await findWorkingLocator(
  52 |             [
  53 |                 this.page.getByRole('textbox', {
  54 |                     name: 'Pin Code'
  55 |                 }),
  56 | 
  57 |                 this.page.locator('#pincode'),
  58 | 
  59 |                 this.page.getByLabel('Pin Code')
  60 |             ],
  61 |             'Pin Code'
  62 |         );
  63 | 
  64 |         // Deliver button
  65 |         const deliverBtn = await findWorkingLocator(
  66 |             [
  67 |                 this.page.getByRole('button', {
  68 |                     name: 'Deliver to this address'
  69 |                 }),
  70 | 
  71 |                 this.page.getByText('Deliver to this address', {
  72 |                     exact: true
  73 |                 })
  74 |             ],
  75 |             'Deliver to this address button'
  76 |         );
  77 | 
  78 |         // Perform actions
  79 |         await addressLine1.fill(line1);
  80 | 
  81 |         await addressLine2.fill(line2);
  82 | 
  83 |         await landmarkField.fill(landmark);
  84 | 
  85 |         await pincode.fill(pin);
  86 | 
  87 |         await deliverBtn.click();
  88 | 
  89 |         // Wait until address page disappears
> 90 |         await expect(deliverBtn).toBeHidden({
     |         ^ ReferenceError: expect is not defined
  91 |             timeout: 15000
  92 |         });
  93 |     }
  94 | }
```
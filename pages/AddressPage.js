import { expect } from '@playwright/test';
import { findWorkingLocator } from '../utils/locatorHelper.js';

export class AddressPage {
    constructor(page) {
        this.page = page;

        this.addressLine1 = page.locator('#addressLine1');
        this.addressLine2 = page.locator('#addressLine2');
        this.pincode = page.locator('#pincode');
        this.deliverBtn = page.getByRole('button', { name: /Deliver to this address/i });
    }

    async fillMerchantAddress(line1, line2, pin) {
        await this.addressLine1.waitFor({ state: 'visible', timeout: 30000 });
        await this.addressLine1.click();
        await this.addressLine1.fill(line1);

        await this.addressLine2.click();
        await this.addressLine2.fill(line2);

        await this.pincode.click();
        await this.pincode.fill(pin);

        await expect(this.deliverBtn).toBeVisible({ timeout: 10000 });
        await this.deliverBtn.click();

        await expect(this.deliverBtn).toBeHidden({ timeout: 15000 }).catch(() => {});
    }

    async fillAddress(line1, line2, landmark, pin) {

        // Address Line 1
        const addressLine1 = await findWorkingLocator(
            [
                // Preferred locator
                this.page.getByRole('textbox', {
                    name: 'Flat / House no / Building / Company name'
                }),

                // Fallbacks
                this.page.locator('#addressLine1'),
                this.page.locator('#addressLineOne')
            ],
            'Address Line 1'
        );

        // Address Line 2
        const addressLine2 = await findWorkingLocator(
            [
                this.page.getByRole('textbox', {
                    name: 'Area / Colony / Street / Village'
                }),

                this.page.locator('#addressLine2'),
                this.page.locator('#addressLineTwo')
            ],
            'Address Line 2'
        );

        // Landmark
        const landmarkField = await findWorkingLocator(
            [
                this.page.getByRole('textbox', {
                    name: 'Landmark'
                }),

                this.page.locator('#landmark')
            ],
            'Landmark'
        );

        // Pin Code
        const pincode = await findWorkingLocator(
            [
                this.page.getByRole('textbox', {
                    name: 'Pin Code'
                }),

                this.page.locator('#pincode'),

                this.page.getByLabel('Pin Code')
            ],
            'Pin Code'
        );

        const city = await findWorkingLocator(
            [
                this.page.getByText('textbox', {
                    name: 'city'
                }),

                this.page.locator('#city'),

                this.page.getByLabel('city')
            ]
        );

        // Deliver button
        const deliverBtn = await findWorkingLocator(
            [
                this.page.getByRole('button', {
                    name: 'Deliver to this address'
                }),

                this.page.getByText('Deliver to this address', {
                    exact: true
                })
            ],
            'Deliver to this address button'
        );

        // Perform actions
        await addressLine1.fill(line1);

        await addressLine2.fill(line2);

        await landmarkField.fill(landmark);

        await pincode.fill(pin);

        await expect(city).toHaveValue(/.+/, {
            timeout: 10000
        });

        await deliverBtn.click();

        // Wait until address page disappears
        await expect(deliverBtn).toBeHidden({
            timeout: 15000
        });
    }
}
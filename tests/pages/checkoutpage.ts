import { type Page, expect } from '@playwright/test';

export class CheckoutPage{
    page: Page
    constructor(p: Page){
        this.page = p;
    }

    async fillForm(formData: any){
        await this.page.locator('[data-test-id="checkout-firstname-input"]').fill(formData.contact.firstName);
        await this.page.locator('[data-test-id="checkout-lastname-input"]').fill(formData.contact.lastName);
        await this.page.locator('[data-test-id="checkout-email-input"]').fill(formData.contact.email);
        
        await this.page.locator('[data-test-id="checkout-address-input"]').fill(formData.shipping.address);
        await this.page.locator('[data-test-id="checkout-city-input"]').fill(formData.shipping.city);
        await this.page.locator('[data-test-id="checkout-zipcode-input"]').fill(formData.shipping.zipCode);

        await this.page.locator('[data-test-id="checkout-cardname-input"]').fill(formData.payment.nameOnCard);
        await this.page.locator('[data-test-id="checkout-cardnumber-input"]').fill(formData.payment.cardNum);
        await this.page.locator('[data-test-id="checkout-cardexpiry-input"]').fill(formData.payment.cardExpiry);
        await this.page.locator('[data-test-id="checkout-cardcvc-input"]').fill(formData.payment.cardCVV);
        return formData.contact.email;
    }

    async clickPlaceOrder(){
        await this.page.getByRole('button', {name: 'Place Order'}).click();
    }

    async verifyOnCheckoutPage(){
        await expect(this.page).toHaveURL(/checkout/);
    }

    async verifyOnOrderConfirmPage(){
        await expect(this.page).toHaveURL(/order-confirmation/);
        const orderID = await this.page.locator('div').filter({hasText: 'Your Order ID is:'}).locator('p.tracking-wider').textContent()??'';
        await expect(orderID?.length).toEqual(8);
        return orderID;
    }
}
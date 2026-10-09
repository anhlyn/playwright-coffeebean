import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage{
    readonly page: Page;
    readonly inputFirstName: Locator;
    readonly inputLastName: Locator;
    readonly inputEmail: Locator;
    readonly inputAddress: Locator;
    readonly inputCity: Locator;
    readonly inputZipcode: Locator;
    readonly inputCardName: Locator;
    readonly inputCardNum: Locator;
    readonly inputCardExpiry: Locator;
    readonly inputCardCVV: Locator;
    readonly btnPlaceOrder: Locator;

    constructor(p: Page){
        this.page = p;
        this.inputFirstName = this.page.locator('[data-test-id="checkout-firstname-input"]');
        this.inputLastName =  this.page.locator('[data-test-id="checkout-lastname-input"]');
        this.inputEmail = this.page.locator('[data-test-id="checkout-email-input"]');
        this.inputAddress = this.page.locator('[data-test-id="checkout-address-input"]');
        this.inputCity = this.page.locator('[data-test-id="checkout-city-input"]');
        this.inputZipcode = this.page.locator('[data-test-id="checkout-zipcode-input"]');
        this.inputCardName = this.page.locator('[data-test-id="checkout-cardname-input"]');
        this.inputCardNum = this.page.locator('[data-test-id="checkout-cardnumber-input"]');
        this.inputCardExpiry = this.page.locator('[data-test-id="checkout-cardexpiry-input"]');
        this.inputCardCVV = this.page.locator('[data-test-id="checkout-cardcvc-input"]');
        this.btnPlaceOrder = this.page.getByRole('button', {name: 'Place Order'});
    }

    async fillForm(formData: any){
        await this.inputFirstName.fill(formData.contact.firstName);
        await this.inputLastName.fill(formData.contact.lastName);
        await this.inputEmail.fill(formData.contact.email);
        
        await this.inputAddress.fill(formData.shipping.address);
        await this.inputCity.fill(formData.shipping.city);
        await this.inputZipcode.fill(formData.shipping.zipCode);

        await this.inputCardName.fill(formData.payment.nameOnCard);
        await this.inputCardNum.fill(formData.payment.cardNum);
        await this.inputCardExpiry.fill(formData.payment.cardExpiry);
        await this.inputCardCVV.fill(formData.payment.cardCVV);
        return formData.contact.email;
    }

    async clickPlaceOrder(){
        await this.btnPlaceOrder.click();
    }

    async verifyOnCheckoutPage(){
        await expect(this.page).toHaveURL(/checkout/);
    }

    async verifyOrderSummary(productName: string, price: string){
        const locOrderSummary = this.page.locator('div[data-test-id="order-summary"]');
        await expect(locOrderSummary).toContainText(productName);
        await expect(locOrderSummary).toContainText(price);
    }

    async verifyOnOrderConfirmPage(){
        await expect(this.page).toHaveURL(/order-confirmation/);
        const orderID = await this.page.locator('div').filter({hasText: 'Your Order ID is:'}).locator('p.tracking-wider').textContent()??'';
        await expect(orderID?.length).toEqual(8);
        return orderID;
    }
}
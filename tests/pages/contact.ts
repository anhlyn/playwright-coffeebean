import {type Page, type Locator, expect} from '@playwright/test';

export class ContactPage{
    readonly page: Page;
    readonly navContact: Locator;
    readonly headingTrackYourOrder: Locator;
    readonly inputOrderID: Locator;
    readonly inputEmail: Locator;
    readonly btnTrackOrder: Locator;
    readonly headingOrderDetails: Locator;
    readonly errRequiredOrderID: Locator;
    readonly errInvalidEmail: Locator;
    readonly errOrderNotFound: Locator;

    constructor(p: Page){
        this.page = p;
        this.navContact = this.page.getByRole('link', {name: 'Contact'});
        this.headingTrackYourOrder = this.page.getByText('Track Your Order', {exact: true});
        this.inputOrderID = this.page.locator('[data-test-id="contact-order-id-input"]');
        this.inputEmail = this.page.locator('[data-test-id="contact-email-input"]');
        this.btnTrackOrder = this.page.getByRole('button', {name: 'track order'});
        this.headingOrderDetails = this.page.getByText('order details');
        this.errRequiredOrderID = this.page.getByText('Order ID is required');
        this.errInvalidEmail = this.page.getByText('Please enter a valid email address');
        this.errOrderNotFound = this.page.getByText('Order Not Found');
    }

    async goToContactPage(){
        await this.navContact.click();
        await expect(this.headingTrackYourOrder).toBeVisible();
    }

    async fillOrderID(orderID: string){
        await this.inputOrderID.fill(orderID);
    }

    async fillEmail(em: string){
        await this.inputEmail.fill(em);
    }

    async clickTrackOrder(){
        await this.btnTrackOrder.click();
    }

    async verifyOnContactPage(){
        await expect(this.headingTrackYourOrder).toBeVisible();
    }

    async verifyOrderTracking(){
        await expect(this.page).toHaveURL(/order/);
        await expect(this.headingOrderDetails).toBeVisible();
    }

    async verifyOrderTrackingIfMissingRequiredFields(){
        await expect(this.errRequiredOrderID).toBeVisible();
        await expect(this.errInvalidEmail).toBeVisible();
    }

    async verifyOrderNotFound(){
        await expect(this.errOrderNotFound).toBeVisible({timeout: 10000});
    }
}
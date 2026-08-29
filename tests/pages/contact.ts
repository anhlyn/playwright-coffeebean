import {type Page, expect} from '@playwright/test';

export class ContactPage{
    page: Page
    constructor(p: Page){
        this.page = p;
    }

    async goToContactPage(){
        await this.page.getByRole('link', {name: 'Contact'}).click();
        await expect(this.page.getByText('Track Your Order', {exact: true})).toBeVisible();
    }

    async fillOrderID(orderID: string){
        await this.page.locator('[data-test-id="contact-order-id-input"]').fill(orderID);
    }

    async fillEmail(em: string){
        await this.page.locator('[data-test-id="contact-email-input"]').fill(em);
    }

    async clickTrackOrder(){
        await this.page.getByRole('button', {name: 'track order'}).click();
    }

    async verifyOrderTracking(){
        await expect(this.page).toHaveURL(/order/);
        await expect(this.page.getByText('order details')).toBeVisible();
    }

    async verifyOrderTrackingIfMissingRequiredFields(){
        await expect(this.page.getByText('Order ID is required')).toBeVisible();
        await expect(this.page.getByText('Please enter a valid email address')).toBeVisible();
    }

    async verifyOrderNotFound(){
        await expect(this.page.getByText('Order Not Found')).toBeVisible({timeout: 10000});
        await expect(this.page.getByText('Dismiss')).toBeVisible();
    }
}
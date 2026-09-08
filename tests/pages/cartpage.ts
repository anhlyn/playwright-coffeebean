import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage{
    readonly page: Page;
    readonly btnCartOnHeader: Locator;
    readonly btnProceedToCheckout: Locator;

    constructor(p: Page){
        this.page = p;
        this.btnCartOnHeader = this.page.locator('a[data-test-id="header-cart-button"]>button');
        this.btnProceedToCheckout = this.page.getByRole('button', {name: 'proceed to checkout'});
    }

    async clickHeaderCartIconOnTheTop(){
        await this.btnCartOnHeader.click();
    }

    async clickProceedToCheckout(){
        await this.btnProceedToCheckout.click();
    }

    async verifyMissingMandatoryFieldOnCheckoutForm(){
        await expect(await this.page.locator('form p').filter({hasText: 'is required'}).all()).toHaveLength(5);
    }

    async verifyOnCartPage(){
        await expect(this.page).toHaveURL(/cart/); 
    }

    async verifyProductNameIsInCart(prodName: string){ 
        await expect(this.page.locator('[data-test-id="cart-item"]').filter({has: this.page.getByRole('heading', {name: prodName})})).toBeVisible();
    }

    async verifyProductPriceIsInCart(prodPrice: string){
        await expect(this.page.locator('[data-test-id="cart-item"]').filter({has: this.page.locator('div.text-right>p')}).filter({hasText: prodPrice})).toBeVisible();
    }
}
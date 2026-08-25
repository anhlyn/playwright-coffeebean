import { type Page, expect } from '@playwright/test';

export class CartPage{
    page: Page;
    constructor(p: Page){
        this.page = p;
    }

    async clickHeaderCartIconOnTheTop(){
        await this.page.locator('a[data-test-id="header-cart-button"]>button').click();
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
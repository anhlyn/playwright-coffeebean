import { type Page, type Locator, expect } from "@playwright/test";

export class ProductPage{
    page: Page;
    constructor(p: Page){
        this.page = p;
    }

    async goToProductPage(){
        await this.page.locator('nav').getByRole('link', {name: 'Shop'}).click();
    }

    async verifyOnProductPage(){
        await expect(this.page).toHaveURL(/products/);
    }

    async verifyProductDetailsHeading(productName: string){
        await expect(this.page.getByRole('heading', {name: productName ?? ''})).toBeVisible();
    }

    async verifyPrice(price: string){
        await expect(this.page.locator('p.text-3xl').filter({hasText: price ?? ''})).toBeVisible();
    }

    async addToCart(productName: string){
        const productDiv = await this.page.locator('div[data-test-id^="product-card-"]').filter({has: this.page.getByRole('heading', {name: productName})});
        const productPrice = await productDiv.locator('span').textContent();
        const btnAddToCart = productDiv.getByRole('button', {name: 'Add to Cart'});
        await btnAddToCart.click();
        return {
            productName: productName,
            productPrice: productPrice
        };
    }

    async getFirstProduct(){
        const firstProduct = this.page.locator('[data-test-id^="product-card-"]').first();
        const firstProductName = await firstProduct.getByRole('heading').textContent();
        const firstProductPrice = await firstProduct.locator('span.text-2xl').textContent();
        return {
            locator: firstProduct,
            name: firstProductName,
            price: firstProductPrice
        };
    }

    async clickViewDetail(webElement: Locator){
        await webElement.getByRole('button', {name: 'View Details'}).click();
    }
}
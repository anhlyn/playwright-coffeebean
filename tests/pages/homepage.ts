import { type Page, expect } from '@playwright/test';

export class HomePage{
    page: Page;
    constructor(p: Page){
        this.page = p;
    }

    async gotoHomePage(){
        await this.page.goto('/');
    }

    async clickNavHome(){
        await this.page.locator('nav').getByRole('link', {name: 'Home'}).click();
    }

    async clickNavShop(){
        await this.page.locator('nav').getByRole('link', {name: 'Shop'}).click();
    }

    async clickNavContact(){
        await this.page.locator('nav>a[href="/contact"]').click();
    }

    async clickViewAllProducts(){
        await this.page.locator('[data-test-id="home-view-all-products-button"]').click();
    }

    async verifyOnHomePage(){
        await expect(this.page).toHaveURL('https://valentinos-magic-beans.click/');
    }

    async verifyOnProductPage(){
        await expect(this.page).toHaveURL(/products/);
    }

    async verifyOnContactPage(){
        await expect(this.page.getByRole('heading', {name: 'Contact Us & Track Your Order'})).toBeVisible();
    }

    async verifyFeaturesIsVisible(){
        await expect(this.page.getByRole('heading', {name: 'Featured Coffees', exact: true})).toBeVisible();
    }

    async verifyBtnViewAllProductIsInvisible(){
        await expect(this.page.locator('[data-test-id="home-view-all-products-button"]')).not.toBeVisible();
    }
};
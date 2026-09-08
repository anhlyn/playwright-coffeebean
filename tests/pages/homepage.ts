import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage{
    readonly page: Page;
    readonly navHome: Locator;
    readonly navShop: Locator;
    readonly navContact: Locator;
    readonly btnViewAllProducts: Locator;
    readonly headingFeaturedCoffees: Locator;

    constructor(p: Page){
        this.page = p;
        this.navHome = this.page.locator('nav').getByRole('link', {name: 'Home'});
        this.navShop = this.page.locator('nav').getByRole('link', {name: 'Shop'});
        this.navContact = this.page.locator('nav>a[href="/contact"]');
        this.btnViewAllProducts = this.page.locator('[data-test-id="home-view-all-products-button"]');
        this.headingFeaturedCoffees = this.page.getByRole('heading', {name: 'Featured Coffees', exact: true});
    }

    async gotoHomePage(){
        await this.page.goto('/');
    }

    async clickNavHome(){
        await this.navHome.click();
    }

    async clickNavShop(){
        await this.navShop.click();
    }

    async clickNavContact(){
        await this.navContact.click();
    }

    async clickViewAllProducts(){
        await this.btnViewAllProducts.click();
    }

    async verifyOnHomePage(){
        await expect(this.page).toHaveURL('https://valentinos-magic-beans.click/');
    }

    async verifyOnProductPage(){
        await expect(this.page).toHaveURL(/products/);
    }

    async verifyFeaturesIsVisible(){
        await expect(this.headingFeaturedCoffees).toBeVisible();
    }

    async verifyBtnViewAllProductIsInvisible(){
        await expect(this.btnViewAllProducts).not.toBeVisible();
    }
};
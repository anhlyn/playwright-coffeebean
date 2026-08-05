import {test, expect} from '@playwright/test';

test('TC-01: Home page loads successfully', async({page})=>{
    const heading = page.locator('header').getByRole('heading', {name: "Valentino's Magic Beans"});
    await page.goto('/');
    await expect(heading).toBeVisible();
});

test('TC-02: Main navigation links work correctly', async({page})=>{
    const navHome = page.locator('nav').getByRole('link', {name: 'Home'});
    const navShop = page.locator('nav').getByRole('link', {name: 'Shop'});
    const navContact = page.locator('nav>a[href="/contact"]');
    const headingContactUs = page.getByRole('heading', {name: 'Contact Us & Track Your Order'});
    await page.goto('/');
    await navHome.click();
    await expect(page).toHaveURL('https://valentinos-magic-beans.click/');

    await navShop.click();
    await expect(page).toHaveURL(/products/);

    await navContact.click();
    await expect(headingContactUs).toBeVisible();
});
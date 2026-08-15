import {test, expect} from '@playwright/test';

test.describe('A. Navigation and Homepage', ()=>{
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
});

test.describe('B. Product Catalog and Details',()=>{
    test('TC-03: Featured products are displayed on the homepage.', async({page})=>{
    const btnViewAllProducts = page.locator('[data-test-id="home-view-all-products-button"]');
    await page.goto('/');
    await page.locator('nav').getByRole('link', {name: 'Home'}).click();
    await expect(page).toHaveURL('https://valentinos-magic-beans.click/');
    await expect(page.getByRole('heading', {name: 'Featured Coffees', exact: true})).toBeVisible();
    await btnViewAllProducts.click();
    await expect(btnViewAllProducts).not.toBeVisible();
    });

    test('TC-04: User can open a product detail page', async({page})=>{
        await page.goto('/');
        await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
        await expect(page).toHaveURL(/products/);

        const firstProduct = page.locator('[data-test-id^="product-card-"]').first();
        const firstProductName = await firstProduct.getByRole('heading').textContent();
        const firstProductPrice = await firstProduct.locator('span.text-2xl').textContent();
        await firstProduct.getByRole('button', {name: 'View Details'}).click();
        await expect(page.getByRole('heading', {name: 'Product Details'})).toBeVisible();
        await expect(page.getByRole('heading', {name: firstProductName ?? ''})).toBeVisible();
        await expect(page.locator('p.text-3xl').filter({hasText: firstProductPrice ?? ''})).toBeVisible();
    });

    test('TC-05: User can add a product to the cart', async({page})=>{
        await page.goto('/');
        await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
        await expect(page).toHaveURL(/products/);

        const productName = 'Ethiopian Highlands';
        const productDiv = await page.locator('div[data-test-id^="product-card-"]').filter({has: page.getByRole('heading', {name: productName})});
        const productPrice = await productDiv.locator('span').textContent();
        const btnAddToCart = productDiv.getByRole('button', {name: 'Add to Cart'});
        await btnAddToCart.click();

        //Assertion
        //clicking the Cart icon at the top corner of the page
        await page.locator('a[data-test-id="header-cart-button"]>button').click();
        await expect(page).toHaveURL(/cart/);

        const cartItemDiv = page.locator('[data-test-id="cart-item"]').first();
        await expect(cartItemDiv.getByRole('heading', {name: productName})).toBeVisible();
        await expect(cartItemDiv.locator(".text-right>p")).toContainText(productPrice ?? '');
    });

    test('TC-06: Cart page displays selected items (more than 1 product) correctly', async({page})=>{
        await page.goto('/');
        await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
        await expect(page).toHaveURL(/products/);

        let products = [
            {
                name: 'Italian Dark Roast',
                price: ''
            },
            {
                name: 'Brazilian Santos',
                price: ''
            }
        ];
        for(let product of products){
            const productDiv = await page.locator('div[data-test-id^="product-card-"]').filter({has: page.getByRole('heading', {name: product.name})});
            product.price = await productDiv.locator('span').textContent() ?? '';
            const btnAddToCart = productDiv.getByRole('button', {name: 'Add to Cart'});
            await btnAddToCart.click();
        } 
        console.log(products);
        await page.locator('[data-test-id="header-cart-button"]').click();
        await expect(page).toHaveURL(/cart/);

        const locatorCartItems = await page.locator('[data-test-id="cart-item"]').all();
        let i = 0;
        for(let product of products){
            await expect(locatorCartItems[i].getByRole('heading', {name: product.name})).toBeVisible();
            expect(await locatorCartItems[i].locator('div.text-right>p').textContent()).toBe(product.price);
            i++;
        }
    });
});

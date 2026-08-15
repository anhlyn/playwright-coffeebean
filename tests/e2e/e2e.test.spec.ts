import {test, expect} from '@playwright/test';

test.describe('A. Navigation and Homepage', ()=>{
    test('TC-01: Home page loads successfully', async({page})=>{
        await test.step('Go to homepage', async()=>{
            await page.goto('/');
        });
        await test.step('Verify test result', async()=>{
            await expect(page.locator('header').getByRole('heading', {name: "Valentino's Magic Beans"})).toBeVisible();
        });
    });

    test('TC-02: Main navigation links work correctly', async({page})=>{
        const navHome = page.locator('nav').getByRole('link', {name: 'Home'});
        const navShop = page.locator('nav').getByRole('link', {name: 'Shop'});
        const navContact = page.locator('nav>a[href="/contact"]');
        const headingContactUs = page.getByRole('heading', {name: 'Contact Us & Track Your Order'});
        await test.step('Step: Go to homepage', async()=>{
            await page.goto('/');
        });

        await test.step('Step: Verify clicking Home link', async()=>{
            await navHome.click();
            await expect(page).toHaveURL('https://valentinos-magic-beans.click/');
        });

        await test.step('Step: Verify clicking shop link', async()=>{
            await navShop.click();
            await expect(page).toHaveURL(/products/);
        });

        await test.step('Step: Verify clicking contact link', async()=>{
            await navContact.click();
            await expect(headingContactUs).toBeVisible();
        });
    });
});

test.describe('B. Product Catalog and Details',()=>{
    test('TC-03: Featured products are displayed on the homepage.', async({page})=>{
        const btnViewAllProducts = page.locator('[data-test-id="home-view-all-products-button"]');
        await test.step('Step1: go to homepage', async()=>{
            await page.goto('/');
            //await page.locator('nav').getByRole('link', {name: 'Home'}).click();
            await expect(page).toHaveURL('https://valentinos-magic-beans.click/');
        });
        await test.step('Step2: Verify "Featured Coffees" heading is visible.', async()=>{
            await expect(page.getByRole('heading', {name: 'Featured Coffees', exact: true})).toBeVisible();
        });
        await test.step('Step3: click button "View All Products" and verify test result', async()=>{
            await btnViewAllProducts.click();
            await expect(btnViewAllProducts).not.toBeVisible();
        });
    });

    test('TC-04: User can open a product detail page', async({page})=>{

        await test.step('Step1: Navigate to /products', async()=>{
            await page.goto('/');
            await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
            await expect(page).toHaveURL(/products/);
        });

        const firstProduct = page.locator('[data-test-id^="product-card-"]').first();
        const firstProductName = await firstProduct.getByRole('heading').textContent();
        const firstProductPrice = await firstProduct.locator('span.text-2xl').textContent();

        await test.step('Step2: click button "View Details"', async()=>{
            await firstProduct.getByRole('button', {name: 'View Details'}).click();
            await expect(page.getByRole('heading', {name: 'Product Details'})).toBeVisible();
        });

        await test.step('Step3: Verify test result', async()=>{
            await expect(page.getByRole('heading', {name: firstProductName ?? ''})).toBeVisible();
            await expect(page.locator('p.text-3xl').filter({hasText: firstProductPrice ?? ''})).toBeVisible();
        });
    });

    test('TC-05: User can add a product to the cart', async({page})=>{
        await test.step('Step: Go to /products', async()=>{
            await page.goto('/');
            await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
            await expect(page).toHaveURL(/products/);
        });

        const productName = 'Ethiopian Highlands';
        const productDiv = await page.locator('div[data-test-id^="product-card-"]').filter({has: page.getByRole('heading', {name: productName})});
        const productPrice = await productDiv.locator('span').textContent();
        const btnAddToCart = productDiv.getByRole('button', {name: 'Add to Cart'});

        await test.step('Step2: click "Add to Cart"', async()=>{
            await btnAddToCart.click();
        });

        //Assertion
        //clicking the Cart icon at the top corner of the page
        await test.step('Step3: click icon Cart at the top-right corner of the page', async()=>{
            await page.locator('a[data-test-id="header-cart-button"]>button').click();
            await expect(page).toHaveURL(/cart/); 
        });

        await test.step('Step4: Verify the test result', async()=>{
            const cartItemDiv = page.locator('[data-test-id="cart-item"]').first();
            await expect(cartItemDiv.getByRole('heading', {name: productName})).toBeVisible();
            await expect(cartItemDiv.locator(".text-right>p")).toContainText(productPrice ?? '');
        });
    });

    test('TC-06: Cart page displays selected items (more than 1 product) correctly', async({page})=>{
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
        await test.step('Step1: go to /products', async()=>{
            await page.goto('/');
            await page.locator('nav').getByRole('link', {name: 'Shop'}).click();
            await expect(page).toHaveURL(/products/);
        });

        await test.step('Step2: Add selected products to the cart', async()=>{
            for(let product of products){
                const productDiv = await page.locator('div[data-test-id^="product-card-"]').filter({has: page.getByRole('heading', {name: product.name})});
                product.price = await productDiv.locator('span').textContent() ?? '';
                const btnAddToCart = productDiv.getByRole('button', {name: 'Add to Cart'});
                await btnAddToCart.click();
            } 
        });

        await test.step('Step3: navigate to the /cart', async()=>{
            await page.locator('[data-test-id="header-cart-button"]').click();
            await expect(page).toHaveURL(/cart/);
        });

        await test.step('Step4: Verify test result', async()=>{
            const locatorCartItems = await page.locator('[data-test-id="cart-item"]').all();
            let i = 0;
            for(let product of products){
                await expect(locatorCartItems[i].getByRole('heading', {name: product.name})).toBeVisible();
                expect(await locatorCartItems[i].locator('div.text-right>p').textContent()).toBe(product.price);
                i++;
            }
        });
    });
});

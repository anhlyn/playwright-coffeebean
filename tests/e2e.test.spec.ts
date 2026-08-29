import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from './pages/homepage';
import { ProductPage } from './pages/productpage';
import { CartPage } from './pages/cartpage';
import { CheckoutPage } from './pages/checkoutpage';

test.describe('A. Navigation and Homepage', ()=>{
    test('TC-01: Home page loads successfully', async({page})=>{
        const homepage = new HomePage(page);
        await test.step('Go to homepage', async()=>{
            await homepage.gotoHomePage();
        });
        await test.step('Verify test result', async()=>{
            await homepage.verifyOnHomePage();
        });
    });

    test('TC-02: Main navigation links work correctly', async({page})=>{
        const homepage = new HomePage(page);
        await test.step('Step: Go to homepage', async()=>{
            await homepage.gotoHomePage();
        });

        await test.step('Step: Verify clicking Home link', async()=>{
            await homepage.clickNavHome();
            await homepage.verifyOnHomePage();
        });

        await test.step('Step: Verify clicking shop link', async()=>{
            await homepage.clickNavShop();
            await homepage.verifyOnProductPage();
        });

        await test.step('Step: Verify clicking contact link', async()=>{
            await homepage.clickNavContact();
            await homepage.verifyOnContactPage();
        });
    });
});

test.describe('B. Product Catalog and Details',()=>{
    test('TC-03: Featured products are displayed on the homepage.', async({page})=>{
        const homepage = new HomePage(page);
        await test.step('Step1: go to homepage', async()=>{
            await homepage.gotoHomePage();
            await homepage.verifyOnHomePage();
        });
        await test.step('Step2: Verify "Featured Coffees" heading is visible.', async()=>{
            await homepage.verifyFeaturesIsVisible();
        });
        await test.step('Step3: click button "View All Products" and verify test result', async()=>{
            await homepage.clickViewAllProducts();
            await homepage.verifyBtnViewAllProductIsInvisible();
        });
    });

    test('TC-04: User can open a product detail page', async({page})=>{
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        await test.step('Step1: Navigate to /products', async()=>{
            await homepage.gotoHomePage();
            await productpage.goToProductPage();
            await productpage.verifyOnProductPage();
        });

        const firstProduct = await productpage.getFirstProduct();
        await test.step('Step2: click button "View Details"', async()=>{
            await productpage.clickViewDetail(firstProduct.locator);
        });
        await test.step('Step3: Verify test result', async()=>{
            await productpage.verifyProductDetailsHeading(firstProduct.name??'');
            await productpage.verifyPrice(firstProduct.price??'');
        });
    });

    test('TC-05: User can add a product to the cart', async({page})=>{
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);

        await test.step('Step: Go to /products', async()=>{
            await homepage.gotoHomePage();
            await productpage.goToProductPage();
            await productpage.verifyOnProductPage();
        });
        const prodName = 'Ethiopian Highlands';
        await test.step('Step2: click "Add to Cart"', async()=>{
            await productpage.addToCart(prodName);
        });
        await test.step('Step3: click icon Cart at the top-right corner of the page', async()=>{
            await cartpage.clickHeaderCartIconOnTheTop();
            await cartpage.verifyOnCartPage();
        });
        await test.step('Step4: Verify the test result', async()=>{
            await cartpage.verifyProductNameIsInCart(prodName);
        });
    });

    test('TC-06: Cart page displays selected items (more than 1 product) correctly', async({page})=>{
        let products = [
            {
                name: 'Colombian Supreme',
                price: ''
            },
            {
                name: 'Guatemalan Volcano',
                price: ''
            }
        ];

        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);
        await test.step('Step1: go to /products', async()=>{
            await homepage.gotoHomePage();
            await productpage.goToProductPage();
            await productpage.verifyOnProductPage();
        });

        await test.step('Step2: Add selected products to the cart', async()=>{
            for(let product of products){
                const tempProd = await productpage.addToCart(product.name);
                product.price = tempProd.productPrice??'';
            } 
        });

        await test.step('Step3: navigate to the /cart', async()=>{
            await cartpage.clickHeaderCartIconOnTheTop();
            await cartpage.verifyOnCartPage();
        });

        await test.step('Step4: Verify test result', async()=>{
            for(let product of products){
                await cartpage.verifyProductNameIsInCart(product.name);
                await cartpage.verifyProductPriceIsInCart(product.price);
            }
        });

        await page.pause();
    });
});

let checkoutProduct =  {
    name: 'Jamaican Blue Mountain',
    price: '',
    orderID: '',
    email: ''
};

const invalidOrderTracking = {
    orderID: '0860F080F',
    email: 'Adah_Hartmann95@gmail.com'
};

test.describe('C. Cart and Checkout', ()=>{
    test('TC-07: User can proceed to checkout from the cart', async({page})=>{
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);
        const checkoutpage = new CheckoutPage(page);

        await homepage.gotoHomePage();
        await productpage.goToProductPage();
        await productpage.verifyOnProductPage();

        const addedProduct = await productpage.addToCart(checkoutProduct.name);
        checkoutProduct.price = addedProduct.productPrice?? '';
        console.log(checkoutProduct);

        await cartpage.clickHeaderCartIconOnTheTop();
        await cartpage.verifyOnCartPage();
        await cartpage.verifyProductNameIsInCart(checkoutProduct.name);
        await cartpage.verifyProductPriceIsInCart(checkoutProduct.price);
        await cartpage.clickProceedToCheckout();
        await checkoutpage.verifyOnCheckoutPage();
    });

    test('TC-08: Checkout is blocked with missing required fields', async({page})=>{
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);
        const checkoutpage = new CheckoutPage(page);

        await homepage.gotoHomePage();
        await productpage.goToProductPage();
        await productpage.verifyOnProductPage();

        const addedProduct = await productpage.addToCart(checkoutProduct.name);
        checkoutProduct.price = addedProduct.productPrice??'';
        await cartpage.clickHeaderCartIconOnTheTop();
        await cartpage.verifyOnCartPage();
        await cartpage.verifyProductNameIsInCart(checkoutProduct.name);
        await cartpage.verifyProductPriceIsInCart(checkoutProduct.price);

        await cartpage.clickProceedToCheckout();
        await checkoutpage.verifyOnCheckoutPage();
        await checkoutpage.clickPlaceOrder();
        await cartpage.verifyMissingMandatoryFieldOnCheckoutForm();
    });

    test('TC-09: Checkout form accepts valid customer information', async({page})=>{
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);
        const checkoutpage = new CheckoutPage(page);

        //navigate to /products
        await homepage.gotoHomePage();
        await productpage.goToProductPage();
        await productpage.verifyOnProductPage();

        //Add to cart rely on specific product name.
        const addedProduct = await productpage.addToCart(checkoutProduct.name);
        checkoutProduct.price = addedProduct.productPrice??'';
        await cartpage.clickHeaderCartIconOnTheTop();
        await cartpage.verifyOnCartPage();
        await cartpage.verifyProductNameIsInCart(checkoutProduct.name);
        await cartpage.verifyProductPriceIsInCart(checkoutProduct.price);

        //Proceed to checkout
        await cartpage.clickProceedToCheckout();
        await checkoutpage.verifyOnCheckoutPage();

        //filling data in the form
        let fn = faker.person.firstName();
        let ln = faker.person.lastName();
        let fullName = fn.concat(' ' + ln).toUpperCase();
        const checkoutForm = {
            "contact":{
                firstName: fn,
                lastName: ln,
                email: faker.internet.email()
            },
            "shipping":{
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                zipCode: faker.location.zipCode()
            },
            "payment":{
                nameOnCard: fullName,
                cardNum: '1234 5678 1234 1234',
                cardExpiry: '10/28',
                cardCVV: faker.finance.creditCardCVV()
            }
        };
        const customerEmail = await checkoutpage.fillForm(checkoutForm);
        checkoutProduct.email = customerEmail??'';
        await checkoutpage.clickPlaceOrder();
        const orderID = await checkoutpage.verifyOnOrderConfirmPage();
        checkoutProduct.orderID = orderID;
        console.log(checkoutProduct);
        await page.pause();
    });
});

test.describe('D. Order Tracking and Contact', ()=>{
    test('TC-10: Order tracking works with a valid Order ID', async({page})=>{
    //PRE-CONDITION: make 1 order
     await page.goto('/');
        await page.locator('nav').getByRole('link', {name: 'shop'}).click();
        await expect(page).toHaveURL(/products/);

        const LocatorProductBox = await page.locator('[data-test-id^="product-card-"]').filter({has:page.getByRole('heading', {name: checkoutProduct.name})});
        checkoutProduct.price = await LocatorProductBox.locator('span').textContent() ?? '';
        await LocatorProductBox.getByRole('button', {name: 'Add to Cart'}).click();

        await page.locator('[data-test-id="header-cart-button"]').click();
        await expect(page).toHaveURL(/cart/);
        const cartItem = page.locator('[data-test-id="cart-item"]').filter({has: page.getByRole('heading', {name: checkoutProduct.name})});
        await expect(cartItem).toBeVisible();
        expect(await cartItem.locator('.text-right>p').textContent()).toBe(checkoutProduct.price);

        await page.getByRole('button', {name: 'proceed to checkout'}).click();
        await expect(page).toHaveURL(/checkout/);

        //filling data in the form
        let fn = faker.person.firstName();
        let ln = faker.person.lastName();
        let fullName = fn.concat(' ' + ln).toUpperCase();
        const checkoutForm = {
            "contact":{
                firstName: fn,
                lastName: ln,
                email: faker.internet.email()
            },
            "shipping":{
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                zipCode: faker.location.zipCode()
            },
            "payment":{
                nameOnCard: fullName,
                cardNum: '1234 5678 1234 1234',
                cardExpiry: '10/28',
                cardCVV: faker.finance.creditCardCVV()
            }
        };
        await page.locator('[data-test-id="checkout-firstname-input"]').fill(checkoutForm.contact.firstName);
        await page.locator('[data-test-id="checkout-lastname-input"]').fill(checkoutForm.contact.lastName);
        await page.locator('[data-test-id="checkout-email-input"]').fill(checkoutForm.contact.email);
        
        await page.locator('[data-test-id="checkout-address-input"]').fill(checkoutForm.shipping.address);
        await page.locator('[data-test-id="checkout-city-input"]').fill(checkoutForm.shipping.city);
        await page.locator('[data-test-id="checkout-zipcode-input"]').fill(checkoutForm.shipping.zipCode);

        await page.locator('[data-test-id="checkout-cardname-input"]').fill(checkoutForm.payment.nameOnCard);
        await page.locator('[data-test-id="checkout-cardnumber-input"]').fill(checkoutForm.payment.cardNum);
        await page.locator('[data-test-id="checkout-cardexpiry-input"]').fill(checkoutForm.payment.cardExpiry);
        await page.locator('[data-test-id="checkout-cardcvc-input"]').fill(checkoutForm.payment.cardCVV);
        await page.waitForTimeout(3000);
        await page.getByRole('button', {name: 'place order'}).click();

        await expect(page).toHaveURL(/order-confirmation/);
        checkoutProduct.orderID = await page.locator('div').filter({hasText: 'Your Order ID is:'}).locator('p.tracking-wider').textContent()??'';
        checkoutProduct.email = checkoutForm.contact.email;
        await expect(checkoutProduct.orderID?.length).toEqual(8);

        //TEST STEPS: TRACK ORDER ID AND EMAIL
        await page.getByRole('link', {name: 'Contact'}).click();
        await expect(page.getByText('Track Your Order', {exact: true})).toBeVisible();

        await page.locator('[data-test-id="contact-order-id-input"]').fill(checkoutProduct.orderID);
        await page.locator('[data-test-id="contact-email-input"]').fill(checkoutProduct.email);
        await page.getByRole('button', {name: 'track order'}).click();

        await expect(page).toHaveURL(/order/);
        await expect(page.getByText('order details')).toBeVisible();
    });

    test('TC-11: Order tracking shows error message when Order ID and Email are left blank', async({page})=>{
        await page.goto('/');
        await page.getByRole('link', {name: 'Contact'}).click();
        await expect(page).toHaveURL(/contact/);

        //Leave order id, email blank and click button Track Order
        await page.getByRole('button', {name: 'track order'}).click();
        await expect(page.getByText('Order ID is required')).toBeVisible();
        await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    });

    test('TC-12: Order tracking shows error message when fill invalid order tracking', async({page})=>{
        await page.goto('/');
        await page.getByRole('link', {name: 'Contact'}).click();
        await expect(page).toHaveURL(/contact/);

        //Leave order id, email blank and click button Track Order
        await page.locator('[data-test-id="contact-order-id-input"]').fill(invalidOrderTracking.orderID);
        await page.locator('[data-test-id="contact-email-input"]').fill(invalidOrderTracking.email);
        await page.getByRole('button', {name: 'track order'}).click();
        await expect(page.getByText('Order Not Found')).toBeVisible();
        await expect(page.getByText('Dismiss')).toBeVisible();
    });
});

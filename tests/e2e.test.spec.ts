import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from './pages/homepage';
import { ProductPage } from './pages/productpage';
import { CartPage } from './pages/cartpage';
import { CheckoutPage } from './pages/checkoutpage';
import { ContactPage } from './pages/contact';

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
        const homepage = new HomePage(page);
        const productpage = new ProductPage(page);
        const cartpage = new CartPage(page);
        const checkoutpage = new CheckoutPage(page);
        const contactpage = new ContactPage(page);
        //PRE-CONDITION: make 1 order
        await homepage.gotoHomePage();
        await productpage.goToProductPage();
        await productpage.verifyOnProductPage();

        const addedProduct = await productpage.addToCart(checkoutProduct.name);
        checkoutProduct.price = (await addedProduct).productPrice??'';
        await cartpage.clickHeaderCartIconOnTheTop();
        await cartpage.verifyOnCartPage();
        await cartpage.verifyProductNameIsInCart(checkoutProduct.name);
        await cartpage.verifyProductPriceIsInCart(checkoutProduct.price);
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

        await checkoutpage.fillForm(checkoutForm);
        await checkoutpage.clickPlaceOrder();
        const orderID = await checkoutpage.verifyOnOrderConfirmPage();
        checkoutProduct.orderID = orderID;
        checkoutProduct.email = checkoutForm.contact.email;

        //TEST STEPS: TRACK ORDER ID AND EMAIL
        await contactpage.goToContactPage();
        await contactpage.fillOrderID(checkoutProduct.orderID);
        await contactpage.fillEmail(checkoutProduct.email);
        await contactpage.clickTrackOrder();
        await contactpage.verifyOrderTracking();
    });

    test('TC-11: Order tracking shows error message when Order ID and Email are left blank', async({page})=>{
        const homepage = new HomePage(page);
        const contactpage = new ContactPage(page);

        await homepage.gotoHomePage();
        await contactpage.goToContactPage();

        //Leave order id, email blank and click button Track Order
        await contactpage.clickTrackOrder();
        await contactpage.verifyOrderTrackingIfMissingRequiredFields();
    });

    test('TC-12: Order tracking shows error message when fill invalid order tracking', async({page})=>{
        const homepage = new HomePage(page);
        const contactpage = new ContactPage(page);

        await homepage.gotoHomePage();
        await contactpage.goToContactPage();

        await contactpage.fillOrderID(invalidOrderTracking.orderID);
        await contactpage.fillEmail(invalidOrderTracking.email);
        await contactpage.clickTrackOrder();
        await contactpage.verifyOrderNotFound();
    });
});

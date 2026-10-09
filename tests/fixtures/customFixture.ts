import {test as BaseTest} from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { ContactPage } from '../pages/contact';
import { ProductPage } from '../pages/productpage';
import { CartPage } from '../pages/cartpage';
import { CheckoutPage } from '../pages/checkoutpage';

export const PRODUCT_NAME = 'Jamaican Blue Mountain';

export const test = BaseTest.extend<{homepage: HomePage, contactpage: ContactPage, productpage: ProductPage, cartpage: CartPage, checkoutpage: CheckoutPage, checkoutReady: {name: string, price: string}}>({
    homepage: async({page}, use)=>{
        await use(new HomePage(page));
    },
    contactpage: async({page}, use)=>{
        await use(new ContactPage(page));
    },
    productpage: async({page}, use)=>{
        await use(new ProductPage(page));
    },
    cartpage: async({page}, use)=>{
        await use(new CartPage(page));
    },
    checkoutpage: async({page}, use)=>{
        await use(new CheckoutPage(page));
    },
    checkoutReady: async({homepage, productpage, cartpage, checkoutpage}, use)=>{
        await homepage.gotoHomePage();
        await productpage.goToProductPage();

        const addedProduct = await productpage.addToCart(PRODUCT_NAME);
        const price = addedProduct.productPrice?? '';
        await cartpage.clickHeaderCartIconOnTheTop();
        await cartpage.clickProceedToCheckout();
        await checkoutpage.verifyOnCheckoutPage();
        await use({name: PRODUCT_NAME, price});
    }
});
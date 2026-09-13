import {test as BaseTest} from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { ContactPage } from '../pages/contact';
import { ProductPage } from '../pages/productpage';
import { CartPage } from '../pages/cartpage';
import { CheckoutPage } from '../pages/checkoutpage';

export const test = BaseTest.extend<{homepage: HomePage, contactpage: ContactPage, productpage: ProductPage, cartpage: CartPage, checkoutpage: CheckoutPage}>({
    homepage: async({page}, use)=>{
        use(new HomePage(page));
    },
    contactpage: async({page}, use)=>{
        use(new ContactPage(page));
    },
    productpage: async({page}, use)=>{
        use(new ProductPage(page));
    },
    cartpage: async({page}, use)=>{
        use(new CartPage(page));
    },
    checkoutpage: async({page}, use)=>{
        use(new CheckoutPage(page));
    }
});
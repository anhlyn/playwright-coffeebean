import { test, expect, request } from '@playwright/test';

test('TC-13: Products API returns 200 OK ', async({request})=>{
    const response = await request.get('https://api.valentinos-magic-beans.click/products');
    const responseJson = await response.json();
    await expect(response.status()).toEqual(200);
    await expect(response.statusText()).toEqual('OK');
    await expect(response.ok()).toBeTruthy();
});

test('TC-15: Product detail API returns the correct product information', async({request})=>{
    const productId = 503;
    const response = await request.get('https://api.valentinos-magic-beans.click/products/'+productId.toString());
    const responseJson = await response.json();
    await expect(response.status()).toEqual(200);
    await expect(responseJson.success).toBeTruthy();
    await expect(responseJson.source).toEqual('dynamodb');
    await expect(responseJson).toHaveProperty('data');
});
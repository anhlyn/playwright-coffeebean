import { test, expect, request, devices } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('TC-01: Products API returns 200 OK ', async({request})=>{
    const response = await request.get('https://api.valentinos-magic-beans.click/products');
    const responseJson = await response.json();
    await expect(response.status()).toEqual(200);
    await expect(response.statusText()).toEqual('OK');
    await expect(response.ok()).toBeTruthy();
});

test('TC-02: Products API returns the expected product catalog structure', async({request})=>{
    const response = await request.get('https://api.valentinos-magic-beans.click/products');
    const responseJson = await response.json();
    //assert api return 200 OK
    await expect(response.status()).toBe(200);
    await expect(response.ok()).toBeTruthy();
    //assert body structure
    await expect(responseJson).toMatchObject({
        success: true,
        source: "dynamodb"
    });
    await expect(Array.isArray(responseJson.data)).toBeTruthy();
    await expect(responseJson.data.length).toBeGreaterThan(0);

    const firstItem = responseJson.data[0];
    await expect(firstItem).toMatchObject({
        price: expect.any(Number),
        description: expect.any(String),
        stock: expect.any(Number),
        origin: expect.any(String),
        name: expect.any(String),
        id: expect.any(String)
    });
});

test('TC-03: Product detail API returns the correct product information', async({request})=>{
    const productId = 503;
    const response = await request.get('https://api.valentinos-magic-beans.click/products/'+productId.toString());
    const responseJson = await response.json();
    await expect(response.status()).toEqual(200);
    await expect(responseJson.success).toBeTruthy();
    await expect(responseJson.source).toEqual('dynamodb');
    await expect(responseJson).toHaveProperty('data');
});

test('TC-04: Order creation API creates an order successfully', async({request})=>{
    const orderPayload = {
                            "customerDetails": {
                                "firstName": faker.person.firstName(),
                                "lastName": faker.person.lastName(),
                                "email": faker.internet.email(),
                                "address": faker.location.streetAddress(),
                                "city": faker.location.city(),
                                "zipCode": faker.location.zipCode(),
                                "country": faker.location.country()
                            },
                            "items": [
                                {
                                    "productId": "505",
                                    "quantity": 1
                                },
                                {
                                    "productId": "501",
                                    "quantity": 1
                                }
                            ]
                        };
    const response = await request.post('https://api.valentinos-magic-beans.click/orders', {
        data: JSON.stringify(orderPayload)
    });
    const responseJson = await response.json();
    //assertions
    await expect(response.status()).toBe(201);
    await expect(responseJson).toMatchObject({
        success: true,
        source: "dynamodb",
        data: expect.any(Object)
    });
    await expect(responseJson.data).toMatchObject({
        orderId: expect.any(String),
        message: "Order created successfully"
    });
});

test('TC-05: Order lookup API returns the correct order for valid input', async({request})=>{
    const bodyPayload = { 
        orderId:"2B42062A",
        email:"test@abc.com"
    };

    const response = await request.post('https://api.valentinos-magic-beans.click/orders/lookup', 
        {
            data: JSON.stringify(bodyPayload)
        }
    );
    const responseJson = await response.json();
    await expect(response.status()).toBe(200);
    await expect(response.ok()).toBeTruthy();
    await expect(responseJson.success).toBeTruthy();
    await expect(responseJson.data.orderId).toEqual(bodyPayload.orderId);
    await expect(responseJson.data.customerEmail).toEqual(bodyPayload.email);
});

test('TC-06: Order lookup API returns a not-found response for an invalid order ID', async({request})=>{
    const bodyPayload = {
        orderId:"test2B42062A",
        email:"test@abc.com"
    };
    const response = await request.post('https://api.valentinos-magic-beans.click/orders/lookup', {
        data: JSON.stringify(bodyPayload)
    });
    const responseJson = await response.json();
    await expect(response.status()).toBe(404);
    await expect(responseJson.success).toBeFalsy();
    await expect(responseJson.data.message).toContain("not found for this email");
});

test('TC-07: Product detail API returns a not-found response for an invalid product ID', async({request})=>{
    const invalidProductID = 1000;
    const response = await request.get('https://api.valentinos-magic-beans.click/products/' + invalidProductID);
    const responseJson = await response.json();

    await expect(response.status()).toBe(404);
    await expect(responseJson.success).not.toBeTruthy();
    await expect(responseJson.data.message).toContain('not found');
});
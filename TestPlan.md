# Functional Test Plan - Valentino's Magic Beans

## 1. Objective
Validate the core functional behaviors of the website, including navigation, product browsing, cart interactions, checkout flows, order lookup, and contact submission.

## 2. Scope
### In scope
- Homepage loading and navigation
- Product listing and product detail viewing
- Add-to-cart behavior
- Proceed to checkout and place order
- Search orders by Order ID and Email
- Contact form and order tracking behavior

### Out of scope
- Real payment processing

## 3. Assumptions / Test Data
- Test environment: latest Chrome/Edge browser
- Demo website is available and reachable

## 4. Test Cases

### E2E Test Scenarios

#### A. Navigation and Homepage
| ID | Test Description | Type | Test Steps | Expected Result |
|---|---|---|---|---|
| TC-01 | Home page loads successfully | Positive | 1. Open the website URL. 2. Wait for the page to load. | The home page opens and displays the hero section, featured coffees, and footer. |
| TC-02 | Main navigation links work correctly | Positive | 1. Click the Home, Shop, and Contact links from the header. | Each navigation link opens the correct page without errors. |

#### B. Product Catalog and Details
| ID | Test Description | Type | Test Steps | Expected Result |
|---|---|---|---|---|
| TC-03 | Featured products are displayed on the homepage. | Positive | 1. Open the homepage. 2. Scroll page to the bottom. 3. Click button View All Products | Load more products successfully on the homepage. |
| TC-04 | User can open a product detail page | Positive | 1. Select a product from the catalog. 2. Open its detail page. | The product detail page loads with product information and available actions. |
| TC-05 | User can add a product to the cart | Positive | 1. Open a product listing or detail page. 2. Click Add to Cart. | The selected product is added to the cart and the cart count updates. |
| TC-06 | Cart page displays selected items correctly | Positive | 1. Add one or more products to the cart. 2. Open the cart page. | The cart page shows the correct items, prices, and quantities. |

#### C. Cart and Checkout
| ID | Test Description | Type | Test Steps | Expected Result |
|---|---|---|---|---|
| TC-07 | User can proceed to checkout from the cart | Positive | 1. Add a product to the cart. 2. Open the cart page. 3. Click Proceed to Checkout. | The checkout page opens and displays the checkout form. |
| TC-08 | Checkout is blocked with missing required fields | Negative | 1. Open the checkout page. 2. Leave one or more required fields empty. 3. Click Place Order. | Validation errors appear and the order is not submitted. |
| TC-09 | Checkout form accepts valid customer information | Positive | 1. Open the checkout page. 2. Fill in the required shipping and payment fields with valid values. 3. Click Place Order. | The order is submitted successfully and a confirmation or success state is shown. |

#### D. Order Tracking and Contact
| ID | Test Description | Type | Test Steps | Expected Result |
|---|---|---|---|---|
| TC-10 | Order tracking works with a valid Order ID | Positive | 1. Open the Contact page. 2. Enter a valid Order ID in the tracking section. 3. Click Track Order. | The matching order status or details are displayed. |
| TC-11 | Order tracking shows error message when Order ID and Email are left blank | Negative | 1. Open the Contact page. 2. Leave the Order ID and Email fields blank in the tracking section. 3. Click Track Order. | Validation errors appear and the order is not retrieved; an error message prompts for Order ID or Email. |
| TC-12 | Order tracking shows error message when fill invalid order tracking | Negative | 1. Open the Contact page. 2. Enter an invalid Order ID and/or Email in the tracking section. 3. Click Track Order. | System displays the following error message:<br>### Order Not Found<br>We couldn't find an order with the provided email and order ID. Please check your information and try again.<br><br>Need help? [Contact our support team](mailto:hello@valentinos-magic-beans.click)<br><br>Dismiss |

### API Test Scenarios
| ID | Test Description | Type | Test Steps | Expected Result |
|---|---|---|---|---|
| TC-01 | Products API returns 200 OK | Positive | 1. Send a GET request to https://api.valentinos-magic-beans.click/products. 2. Review the response status and body. | The API returns HTTP 200 OK. |
| TC-02 | Products API returns the expected product catalog structure | Positive | 1. Send a GET request to https://api.valentinos-magic-beans.click/products. 2. Validate the JSON structure of the response. | The response contains a top-level success flag set to true, a source field set to dynamodb, and a data array containing multiple product objects with fields such as id, name, price, stock, and description. |
| TC-03 | Product detail API returns the correct product information | Positive | 1. Send a GET request to https://api.valentinos-magic-beans.click/products/503. 2. Review the response body. | The API returns HTTP 200 with a JSON payload similar to {"success": true, "source": "dynamodb", "data": {"id": "503", "name": "Colombian Supreme", "price": 23.99, "stock": 100, "description": "Well-balanced with caramel sweetness and nutty flavors."}}. |
| TC-04 | Order creation API creates an order successfully | Positive | 1. Send a POST request to https://api.valentinos-magic-beans.click/orders with a valid payload containing customerDetails and items. 2. Review the response status and body. | The API returns HTTP 201 with a JSON payload similar to {"success": true, "source": "dynamodb", "data": {"orderId": "<generated>", "message": "Order created successfully"}}. |
| TC-05 | Order lookup API returns the correct order for valid input | Positive | 1. Send a POST request to https://api.valentinos-magic-beans.click/orders/lookup with a valid payload such as {"orderId": "2B42062A", "email": "test@abc.com"}. 2. Review the response body. | The API returns HTTP 200 with a JSON payload similar to {"success": true, "source": "dynamodb", "data": {"orderId": "2B42062A", "status": "PENDING", "customerEmail": "test@abc.com", "items": [{"productId": "501", "quantity": 1}]}}. |
| TC-06 | Product detail API returns a not-found response for an invalid product ID | Negative | 1. Send a GET request to https://api.valentinos-magic-beans.click/products/1000. 2. Review the response status and body. | The API returns HTTP 404 with a JSON payload similar to {"success": false, "source": "dynamodb", "data": {"message": "Product with ID 1000 not found."}}. |

## 5. Exit Criteria
- All planned test cases are executed
- No critical defects remain open for core navigation, product browsing, checkout, and order-tracking flows
- Any defects found are documented with steps to reproduce and expected vs actual results

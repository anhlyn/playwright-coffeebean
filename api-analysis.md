# API Analysis Report - Valentino's Magic Beans

## Overview
This report summarizes the API requests observed while browsing the site at https://valentinos-magic-beans.click/.

## Observed API Requests

### 1) GET /products
- Method: GET
- URL: https://api.valentinos-magic-beans.click/products
- Query Parameters: None
- Triggered during:
  - initial homepage load
  - navigation to the products page
- Response body:
```json
{
  "success": true,
  "source": "dynamodb",
  "data": [
    {
      "roastLevel": "Medium-Dark Roast",
      "price": 22.99,
      "origin": "Brazil",
      "description": "Smooth and mellow with low acidity.",
      "image": "https://valentinos-magic-beans.click/images/504-brazilian-santos.png",
      "id": "504",
      "weight": "12oz / 340g",
      "name": "Brazilian Santos",
      "PK": "PROD#504",
      "stock": 100,
      "SK": "#METADATA",
      "GSI1SK": "PROD#BRAZILIAN SANTOS",
      "GSI1PK": "PRODUCTS"
    },
    {
      "name": "Colombian Supreme",
      "GSI1SK": "PROD#COLOMBIAN SUPREME",
      "origin": "Colombia",
      "weight": "12oz / 340g",
      "stock": 100,
      "image": "https://valentinos-magic-beans.click/images/503-colombian-supreme.png",
      "SK": "#METADATA",
      "description": "Well-balanced with caramel sweetness and nutty flavors.",
      "roastLevel": "Medium Roast",
      "price": 23.99,
      "id": "503",
      "PK": "PROD#503",
      "GSI1PK": "PRODUCTS"
    },
    {
      "GSI1SK": "PROD#ETHIOPIAN HIGHLANDS",
      "origin": "Ethiopia",
      "PK": "PROD#501",
      "description": "A bright and floral coffee with notes of citrus and berries.",
      "weight": "12oz / 340g",
      "roastLevel": "Light Roast",
      "stock": 100,
      "name": "Ethiopian Highlands",
      "image": "https://valentinos-magic-beans.click/images/501-ethiopian-highlands.png",
      "SK": "#METADATA",
      "id": "501",
      "price": 24.99,
      "GSI1PK": "PRODUCTS"
    },
    {
      "origin": "Guatemala",
      "name": "Guatemalan Volcano",
      "weight": "12oz / 340g",
      "id": "502",
      "image": "https://valentinos-magic-beans.click/images/502-guatemalan-volcano.png",
      "stock": 100,
      "PK": "PROD#502",
      "GSI1SK": "PROD#GUATEMALAN VOLCANO",
      "SK": "#METADATA",
      "roastLevel": "Medium Roast",
      "description": "Rich and full-bodied with chocolate undertones.",
      "price": 26.99,
      "GSI1PK": "PRODUCTS"
    },
    {
      "image": "https://valentinos-magic-beans.click/images/505-italian-dark-roast.png",
      "weight": "12oz / 340g",
      "name": "Italian Dark Roast",
      "origin": "Italy",
      "stock": 100,
      "description": "Bold and intense with a robust flavor.",
      "roastLevel": "Dark Roast",
      "SK": "#METADATA",
      "GSI1SK": "PROD#ITALIAN DARK ROAST",
      "id": "505",
      "PK": "PROD#505",
      "GSI1PK": "PRODUCTS",
      "price": 25.99
    },
    {
      "GSI1SK": "PROD#JAMAICAN BLUE MOUNTAIN",
      "PK": "PROD#506",
      "image": "https://valentinos-magic-beans.click/images/506-jamaican-blue-mountain.png",
      "id": "506",
      "stock": 100,
      "price": 45.99,
      "origin": "Jamaica",
      "name": "Jamaican Blue Mountain",
      "weight": "8oz / 227g",
      "SK": "#METADATA",
      "roastLevel": "Medium Roast",
      "description": "The crown jewel of coffee. Mild, smooth, and exceptionally well-balanced.",
      "GSI1PK": "PRODUCTS"
    }
  ]
}
```

### 2) GET /products/503
- Method: GET
- URL: https://api.valentinos-magic-beans.click/products/503
- Query Parameters: None
- Response body:
```json
{
  "success": true,
  "source": "dynamodb",
  "data": {
    "origin": "Colombia",
    "stock": 100,
    "GSI1SK": "PROD#COLOMBIAN SUPREME",
    "name": "Colombian Supreme",
    "weight": "12oz / 340g",
    "GSI1PK": "PRODUCTS",
    "roastLevel": "Medium Roast",
    "image": "https://valentinos-magic-beans.click/images/503-colombian-supreme.png",
    "description": "Well-balanced with caramel sweetness and nutty flavors.",
    "price": 23.99,
    "PK": "PROD#503",
    "id": "503",
    "SK": "#METADATA"
  }
}
```

### 3) POST /orders
- Method: POST
- URL: https://api.valentinos-magic-beans.click/orders
- Request Payload:
```json
{
  "customerDetails": {
    "firstName": "Lila",
    "lastName": "Tran",
    "email": "test@abc.com",
    "address": "Hocmon",
    "city": "HCM",
    "zipCode": "70000",
    "country": "Vietnam"
  },
  "items": [
    {
      "productId": "505",
      "quantity": 2
    },
    {
      "productId": "501",
      "quantity": 1
    },
    {
      "productId": "503",
      "quantity": 1
    }
  ]
}
```
- Response Status: 201 Created
- Response body:
```json
{
  "success": true,
  "source": "dynamodb",
  "data": {
    "orderId": "C9A930F2",
    "message": "Order created successfully"
  }
}
```

### 4) POST /orders/lookup
- Method: POST
- URL: https://api.valentinos-magic-beans.click/orders/lookup
- Request Payload:
```json
{
  "orderId": "2B42062A",
  "email": "test@abc.com"
}
```
- Response Status: 200 OK
- Response body:
```json
{
  "success": true,
  "source": "dynamodb",
  "data": {
    "PK": "ORDER#2B42062A",
    "entityType": "Order",
    "sourceIp": "113.22.155.182",
    "status": "PENDING",
    "customerName": "Lila Tran",
    "total": 100.96,
    "orderDate": "2026-08-04T15:41:15.743Z",
    "GSI1PK": "CUST#test@abc.com",
    "ttl": 1788450075,
    "SK": "METADATA#2B42062A",
    "GSI1SK": "ORDER#2026-08-04T15:41:15.743Z",
    "customerEmail": "test@abc.com",
    "orderId": "2B42062A",
    "items": [
      {
        "productId": "501",
        "productName": "Ethiopian Highlands",
        "quantity": 1,
        "price": 24.99
      },
      {
        "productId": "503",
        "productName": "Colombian Supreme",
        "quantity": 1,
        "price": 23.99
      },
      {
        "productId": "505",
        "productName": "Italian Dark Roast",
        "quantity": 2,
        "price": 25.99
      }
    ]
  }
}
```

### 5) GET /products/1000
- Method: GET
- URL: https://api.valentinos-magic-beans.click/products/1000
- Query Parameters: None
- Response Status: 404 Not Found
- Response body:
```json
{
  "success": false,
  "source": "dynamodb",
  "data": {
    "message": "Product with ID 1000 not found."
  }
}
```

## Summary
- Total observed API calls: 2 requests to the products endpoint
- Additional documented API examples include order creation, order lookup, and error-handling endpoint scenarios
- The main API surface appears to be the public product catalog endpoint, order creation endpoint, order lookup endpoint, and not-found product handling

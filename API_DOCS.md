# Custom API Endpoints Documentation

Your Wixstro project now includes a suite of custom API endpoints for common backend operations.

## API Base URL

All APIs are available at: `http://localhost:3000/api/` (during development)

---

## Endpoints

### 1. **Health Check** - `GET /api/health`

Check if the API server is running and healthy.

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T10:30:45.123Z",
  "version": "1.0.0"
}
```

**Example:**
```bash
curl http://localhost:3000/api/health
```

---

### 2. **Contact Form** - `POST /api/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Website Inquiry",
  "message": "I have a question about your services."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Your message has been received. We will get back to you soon.",
  "id": "contact-1707744645123"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid or incomplete form data"
}
```

**Validation Rules:**
- All fields are required
- Email must be valid format
- Fields cannot be empty

**TODO:** Implement email sending or database storage

---

### 3. **Products** - `GET /api/products`

Fetch products from your CMS.

**Query Parameters:**
- `limit` (optional): Number of products to return (default: 10, max: 100)
- `offset` (optional): Number of products to skip for pagination (default: 0)
- `search` (optional): Search query to filter products by name or description

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "Premium Plan",
      "description": "Advanced features for professionals",
      "price": 99.99,
      "currency": "USD",
      "category": "subscription"
    }
  ],
  "total": 3
}
```

**Examples:**
```bash
# Get all products
curl http://localhost:3000/api/products

# Get first 5 products
curl "http://localhost:3000/api/products?limit=5&offset=0"

# Search for products
curl "http://localhost:3000/api/products?search=plan"
```

**TODO:** Integrate with Wix CMS service

---

### 4. **Cart Management** - `/api/cart`

Manage shopping cart operations.

#### **GET** - Retrieve cart

**Query Parameters:**
- `cartId` (required): Unique cart identifier

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "items": [
      {
        "productId": "prod-1",
        "quantity": 2,
        "price": 99.99
      }
    ],
    "subtotal": 199.98,
    "tax": 19.998,
    "total": 219.978,
    "updatedAt": "2026-02-12T10:30:45.123Z"
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/cart?cartId=cart-user123"
```

#### **POST** - Add item to cart

**Request Body:**
```json
{
  "cartId": "cart-user123",
  "productId": "prod-1",
  "quantity": 2,
  "price": 99.99
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated cart */ },
  "message": "Item added to cart"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "cart-user123",
    "productId": "prod-1",
    "quantity": 1,
    "price": 99.99
  }'
```

#### **PUT** - Update cart item quantity

**Request Body:**
```json
{
  "cartId": "cart-user123",
  "productId": "prod-1",
  "quantity": 3
}
```

Set `quantity` to `0` to remove an item.

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated cart */ },
  "message": "Cart updated"
}
```

#### **DELETE** - Clear cart

**Query Parameters:**
- `cartId` (required): Cart to delete

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cart deleted"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/cart?cartId=cart-user123"
```

**Note:** Cart data is stored in-memory. For production, replace with database storage.

---

### 5. **User Profile** - `/api/user`

Manage authenticated user profiles.

#### **GET** - Fetch user profile

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "nickname": "johndoe",
    "status": "APPROVED",
    "createdDate": "2025-01-15T10:30:45.123Z",
    "profileImage": {
      "url": "https://example.com/avatar.jpg",
      "height": 200,
      "width": 200
    }
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Unauthorized - please provide valid credentials"
}
```

#### **PUT** - Update user profile

**Headers:**
- `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "nickname": "janesmith"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated profile */ },
  "message": "Profile updated successfully"
}
```

**TODO:** Integrate with Wix members service and implement proper authentication

---

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "detailed error info"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request / Validation error
- `401` - Unauthorized
- `404` - Not found
- `405` - Method not allowed
- `500` - Server error

---

## Getting Started

### Test an endpoint:
```bash
curl http://localhost:3000/api/health
```

### Submit a contact form:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "This is a test message."
  }'
```

### Create a cart:
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "my-cart",
    "productId": "prod-1",
    "quantity": 1,
    "price": 29.99
  }'
```

---

## Next Steps

1. **Connect to Database** - Replace in-memory storage with a real database
2. **Add Authentication** - Implement JWT or session-based auth for protected endpoints
3. **Email Service** - Integrate email service for contact form submissions
4. **Wix Integration** - Connect to Wix CMS and members services
5. **Testing** - Add test cases for each endpoint
6. **Rate Limiting** - Add rate limiting to prevent abuse
7. **Logging** - Implement structured logging for debugging

---

## Shared Utilities

Use the utilities in `src/lib/api-utils.ts` for consistent API responses:

```typescript
import {
  createSuccessResponse,
  createErrorResponse,
  validateRequired,
  isValidEmail,
  parsePagination,
  getAuthToken,
} from "@/lib/api-utils";
```

**Examples:**
```typescript
// Create success response
export const GET = async () => {
  return createSuccessResponse({ data: "value" }, "Success message");
};

// Validate fields
if (!validateRequired(data, ["name", "email"])) {
  return createErrorResponse("Missing required fields");
}

// Validate email
if (!isValidEmail(email)) {
  return createErrorResponse("Invalid email format");
}

// Extract auth token
const token = getAuthToken(request);
```

---

## File Structure

```
src/pages/api/
├── health.ts       # Health check endpoint
├── contact.ts      # Contact form submission
├── products.ts     # Products listing
├── cart.ts         # Cart management
└── user.ts         # User profile management

src/lib/
└── api-utils.ts    # Shared API utilities
```

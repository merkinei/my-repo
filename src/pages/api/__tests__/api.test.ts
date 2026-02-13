import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Test suite for custom API endpoints
 * Run with: npm run test:run
 */

describe("API Endpoints", () => {
  const API_BASE = "http://localhost:3000/api";

  describe("Health Check - GET /api/health", () => {
    it("should return ok status", async () => {
      const response = await fetch(`${API_BASE}/health`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.status).toBe("ok");
      expect(data.version).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });
  });

  describe("Contact Form - POST /api/contact", () => {
    it("should accept valid contact form", async () => {
      const payload = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "Test message",
      };

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
      expect(data.message).toBeDefined();
    });

    it("should reject invalid email", async () => {
      const payload = {
        name: "John Doe",
        email: "invalid-email",
        subject: "Test",
        message: "Test",
      };

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject missing required fields", async () => {
      const payload = {
        name: "John Doe",
        // missing email, subject, message
      };

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("Products - GET /api/products", () => {
    it("should return products list", async () => {
      const response = await fetch(`${API_BASE}/products`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.total).toBeDefined();
    });

    it("should support pagination", async () => {
      const response = await fetch(`${API_BASE}/products?limit=2&offset=0`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.length).toBeLessThanOrEqual(2);
    });

    it("should support search", async () => {
      const response = await fetch(`${API_BASE}/products?search=plan`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      // Results should contain "plan" in name or description
      data.data.forEach((product: any) => {
        const hasMatch =
          product.name.toLowerCase().includes("plan") ||
          product.description?.toLowerCase().includes("plan");
        expect(hasMatch).toBe(true);
      });
    });
  });

  describe("Cart - /api/cart", () => {
    const testCartId = `test-cart-${Date.now()}`;

    it("GET should retrieve empty cart", async () => {
      const response = await fetch(`${API_BASE}/cart?cartId=${testCartId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.items).toEqual([]);
      expect(data.data.total).toBe(0);
    });

    it("POST should add item to cart", async () => {
      const payload = {
        cartId: testCartId,
        productId: "prod-1",
        quantity: 2,
        price: 99.99,
      };

      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.items.length).toBe(1);
      expect(data.data.items[0].productId).toBe("prod-1");
      expect(data.data.items[0].quantity).toBe(2);
    });

    it("POST should increase quantity if product already in cart", async () => {
      // Add first time
      await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: testCartId,
          productId: "prod-2",
          quantity: 1,
          price: 50,
        }),
      });

      // Add same product again
      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: testCartId,
          productId: "prod-2",
          quantity: 2,
          price: 50,
        }),
      });

      const data = await response.json();
      const item = data.data.items.find(
        (i: any) => i.productId === "prod-2"
      );
      expect(item.quantity).toBe(3); // 1 + 2
    });

    it("PUT should update item quantity", async () => {
      const response = await fetch(`${API_BASE}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: testCartId,
          productId: "prod-1",
          quantity: 5,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      const item = data.data.items.find(
        (i: any) => i.productId === "prod-1"
      );
      expect(item.quantity).toBe(5);
    });

    it("PUT with quantity 0 should remove item", async () => {
      const response = await fetch(`${API_BASE}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: testCartId,
          productId: "prod-1",
          quantity: 0,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      const item = data.data.items.find(
        (i: any) => i.productId === "prod-1"
      );
      expect(item).toBeUndefined();
    });

    it("DELETE should clear cart", async () => {
      const response = await fetch(`${API_BASE}/cart?cartId=${testCartId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);

      // Verify cart is empty
      const getResponse = await fetch(`${API_BASE}/cart?cartId=${testCartId}`);
      const getData = await getResponse.json();
      expect(getData.data.items).toEqual([]);
    });

    it("should calculate correct totals with tax", async () => {
      const testId = `tax-test-${Date.now()}`;

      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: testId,
          productId: "prod-1",
          quantity: 1,
          price: 100,
        }),
      });

      const data = await response.json();
      expect(data.data.subtotal).toBe(100);
      expect(data.data.tax).toBe(10); // 10% tax
      expect(data.data.total).toBe(110);
    });
  });

  describe("User Profile - /api/user", () => {
    it("GET should require authorization", async () => {
      const response = await fetch(`${API_BASE}/user`);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("GET should return user with valid token", async () => {
      const response = await fetch(`${API_BASE}/user`, {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBeDefined();
      expect(data.data.email).toBeDefined();
    });

    it("PUT should require authorization", async () => {
      const response = await fetch(`${API_BASE}/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Jane" }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid JSON", async () => {
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should validate required query parameters", async () => {
      const response = await fetch(`${API_BASE}/cart`);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });
});

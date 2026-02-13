import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ReactNode } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Example component demonstrating API usage
 * Shows how to interact with the custom API endpoints
 */
export const ApiExampleComponent: React.FC<{ children?: ReactNode }> = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [cartId] = useState(() => `cart-${Date.now()}`);
  const [cart, setCart] = useState<any>(null);

  // Example 1: Fetch health status
  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      toast({
        title: "Health Check",
        description: `Status: ${data.status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check health",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Submit contact form
  const submitContactForm = async (formData: ContactFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse<{ id: string }> = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Your message has been sent!",
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Fetch products
  const fetchProducts = async (search?: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/products", window.location.origin);
      if (search) {
        url.searchParams.set("search", search);
      }

      const response = await fetch(url.toString());
      const data: ApiResponse<any[]> = await response.json();

      if (data.success && data.data) {
        setProducts(data.data);
        toast({
          title: "Success",
          description: `Loaded ${data.data.length} products`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Add item to cart
  const addToCart = async (productId: string, quantity: number, price: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          productId,
          quantity,
          price,
        }),
      });

      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data) {
        setCart(data.data);
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 5: Fetch cart
  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?cartId=${cartId}`);
      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data) {
        setCart(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 6: Update cart item
  const updateCartItem = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          productId,
          quantity,
        }),
      });

      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data) {
        setCart(data.data);
        toast({
          title: "Success",
          description: "Cart updated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example 7: Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?cartId=${cartId}`, {
        method: "DELETE",
      });

      const data: ApiResponse<null> = await response.json();

      if (data.success) {
        setCart(null);
        toast({
          title: "Success",
          description: "Cart cleared",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">API Examples</h2>

        {/* Health Check */}
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">1. Health Check</h3>
          <Button onClick={checkHealth} disabled={loading}>
            Check Health
          </Button>
        </div>

        {/* Contact Form Example */}
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">2. Contact Form</h3>
          <Button
            onClick={() =>
              submitContactForm({
                name: "John Doe",
                email: "john@example.com",
                subject: "Test Subject",
                message: "This is a test message",
              })
            }
            disabled={loading}
          >
            Submit Contact Form
          </Button>
        </div>

        {/* Products */}
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">3. Products</h3>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => fetchProducts()} disabled={loading}>
              Fetch All Products
            </Button>
            <Button onClick={() => fetchProducts("plan")} disabled={loading}>
              Search "plan"
            </Button>
          </div>
          {products.length > 0 && (
            <div className="grid gap-2">
              {products.map((product) => (
                <div key={product.id} className="p-2 bg-gray-100 rounded">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <Button
                    size="sm"
                    onClick={() =>
                      addToCart(product.id, 1, product.price)
                    }
                    disabled={loading}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">4. Shopping Cart</h3>
          <div className="flex gap-2 mb-4">
            <Button onClick={loadCart} disabled={loading}>
              Load Cart
            </Button>
            <Button onClick={clearCart} disabled={loading}>
              Clear Cart
            </Button>
          </div>
          {cart && (
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold mb-2">Cart Items:</p>
              {cart.items.length > 0 ? (
                <div className="space-y-2">
                  {cart.items.map((item: any) => (
                    <div key={item.productId} className="flex justify-between">
                      <span>
                        {item.productId} x {item.quantity}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateCartItem(item.productId, item.quantity + 1)
                          }
                          disabled={loading}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateCartItem(item.productId, item.quantity - 1)
                          }
                          disabled={loading}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Cart is empty</p>
              )}
              <div className="mt-3 pt-2 border-t">
                <p className="text-sm">
                  Subtotal: ${cart.subtotal?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm">
                  Tax: ${cart.tax?.toFixed(2) || "0.00"}
                </p>
                <p className="font-semibold">
                  Total: ${cart.total?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

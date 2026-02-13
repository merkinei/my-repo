import type { APIRoute } from "astro";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: string;
}

interface CartResponse {
  success: boolean;
  data?: Cart;
  message?: string;
}

interface AddToCartRequest {
  productId: string;
  quantity: number;
  price: number;
}

interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

// In-memory cart storage (replace with database in production)
const carts = new Map<string, Cart>();

const generateCartId = (): string => {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateCart = (items: CartItem[]): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const cartId = url.searchParams.get("cartId");

    if (!cartId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cart ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const cart = carts.get(cartId);
    if (!cart) {
      // Create a new empty cart
      const newCart: Cart = {
        id: cartId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      };
      carts.set(cartId, newCart);

      return new Response(JSON.stringify({ success: true, data: newCart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: cart }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch cart",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const data = await request.json() as Partial<AddToCartRequest> & { cartId?: string };
    
    if (!data.cartId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cart ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!data.productId || !data.quantity || data.price === undefined) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Product ID, quantity, and price are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let cart = carts.get(data.cartId);
    if (!cart) {
      cart = {
        id: data.cartId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    const existingItem = cart.items.find((item) => item.productId === data.productId);
    if (existingItem) {
      existingItem.quantity += data.quantity;
    } else {
      cart.items.push({
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
      });
    }

    const calculations = calculateCart(cart.items);
    cart = { ...cart, ...calculations, updatedAt: new Date().toISOString() };
    carts.set(data.cartId, cart);

    const response: CartResponse = {
      success: true,
      data: cart,
      message: "Item added to cart",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cart POST error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to add item to cart",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const PUT: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const data = await request.json() as Partial<UpdateCartItemRequest> & { cartId?: string };

    if (!data.cartId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cart ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const cart = carts.get(data.cartId);
    if (!cart) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cart not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!data.productId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Product ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (data.quantity && data.quantity > 0) {
      const item = cart.items.find((i) => i.productId === data.productId);
      if (item) {
        item.quantity = data.quantity;
      }
    } else if (data.quantity === 0) {
      cart.items = cart.items.filter((i) => i.productId !== data.productId);
    }

    const calculations = calculateCart(cart.items);
    const updatedCart: Cart = {
      ...cart,
      ...calculations,
      updatedAt: new Date().toISOString(),
    };
    carts.set(data.cartId, updatedCart);

    const response: CartResponse = {
      success: true,
      data: updatedCart,
      message: "Cart updated",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update cart",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const cartId = url.searchParams.get("cartId");

    if (!cartId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cart ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    carts.delete(cartId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cart deleted",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete cart",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

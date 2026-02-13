import type { APIRoute } from "astro";

interface ProductQuery {
  limit?: number;
  offset?: number;
  search?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image?: string;
  category?: string;
}

interface ProductsResponse {
  success: boolean;
  data?: Product[];
  total?: number;
  message?: string;
}

// Mock products data - replace with actual Wix CMS integration
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Premium Plan",
    description: "Advanced features for professionals",
    price: 99.99,
    currency: "USD",
    category: "subscription",
  },
  {
    id: "prod-2",
    name: "Starter Plan",
    description: "Essential features to get started",
    price: 29.99,
    currency: "USD",
    category: "subscription",
  },
  {
    id: "prod-3",
    name: "Enterprise Plan",
    description: "Custom solutions for large teams",
    price: 299.99,
    currency: "USD",
    category: "subscription",
  },
];

const parseQueryParams = (url: string): ProductQuery => {
  const urlObj = new URL(url);
  return {
    limit: urlObj.searchParams.get("limit")
      ? parseInt(urlObj.searchParams.get("limit")!)
      : 10,
    offset: urlObj.searchParams.get("offset")
      ? parseInt(urlObj.searchParams.get("offset")!)
      : 0,
    search: urlObj.searchParams.get("search") || undefined,
  };
};

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const query = parseQueryParams(request.url);
    let filteredProducts = [...MOCK_PRODUCTS];

    // Apply search filter if provided
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredProducts.length;
    const limit = Math.max(1, Math.min(query.limit || 10, 100));
    const offset = Math.max(0, query.offset || 0);
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    const response: ProductsResponse = {
      success: true,
      data: paginatedProducts,
      total,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Products endpoint error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch products",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  // TODO: Implement product creation for authenticated admins
  return new Response(
    JSON.stringify({
      success: false,
      message: "Not yet implemented",
    }),
    {
      status: 501,
      headers: { "Content-Type": "application/json" },
    }
  );
};

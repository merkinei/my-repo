/**
 * Client-side API utilities for calling custom APIs
 */

import type { ApiResponse, PaginatedResponse } from "./types";

export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

const API_BASE = "/api";

/**
 * Make API request
 */
export const fetchApi = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const url = new URL(endpoint, API_BASE);

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiResponse = await response.json();
      return {
        data: null,
        error: error.error || `HTTP ${response.status}`,
      };
    }

    const json: ApiResponse<T> = await response.json();

    if (!json.success) {
      return {
        data: null,
        error: json.error || "Request failed",
      };
    }

    return {
      data: json.data || null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * GET request
 */
export const apiGet = <T = any>(endpoint: string, params?: Record<string, any>) => {
  return fetchApi<T>(endpoint, { method: "GET", params });
};

/**
 * POST request
 */
export const apiPost = <T = any>(endpoint: string, body: any) => {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * PUT request
 */
export const apiPut = <T = any>(endpoint: string, body: any) => {
  return fetchApi<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/**
 * PATCH request
 */
export const apiPatch = <T = any>(endpoint: string, body: any) => {
  return fetchApi<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request
 */
export const apiDelete = <T = any>(endpoint: string) => {
  return fetchApi<T>(endpoint, { method: "DELETE" });
};

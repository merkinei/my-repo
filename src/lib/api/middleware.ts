import type { APIContext } from "astro";
import { createUnauthorizedResponse, createBadRequestResponse } from "./responses";
import { z } from "zod";

/**
 * Validate required headers
 */
export const validateHeaders = (
  context: APIContext,
  required: string[] = ["content-type"]
): boolean => {
  for (const header of required) {
    if (!context.request.headers.get(header)) {
      return false;
    }
  }
  return true;
};

/**
 * Validate request body against schema
 */
export const validateBody = async <T extends z.ZodSchema>(
  context: APIContext,
  schema: T
): Promise<{ data: z.infer<T> | null; error: Response | null }> => {
  try {
    const body = await context.request.text();
    if (!body) {
      return {
        data: null,
        error: createBadRequestResponse("Request body is required"),
      };
    }

    const parsed = JSON.parse(body);
    const validated = schema.parse(parsed);
    return { data: validated, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: createBadRequestResponse(
          `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
        ),
      };
    }
    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: createBadRequestResponse("Invalid JSON"),
      };
    }
    return {
      data: null,
      error: createBadRequestResponse("Failed to parse request body"),
    };
  }
};

/**
 * Validate query parameters
 */
export const validateQuery = <T extends z.ZodSchema>(
  url: URL,
  schema: T
): { data: z.infer<T> | null; error: Response | null } => {
  try {
    const params = Object.fromEntries(url.searchParams);
    const validated = schema.parse(params);
    return { data: validated, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: createBadRequestResponse(
          `Query validation error: ${error.errors.map((e) => e.message).join(", ")}`
        ),
      };
    }
    return {
      data: null,
      error: createBadRequestResponse("Invalid query parameters"),
    };
  }
};

/**
 * Check if request is authenticated (basic example)
 * In production, you'd check bearer tokens, session cookies, etc.
 */
export const checkAuthentication = (context: APIContext): boolean => {
  const authHeader = context.request.headers.get("authorization");
  return !!authHeader;
};

/**
 * Check HTTP method
 */
export const checkMethod = (
  context: APIContext,
  ...methods: string[]
): boolean => {
  return methods.includes(context.request.method);
};

/**
 * Handle unsupported method
 */
export const methodNotAllowed = (): Response => {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};

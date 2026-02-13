/**
 * Shared API utilities and helpers
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Create a standardized API error response
 */
export const createErrorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};

/**
 * Create a standardized API success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  status: number = 200
) => {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      ...(message && { message }),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};

/**
 * Validate required fields in an object
 */
export const validateRequired = (
  obj: Record<string, unknown>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => {
    const value = obj[field];
    return value !== null && value !== undefined && value !== "";
  });
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str: string): string => {
  return str.trim().slice(0, 1000); // Limit to 1000 chars
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Parse pagination parameters
 */
export const parsePagination = (url: string, maxLimit: number = 100) => {
  const urlObj = new URL(url);
  const limit = Math.max(1, Math.min(parseInt(urlObj.searchParams.get("limit") || "10"), maxLimit));
  const offset = Math.max(0, parseInt(urlObj.searchParams.get("offset") || "0"));
  return { limit, offset };
};

/**
 * Get authorization token from request
 */
export const getAuthToken = (request: Request): string | null => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
};

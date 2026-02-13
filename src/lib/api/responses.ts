import type { ApiResponse, PaginatedResponse } from "./types";
import { HttpStatus } from "./types";

export const createSuccessResponse = <T>(
  data: T,
  status = HttpStatus.OK
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createErrorResponse = (
  message: string,
  code: string = "INTERNAL_ERROR",
  status = HttpStatus.INTERNAL_ERROR
): Response => {
  const response: ApiResponse = {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createPaginatedResponse = <T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): Response => {
  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status: HttpStatus.OK,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createCreatedResponse = <T>(data: T): Response => {
  return createSuccessResponse(data, HttpStatus.CREATED);
};

export const createNotFoundResponse = (resource = "Resource"): Response => {
  return createErrorResponse(
    `${resource} not found`,
    "NOT_FOUND",
    HttpStatus.NOT_FOUND
  );
};

export const createBadRequestResponse = (message: string): Response => {
  return createErrorResponse(
    message,
    "BAD_REQUEST",
    HttpStatus.BAD_REQUEST
  );
};

export const createUnauthorizedResponse = (): Response => {
  return createErrorResponse(
    "Unauthorized",
    "UNAUTHORIZED",
    HttpStatus.UNAUTHORIZED
  );
};

export const createForbiddenResponse = (): Response => {
  return createErrorResponse(
    "Forbidden",
    "FORBIDDEN",
    HttpStatus.FORBIDDEN
  );
};

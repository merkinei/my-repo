import type { APIContext } from "astro";
import { createSuccessResponse } from "@/lib/api";

/**
 * GET /api/health - Health check endpoint
 */
export const GET = (context: APIContext) => {
  return createSuccessResponse({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

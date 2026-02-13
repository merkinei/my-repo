import type { APIContext } from "astro";
import {
  createSuccessResponse,
  createBadRequestResponse,
  createNotFoundResponse,
  methodNotAllowed,
  checkMethod,
  validateBody,
} from "@/lib/api";
import { z } from "zod";

// Example data store (in production, use database)
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const usersStore: Map<string, User> = new Map();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

/**
 * GET /api/users - Get all users
 * POST /api/users - Create a new user
 */
export const POST = async (context: APIContext) => {
  if (context.request.method === "GET") {
    const users = Array.from(usersStore.values());
    return createSuccessResponse(users);
  }

  if (context.request.method === "POST") {
    const { data, error } = await validateBody(context, createUserSchema);

    if (error) return error;

    // Check if email already exists
    const exists = Array.from(usersStore.values()).some(
      (u) => u.email === data.email
    );

    if (exists) {
      return createBadRequestResponse("Email already exists");
    }

    const id = Date.now().toString();
    const user: User = {
      id,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    usersStore.set(id, user);

    return createSuccessResponse(user, 201);
  }

  return methodNotAllowed();
};

/**
 * GET /api/users/[id] - Get a specific user
 * DELETE /api/users/[id] - Delete a user
 */
export const getStaticPaths = () => {
  return [];
};

export const get = (context: APIContext) => {
  const { id } = context.params;

  if (!id) {
    const users = Array.from(usersStore.values());
    return createSuccessResponse(users);
  }

  const user = usersStore.get(id);
  if (!user) {
    return createNotFoundResponse("User");
  }

  return createSuccessResponse(user);
};

export const del = (context: APIContext) => {
  const { id } = context.params;

  if (!id) {
    return createBadRequestResponse("User ID is required");
  }

  if (!usersStore.has(id)) {
    return createNotFoundResponse("User");
  }

  usersStore.delete(id);

  return createSuccessResponse({ message: "User deleted" });
};

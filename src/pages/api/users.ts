import type { APIContext } from "astro";
import {
  createSuccessResponse,
  createBadRequestResponse,
  createNotFoundResponse,
  methodNotAllowed,
  validateBody,
} from "@/lib/api";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models";

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
  try {
    await connectDB();

    if (context.request.method === "GET") {
      const users = await User.find().sort({ createdAt: -1 });
      return createSuccessResponse(users);
    }

    if (context.request.method === "POST") {
      const { data, error } = await validateBody(context, createUserSchema);
      if (error) return error;

      // Check if email already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return createBadRequestResponse("Email already exists");
      }

      const newUser = await User.create({
        name: data.name,
        email: data.email,
      });

      return createSuccessResponse(newUser.toObject(), 201);
    }

    return methodNotAllowed();
  } catch (error) {
    console.error("Users POST error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to process users"
    );
  }
};

/**
 * GET /api/users/[id] - Get a specific user
 * DELETE /api/users/[id] - Delete a user
 */
export const getStaticPaths = () => {
  return [];
};

export const get = async (context: APIContext) => {
  try {
    await connectDB();

    const { id } = context.params;

    if (!id) {
      const users = await User.find().sort({ createdAt: -1 });
      return createSuccessResponse(users);
    }

    const user = await User.findById(id);
    if (!user) {
      return createNotFoundResponse("User");
    }

    return createSuccessResponse(user.toObject());
  } catch (error) {
    console.error("Users GET error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
};

export const del = async (context: APIContext) => {
  try {
    await connectDB();

    const { id } = context.params;

    if (!id) {
      return createBadRequestResponse("User ID is required");
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return createNotFoundResponse("User");
    }

    return createSuccessResponse({ message: "User deleted" });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
};

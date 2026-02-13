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
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const postsStore: Map<string, Post> = new Map();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

const updatePostSchema = createPostSchema.partial();

/**
 * GET /api/posts - Get all posts
 * POST /api/posts - Create a new post
 */
export const POST = async (context: APIContext) => {
  if (context.request.method === "GET") {
    const posts = Array.from(postsStore.values());
    return createSuccessResponse(posts);
  }

  if (context.request.method === "POST") {
    const { data, error } = await validateBody(context, createPostSchema);

    if (error) return error;

    const id = Date.now().toString();
    const now = new Date().toISOString();

    const post: Post = {
      id,
      title: data.title,
      content: data.content,
      createdAt: now,
      updatedAt: now,
    };

    postsStore.set(id, post);

    return createSuccessResponse(post, 201);
  }

  return methodNotAllowed();
};

/**
 * GET /api/posts/[id] - Get a specific post
 * PUT /api/posts/[id] - Update a post
 * DELETE /api/posts/[id] - Delete a post
 */
export const getStaticPaths = () => {
  // This is for static generation - with dynamic routes, Astro needs to know possible paths
  // For a fully dynamic API, you can remove this or return all possible IDs
  return [];
};

export const get = (context: APIContext) => {
  if (context.request.method === "GET") {
    const { id } = context.params;

    if (!id) {
      const posts = Array.from(postsStore.values());
      return createSuccessResponse(posts);
    }

    const post = postsStore.get(id);
    if (!post) {
      return createNotFoundResponse("Post");
    }

    return createSuccessResponse(post);
  }

  return methodNotAllowed();
};

export const put = async (context: APIContext) => {
  const { id } = context.params;

  if (!id) {
    return createBadRequestResponse("Post ID is required");
  }

  const post = postsStore.get(id);
  if (!post) {
    return createNotFoundResponse("Post");
  }

  const { data, error } = await validateBody(context, updatePostSchema);
  if (error) return error;

  const updated: Post = {
    ...post,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  postsStore.set(id, updated);

  return createSuccessResponse(updated);
};

export const del = (context: APIContext) => {
  const { id } = context.params;

  if (!id) {
    return createBadRequestResponse("Post ID is required");
  }

  if (!postsStore.has(id)) {
    return createNotFoundResponse("Post");
  }

  postsStore.delete(id);

  return createSuccessResponse({ message: "Post deleted" });
};

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
import { Post } from "@/lib/db/models";

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
  try {
    await connectDB();

    if (context.request.method === "GET") {
      const posts = await Post.find().sort({ createdAt: -1 });
      return createSuccessResponse(posts);
    }

    if (context.request.method === "POST") {
      const { data, error } = await validateBody(context, createPostSchema);
      if (error) return error;

      const newPost = await Post.create({
        title: data.title,
        content: data.content,
      });

      return createSuccessResponse(newPost.toObject(), 201);
    }

    return methodNotAllowed();
  } catch (error) {
    console.error("Posts POST error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to process posts"
    );
  }
};

/**
 * GET /api/posts/[id] - Get a specific post
 * PUT /api/posts/[id] - Update a post
 * DELETE /api/posts/[id] - Delete a post
 */
export const getStaticPaths = () => {
  return [];
};

export const get = async (context: APIContext) => {
  try {
    await connectDB();

    const { id } = context.params;

    if (!id) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return createSuccessResponse(posts);
    }

    const post = await Post.findById(id);
    if (!post) {
      return createNotFoundResponse("Post");
    }

    return createSuccessResponse(post.toObject());
  } catch (error) {
    console.error("Posts GET error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to fetch posts"
    );
  }
};

export const put = async (context: APIContext) => {
  try {
    await connectDB();

    const { id } = context.params;

    if (!id) {
      return createBadRequestResponse("Post ID is required");
    }

    const post = await Post.findById(id);
    if (!post) {
      return createNotFoundResponse("Post");
    }

    const { data, error } = await validateBody(context, updatePostSchema);
    if (error) return error;

    const updated = await Post.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    return createSuccessResponse(updated?.toObject());
  } catch (error) {
    console.error("Posts PUT error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to update post"
    );
  }
};

export const del = async (context: APIContext) => {
  try {
    await connectDB();

    const { id } = context.params;

    if (!id) {
      return createBadRequestResponse("Post ID is required");
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return createNotFoundResponse("Post");
    }

    return createSuccessResponse({ message: "Post deleted" });
  } catch (error) {
    console.error("Posts DELETE error:", error);
    return createBadRequestResponse(
      error instanceof Error ? error.message : "Failed to delete post"
    );
  }
};

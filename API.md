# Custom API Routes

This directory contains the server-side API routes for your Wixstro application.

## Project Structure

```
src/
├── lib/api/                    # API utilities & types
│   ├── types.ts               # TypeScript interfaces for API
│   ├── responses.ts           # Response helpers
│   ├── middleware.ts          # Validation & auth middleware
│   ├── client.ts              # Client-side fetch utilities
│   └── index.ts               # Export barrel
├── pages/api/                 # Actual API endpoints
│   ├── health.ts              # Health check endpoint
│   ├── posts.ts               # Posts CRUD example
│   ├── users.ts               # Users CRUD example
```

## Available Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### Posts
- **GET** `/api/posts` - Get all posts
- **POST** `/api/posts` - Create a new post
- **GET** `/api/posts/:id` - Get a specific post
- **PUT** `/api/posts/:id` - Update a post
- **DELETE** `/api/posts/:id` - Delete a post

### Users
- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create a new user
- **GET** `/api/users/:id` - Get a specific user
- **DELETE** `/api/users/:id` - Delete a user

## Usage Examples

### Client-side (React Component)

```typescript
import { apiGet, apiPost, apiDelete } from '@/lib/api/client';

export const MyComponent = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data, error } = await apiGet('/posts');
    if (error) {
      console.error('Failed to fetch posts:', error);
      return;
    }
    setPosts(data || []);
  };

  const createPost = async (title: string, content: string) => {
    const { data, error } = await apiPost('/posts', { title, content });
    if (error) {
      console.error('Failed to create post:', error);
      return;
    }
    setPosts([...posts, data]);
  };

  const deletePost = async (id: string) => {
    const { error } = await apiDelete(`/posts/${id}`);
    if (error) {
      console.error('Failed to delete post:', error);
      return;
    }
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    // JSX here
  );
};
```

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Get all posts
curl http://localhost:3000/api/posts

# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My Post", "content": "Hello World"}'

# Get a specific post
curl http://localhost:3000/api/posts/1234567890

# Update a post
curl -X PUT http://localhost:3000/api/posts/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Delete a post
curl -X DELETE http://localhost:3000/api/posts/1234567890
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* your data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Building Custom Endpoints

### Basic Endpoint Template

```typescript
// src/pages/api/my-endpoint.ts
import type { APIContext } from 'astro';
import {
  createSuccessResponse,
  createBadRequestResponse,
  methodNotAllowed,
  validateBody,
} from '@/lib/api';
import { z } from 'zod';

const mySchema = z.object({
  name: z.string(),
  // ... add your fields
});

export const GET = (context: APIContext) => {
  // Handle GET requests
  return createSuccessResponse({ message: 'Hello' });
};

export const POST = async (context: APIContext) => {
  // Validate request body
  const { data, error } = await validateBody(context, mySchema);
  if (error) return error;

  // Your logic here
  return createSuccessResponse(data, 201);
};

// Export other methods (PUT, DELETE, etc.) as needed
```

### Dynamic Routes

For dynamic routes, use file names with brackets:

```typescript
// src/pages/api/items/[id].ts
export const GET = (context: APIContext) => {
  const { id } = context.params;
  // Fetch item by ID
};

export const PUT = async (context: APIContext) => {
  const { id } = context.params;
  // Update item
};

export const DELETE = (context: APIContext) => {
  const { id } = context.params;
  // Delete item
};
```

## Validation

Use Zod schemas (already in your project) to validate request data:

```typescript
import { z } from 'zod';

const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  email: z.string().email('Valid email required'),
});

const { data, error } = await validateBody(context, createItemSchema);
if (error) return error;
// data is now type-safe
```

## Authentication & Middleware

The `middleware.ts` file provides helpers for authentication:

```typescript
import { checkAuthentication, checkMethod } from '@/lib/api/middleware';

export const POST = async (context: APIContext) => {
  // Check if authenticated
  if (!checkAuthentication(context)) {
    return createUnauthorizedResponse();
  }

  // Check HTTP method
  if (!checkMethod(context, 'POST', 'PUT')) {
    return methodNotAllowed();
  }

  // Your logic
};
```

## Next Steps

1. **Replace Mock Data**: Update `posts.ts` and `users.ts` to use a real database
2. **Add Authentication**: Implement bearer token or session validation
3. **Add More Endpoints**: Create endpoints for your specific features
4. **Error Handling**: Add comprehensive error handling
5. **Testing**: Add tests for your API endpoints using Vitest
6. **Rate Limiting**: Add rate limiting for production

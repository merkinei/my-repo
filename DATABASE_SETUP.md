# MongoDB Database Setup

Your API endpoints now use MongoDB for persistent data storage instead of in-memory storage.

## Prerequisites

1. **MongoDB Account** - Create one at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Connection String** - Get your MongoDB connection URI

## Environment Setup

### 1. Add MongoDB URI to `.env.local`

Create or update `.env.local` in your project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

**Example:**
```env
MONGODB_URI=mongodb+srv://user123:mypassword@wixstro.mongodb.net/wixstro_db?retryWrites=true&w=majority
```

### 2. Get Your Connection String

From MongoDB Atlas:
1. Go to **Clusters** → **Connect**
2. Select **Drivers**
3. Choose **Node.js** and version **4.1 or later**
4. Copy the connection string and replace `<password>` with your password
5. Paste into `.env.local`

## Database Models

### Post

```typescript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  title: String,           // Required
  content: String,         // Required
  author?: String,         // Optional author ID
  createdAt: Date,         // Auto-added by MongoDB
  updatedAt: Date,         // Auto-added by MongoDB
}
```

### User

```typescript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  name: String,            // Required
  email: String,           // Required, unique, lowercase
  createdAt: Date,         // Auto-added by MongoDB
  updatedAt: Date,         // Auto-added by MongoDB
}
```

## API Changes

The API endpoints remain the same, but now persist data to MongoDB:

### Posts
- `GET /api/posts` - Fetch all posts from database (sorted by newest first)
- `POST /api/posts` - Create and save new post
- `GET /api/posts/:id` - Fetch specific post by MongoDB ID
- `PUT /api/posts/:id` - Update post in database
- `DELETE /api/posts/:id` - Delete post from database

### Users
- `GET /api/users` - Fetch all users from database (sorted by newest first)
- `POST /api/users` - Create and save new user (email must be unique)
- `GET /api/users/:id` - Fetch specific user by MongoDB ID
- `DELETE /api/users/:id` - Delete user from database

## Testing with cURL

```bash
# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is saved to MongoDB!"
  }'

# Get all posts (will return MongoDB documents with _id)
curl http://localhost:3000/api/posts

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'

# Get all users
curl http://localhost:3000/api/users
```

## Important Notes

- **MongoDB IDs**: Documents now use MongoDB's `_id` (ObjectId) instead of custom strings
- **Uniqueness**: Email field has a unique index - you can't create two users with the same email
- **Automatic Timestamps**: `createdAt` and `updatedAt` are managed automatically
- **Sorting**: Posts and users are returned sorted by creation date (newest first)
- **Connection Pooling**: Connections are cached and reused for better performance

## Troubleshooting

### "Please define the MONGODB_URI environment variable"
- Add `MONGODB_URI=...` to `.env.local`
- Restart the dev server: `npm run dev`

### "Email already exists"
- MongoDB enforces unique emails - use a different email address

### "Post not found" / "User not found"
- Make sure you're using the correct MongoDB ID format
- MongoDB IDs look like: `507f1f77bcf86cd799439011`

### Connection timeout
- Check your MongoDB Atlas IP whitelist: [mongodb.com/security/ip-access-list](https://www.mongodb.com/security/ip-access-list)
- Add `0.0.0.0/0` to allow all IPs (dev only) or your specific IP

## Next Steps

1. **Backup Data** - Set up MongoDB backups in Atlas
2. **Indexes** - Optimize queries with additional indexes
3. **Validation** - Add more complex schema validation
4. **Quotes** - Monitor MongoDB usage and set alerts
5. **Scaling** - Upgrade to shared/dedicated clusters as needed

## Files Changed

```
src/lib/db/
├── mongodb.ts          # MongoDB connection logic
├── models.ts           # Mongoose schemas
└── index.ts            # Exports

src/pages/api/
├── posts.ts            # Updated to use MongoDB
└── users.ts            # Updated to use MongoDB
```

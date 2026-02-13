/**
 * MongoDB Schema Definitions
 */

import mongoose, { Schema, Document } from 'mongoose';

// Post Model
export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// User Model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
PostSchema.index({ createdAt: -1 });
UserSchema.index({ email: 1 });

// Export models with type safety
export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

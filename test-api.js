#!/usr/bin/env node

/**
 * Simple test script to verify MongoDB connection and test API functionality
 * Run with: node test-api.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: '/workspaces/my-repo/.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');
console.log('URI (first 50 chars):', MONGODB_URI.substring(0, 50) + '...');

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connection established!');

    // Define simple schemas for testing
    const postSchema = new mongoose.Schema(
      {
        title: String,
        content: String,
        author: String,
      },
      { timestamps: true }
    );

    const userSchema = new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true },
      },
      { timestamps: true }
    );

    const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    try {
      // Test creating a post
      console.log('\n📝 Creating test post...');
      const post = await Post.create({
        title: 'My First MongoDB Post',
        content: 'This is a test post saved to MongoDB!',
        author: 'Test User',
      });
      console.log('✅ Post created:', post._id);
      console.log('   Title:', post.title);
      console.log('   Created:', post.createdAt);

      // Test creating a user
      console.log('\n👤 Creating test user...');
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
      });
      console.log('✅ User created:', user._id);
      console.log('   Name:', user.name);
      console.log('   Email:', user.email);

      // Test fetching all posts
      console.log('\n📚 Fetching all posts...');
      const allPosts = await Post.find().sort({ createdAt: -1 });
      console.log('✅ Found', allPosts.length, 'posts');
      allPosts.forEach((p) => {
        console.log(`   - ${p.title} (${p._id})`);
      });

      // Test fetching all users
      console.log('\n👥 Fetching all users...');
      const allUsers = await User.find().sort({ createdAt: -1 });
      console.log('✅ Found', allUsers.length, 'users');
      allUsers.forEach((u) => {
        console.log(`   - ${u.name} (${u.email})`);
      });

      console.log('\n✅ All tests passed!');
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    } finally {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. MongoDB Atlas account is active');
    console.error('2. MONGODB_URI in .env.local is correct');
    console.error('3. Your IP is whitelisted in MongoDB Atlas');
    process.exit(1);
  });

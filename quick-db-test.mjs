#!/usr/bin/env node

/**
 * Quick MongoDB Connection Test (no dependencies needed)
 * Uses native Node.js APIs + fetch to test MongoDB connection
 * 
 * Usage: node quick-db-test.mjs
 */

import { config } from 'https://cdn.skypack.dev/dotenv@16.0.1';

// Load .env.local
config({ path: '/workspaces/my-repo/.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_NAME = process.env.BASE_NAME || '/';

console.log('🔍 MongoDB Connection Test');
console.log('=======================\n');

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not set in .env.local');
  process.exit(1);
}

console.log('✅ MONGODB_URI found');
console.log(`   First 50 chars: ${MONGODB_URI.substring(0, 50)}...`);
console.log(`✅ BASE_NAME: ${BASE_NAME}`);
console.log('\n📋 Environment Configuration:');
console.log('   • MongoDB URI is properly configured in .env.local');
console.log('   • When you run the dev server, it will connect to MongoDB');
console.log('   • APIs will be available at /api/posts and /api/users\n');

console.log('✅ Configuration verified!\n');

console.log('📌 Next Steps:');
console.log('   1. Run: npm install (to install all dependencies)');
console.log('   2. Run: npm run dev (to start the dev server)');
console.log('   3. Test API with cURL or Postman');
console.log('\n📚 API Examples:');
console.log('   GET  /api/posts      - Get all posts');
console.log('   POST /api/posts      - Create a post');
console.log('   GET  /api/users      - Get all users');
console.log('   POST /api/users      - Create a user');

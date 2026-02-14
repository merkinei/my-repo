#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = '/workspaces/my-repo/.env.local';
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse env file
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, value] = trimmed.split('=');
    if (key && value) {
      env[key] = value;
    }
  }
});

const apiKey = env.OPENROUTER_API_KEY;
const serviceType = env.AI_SERVICE_TYPE;

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY is not set in .env.local');
  process.exit(1);
}

if (serviceType !== 'openrouter') {
  console.error('❌ AI_SERVICE_TYPE should be "openrouter", got:', serviceType);
  process.exit(1);
}

console.log('✓ Configuration found:');
console.log('  - OPENROUTER_API_KEY:', apiKey.substring(0, 20) + '...');
console.log('  - AI_SERVICE_TYPE:', serviceType);
console.log();

// Test the OpenRouter API
async function testOpenRouter() {
  try {
    console.log('📡 Testing OpenRouter API...');
    const prompt = 'Generate a short lesson plan for Grade 5 Mathematics on basic fractions';
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CBC (Competency-Based Curriculum) teaching assistant. Generate high-quality, curriculum-aligned teaching materials.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ OpenRouter API Error:', error);
      process.exit(1);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content;

    if (result) {
      console.log('✅ API Response received successfully!\n');
      console.log('📝 Response preview (first 500 chars):');
      console.log(result.substring(0, 500) + '...\n');
      console.log('✅ OpenRouter integration is working correctly!');
    } else {
      console.error('❌ No response generated');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testOpenRouter();

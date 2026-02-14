import type { APIRoute } from 'astro';

interface AIRequest {
  prompt: string;
}

interface AIResponse {
  success: boolean;
  response?: string;
  error?: string;
  timestamp?: string;
}

/**
 * AI Chat API Endpoint
 * POST /api/ai-chat
 * 
 * Accepts a prompt and returns AI-generated teaching materials
 * Supports multiple AI service providers
 * 
 * Environment Variables Required:
 * - AI_SERVICE_TYPE: 'openai' | 'openrouter' | 'custom' | 'placeholder' (default: 'placeholder')
 * - OPENAI_API_KEY: Your OpenAI API key (if using OpenAI)
 * - OPENROUTER_API_KEY: Your OpenRouter API key (if using OpenRouter)
 * - CUSTOM_AI_ENDPOINT: Your custom AI backend URL (if using custom)
 * - CUSTOM_AI_API_KEY: Your custom backend API key (if using custom)
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed. Use POST.',
          timestamp: new Date().toISOString(),
        } as AIResponse),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let body: AIRequest;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
          timestamp: new Date().toISOString(),
        } as AIResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt
    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Prompt is required and must be a non-empty string',
          timestamp: new Date().toISOString(),
        } as AIResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt length
    if (prompt.length > 5000) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Prompt exceeds maximum length of 5000 characters',
          timestamp: new Date().toISOString(),
        } as AIResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI response based on configured service
    const aiResponse = await generateAIResponse(prompt);

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString(),
      } as AIResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
        timestamp: new Date().toISOString(),
      } as AIResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * AI Response Generation
 * Routes to the appropriate AI service based on environment configuration
 */
async function generateAIResponse(prompt: string): Promise<string> {
  const serviceType = (import.meta.env.AI_SERVICE_TYPE || 'placeholder').toLowerCase();

  try {
    switch (serviceType) {
      case 'openai':
        return await callOpenAI(prompt);
      case 'openrouter':
        return await callOpenRouter(prompt);
      case 'custom':
        return await callCustomBackend(prompt);
      case 'placeholder':
      default:
        return generatePlaceholderResponse(prompt);
    }
  } catch (error) {
    console.error(`Error calling ${serviceType} AI service:`, error);
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * OpenAI Integration
 * Requires: OPENAI_API_KEY environment variable
 */
async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
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
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

/**
 * OpenRouter Integration
 * Requires: OPENROUTER_API_KEY environment variable
 * OpenRouter provides access to multiple models through a unified API
 */
async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

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
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

/**
 * Custom Backend Integration
 * Requires: CUSTOM_AI_ENDPOINT and optionally CUSTOM_AI_API_KEY environment variables
 */
async function callCustomBackend(prompt: string): Promise<string> {
  const endpoint = import.meta.env.CUSTOM_AI_ENDPOINT;
  const apiKey = import.meta.env.CUSTOM_AI_API_KEY;

  if (!endpoint) {
    throw new Error('CUSTOM_AI_ENDPOINT environment variable is not set');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Custom backend error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response || data.result || 'No response generated';
}

/**
 * Placeholder Response
 * Used for development/testing when no AI service is configured
 * Returns realistic mock teaching material for preview purposes
 */
function generatePlaceholderResponse(prompt: string): string {
  return `# Lesson Plan: ${prompt}

## Objectives
By the end of this lesson, students will be able to:
- Understand core concepts related to the topic
- Apply knowledge in practical scenarios
- Evaluate and analyze real-world examples

## Standards Alignment
This lesson aligns with CBC (Competency-Based Curriculum) standards for critical thinking, collaboration, and subject mastery.

## Learning Activities

### Warm-up (5 minutes)
- Introduce the topic with a relatable real-world scenario
- Allow students to share prior knowledge and experiences

### Main Instruction (15 minutes)
- Present key concepts using visual aids and examples
- Use think-pair-share activities for engagement
- Encourage questions and discussions

### Practice Activities (15 minutes)
- Individual or group problem-solving exercises
- Interactive simulations or case studies
- Peer teaching and review activities

### Assessment (5 minutes)
- Quick formative assessment through questioning
- Exit ticket or reflection activity
- Identify areas needing additional support

## Resources Needed
- Textbooks and reference materials
- Technology: Projector, laptops or tablets
- Manipulatives or visual aids as appropriate

## Homework/Follow-up
- Reinforce concepts with targeted practice
- Encourage reflective thinking
- Prepare for next lesson

---

**Note:** This is a development/placeholder response. To use real AI services (OpenAI, OpenRouter, or custom backend), configure the AI_SERVICE_TYPE environment variable and restart your application.`;
}

import type { APIRoute } from 'astro';
import { parseDocument } from '../../lib/api/cbc-parser';

interface ParseRequest {
  text: string;
  documentType?: 'lesson-plan' | 'scheme-of-work' | 'rubric' | 'auto';
}

/**
 * CBC Document Parser API Endpoint
 * POST /api/parse-cbc
 * 
 * Parses AI-generated CBC documents into structured data
 * Supports: Lesson Plans, Schemes of Work, and Assessment Rubrics
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed. Use POST.',
        }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let body: ParseRequest;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate text
    const { text, documentType = 'auto' } = body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Text is required and must be a non-empty string',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse document
    const parseResult = parseDocument(text);

    return new Response(
      JSON.stringify({
        success: parseResult.result.success,
        documentType: parseResult.type,
        data: parseResult.result.data,
        errors: parseResult.result.errors,
        warnings: parseResult.result.warnings,
      }),
      { 
        status: parseResult.result.success ? 200 : 400, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Parse API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

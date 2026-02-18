import type { APIRoute } from 'astro';
import { getCurriculumContextForLesson } from '../../lib/api/curriculum-loader';
import { buildCBCSystemPrompt } from '../../lib/api/cbc-templates';

interface AIRequest {
  prompt: string;
  grade?: string;
  subject?: string;
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

    // Extract optional grade and subject for curriculum context
    const grade = body.grade || 'General';
    const subject = body.subject || 'General';

    // Generate AI response based on configured service
    const aiResponse = await generateAIResponse(prompt, grade, subject);

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
async function generateAIResponse(
  prompt: string,
  grade: string = 'General',
  subject: string = 'General'
): Promise<string> {
  const serviceType = (import.meta.env.AI_SERVICE_TYPE || 'placeholder').toLowerCase();

  try {
    switch (serviceType) {
      case 'openai':
        return await callOpenAI(prompt, grade, subject);
      case 'openrouter':
        return await callOpenRouter(prompt, grade, subject);
      case 'custom':
        return await callCustomBackend(prompt);
      case 'placeholder':
      default:
        return generatePlaceholderResponse(prompt, grade, subject);
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
async function callOpenAI(
  prompt: string,
  grade: string = 'General',
  subject: string = 'General'
): Promise<string> {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const curriculumContext = await getCurriculumContextForLesson(grade, subject);
  const systemPrompt = buildSystemPrompt(curriculumContext);

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
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3500,
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
async function callOpenRouter(
  prompt: string,
  grade: string = 'General',
  subject: string = 'General'
): Promise<string> {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  const curriculumContext = await getCurriculumContextForLesson(grade, subject);
  const systemPrompt = buildSystemPrompt(curriculumContext);

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
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3500,
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
 * Build System Prompt with Curriculum Context
 * Uses Kenyan CBC official formatting standards via cbc-templates
 */
function buildSystemPrompt(curriculumContext: string): string {
  return buildCBCSystemPrompt(curriculumContext);
}

/**
 * Placeholder Response

 * Used for development/testing when no AI service is configured
 * Returns realistic mock teaching material for preview purposes
 */
function generatePlaceholderResponse(
  prompt: string,
  grade: string = 'General',
  subject: string = 'General'
): string {
  return `# Lesson Plan: ${prompt}

**Duration:** 40 minutes | **Grade Level:** ${grade} | **Subject:** ${subject}

## Learning Objectives
By the end of this lesson, students will be able to:
- Identify and analyze main ideas and supporting details in texts
- Use context clues to determine word meanings
- Make inferences based on textual evidence
- Compare and contrast different perspectives in reading materials
- Apply active reading strategies to improve comprehension

## CBC Competencies Addressed
- Critical Thinking and Problem Solving
- Communication and Information Literacy
- Collaboration and Teamwork
- Self-Directed Learning

---

## Lesson Timeline (40 minutes)

### 1. Hook & Activation (5 minutes)
**Objective:** Engage students and activate prior knowledge

- Start with a compelling question: "What makes a story memorable?"
- Show a brief video clip (2 min) or read an engaging excerpt
- Ask students to discuss with a partner what they noticed
- Connect to today's reading comprehension strategies

**Differentiation:** Provide visual aids for visual learners; allow verbal discussion for diverse learners

---

### 2. Direct Instruction: Reading Strategies (8 minutes)
**Objective:** Teach explicit reading comprehension strategies

**Content Coverage:**
- Strategy 1: Previewing & Predicting
  * Scan headings, images, and first paragraph
  * Make predictions about content
  
- Strategy 2: Identifying Main Idea
  * Look for topic sentences
  * Distinguish between main idea and details
  
- Strategy 3: Using Context Clues
  * Analyze surrounding sentences
  * Use word parts (prefixes, suffixes, roots)

**Teacher Modeling:**
- Demonstrate "think-aloud" with a sample text
- Show annotation strategies (highlighting, margin notes)
- Model how to revise predictions as you read

**Resources:** Anchor chart with strategies, sample text document

---

### 3. Guided Practice: Text Analysis (12 minutes)
**Objective:** Apply strategies with teacher support

**Structured Text:** Provide a grade-appropriate reading passage (300-400 words)

**Activity Steps:**
1. **Read Aloud Together** (3 min) - Teacher reads first paragraph expressively while students follow
2. **Paired Investigation** (5 min) - Students work in pairs to:
   - Highlight main idea in paragraph 2
   - Identify 2 vocabulary words and use context clues
   - Write one prediction about what happens next
3. **Whole-Group Debrief** (4 min) - Share findings and discuss:
   - What context clues helped you?
   - How accurate were your predictions?

**Assessment Check:** Monitor pair work; note students needing additional support

---

### 4. Independent Practice (12 minutes)
**Objective:** Students apply strategies with decreasing support

**Choice Board** (students select one activity):

**Option A: Close Reading Analysis**
- Read a second passage independently
- Complete a graphic organizer:
  * Main idea statement
  * 3 supporting details
  * 2 vocabulary words with definitions from context
  * 1 inference with supporting evidence

**Option B: Comprehension Questions**
- Answer 5 guided questions with page citations:
  * What is the main problem?
  * How does the character respond?
  * What can you infer about the setting?
  * What context clue helped you understand [target word]?
  * What might happen next?

**Option C: Comparative Reading**
- Compare two short passages on the same topic
- Create a Venn diagram showing:
  * Main ideas from each text
  * Similarities and differences in perspective

**Differentiation:**
- Advanced: Analyze author's purpose and tone
- Below Grade Level: Use pre-annotated text or audio version
- ELL: Provide vocabulary support sheet with visual aids

---

### 5. Closure & Reflection (3 minutes)
**Objective:** Consolidate learning and preview next lesson

- Quick individual reflection (written or think-aloud):
  * Which reading strategy was most helpful today?
  * When will you use this outside of class?
- Highlight one student success from the lesson
- Preview tomorrow: "We'll apply these strategies to a longer novel excerpt"

**Exit Ticket Option:**
- On index cards: Write one main idea you learned and one strategy you'll try

---

## Formative Assessment Strategies
- Observation of pair work discussions
- Graphic organizer completion and accuracy
- Exit ticket responses
- Questioning during whole-group debrief
- Individual practice work samples

## Success Criteria
- Students can identify main ideas with 75%+ accuracy
- Students can use 2+ context clues to define vocabulary
- Students can make 1 inference supported by textual evidence

---

## Resources Required
- Grade-appropriate reading passages (printed or digital)
- Graphic organizers (template provided or digital form)
- Anchor chart with reading strategies
- Optional: Audio version of text for ELL/accessibility
- Projector or document camera for modeling

## Homework/Follow-Up Extension
- Read another passage independently using the strategies
- Journal: Describe which strategy was easiest/hardest and why
- Prepare for tomorrow's literature circle discussion

## Teacher Notes
- Pre-teach vocabulary for students below grade level
- Have additional passages available for early finishers
- Record student struggling points for future mini-lessons
- Celebrate effort and strategy use, not just accuracy

---

**Note:** This is a development/placeholder response. To use real AI services with your CBC curriculum PDFs, configure the AI_SERVICE_TYPE environment variable and place PDF files in the public/curriculum directory.`;
}

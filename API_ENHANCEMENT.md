# AI Chat API - Enhanced with CBC Curriculum Integration

## Overview

The AI Chat API (`/api/ai-chat`) now supports:
- **40-minute detailed lesson plans** with specific time allocations
- **CBC curriculum integration** with support for loading curriculum PDFs
- **Grade and subject-specific** responses aligned with standards
- **Multiple AI service providers** (OpenAI, OpenRouter, Custom Backend)

## API Endpoint

**POST** `/api/ai-chat`

### Request Body

```json
{
  "prompt": "Generate a Grade 7 English lesson plan on reading comprehension",
  "grade": "7",
  "subject": "English"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The lesson plan or teaching material request (max 5000 chars) |
| `grade` | string | No | Grade level (e.g., "7", "8"). Default: "General" |
| `subject` | string | No | Subject name (e.g., "English", "Mathematics"). Default: "General" |

### Response

#### Success Response

```json
{
  "success": true,
  "response": "# Lesson Plan: ...",
  "timestamp": "2026-02-14T10:30:00.000Z"
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2026-02-14T10:30:00.000Z"
}
```

## Example Requests

### Basic Request (Placeholder Service)

```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on reading comprehension",
    "grade": "7",
    "subject": "English"
  }'
```

### With OpenAI

```bash
# Set environment variables
export AI_SERVICE_TYPE=openai
export OPENAI_API_KEY=sk-...

# Make request
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a 40-minute lesson on fractions with hands-on activities",
    "grade": "5",
    "subject": "Mathematics"
  }'
```

### With OpenRouter

```bash
export AI_SERVICE_TYPE=openrouter
export OPENROUTER_API_KEY=sk-or-v1-...

curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Develop an engaging biology lesson on cell structure",
    "grade": "9",
    "subject": "Science"
  }'
```

## CBC Curriculum Integration

### Adding Curriculum Documents

1. **Create Directory Structure** (if not exists):
   ```
   public/curriculum/
   └── Grade_7/
       └── English/
           ├── reading-comprehension.pdf
           ├── writing-standards.txt
           └── curriculum-overview.md
   ```

2. **Supported File Formats**:
   - PDF files (`.pdf`) - requires pdf-parse library
   - Text files (`.txt`)
   - Markdown files (`.md`)
   - JSON data (`.json`)

3. **File Naming**: Use descriptive names with hyphens:
   - `reading-comprehension.pdf`
   - `writing-standards.txt`
   - `literature-analysis-framework.md`

### Automatic Curriculum Context Loading

When you make a request with `grade` and `subject` parameters:

1. The API searches for matching curriculum documents
2. Loads relevant standards and competencies
3. Includes curriculum context in the AI system prompt
4. Ensures lesson plans align with CBC standards

### Example with Curriculum

With `Grade_7/English/reading-comprehension.pdf` in place:

```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a lesson on identifying main ideas and supporting details",
    "grade": "7",
    "subject": "English"
  }'
```

**Result**: The AI will generate a lesson that:
- ✅ References Grade 7 English standards
- ✅ Aligns with CBC competencies from your curriculum PDF
- ✅ Includes specific learning objectives from the standards
- ✅ Uses 40-minute time allocation with detailed activities

## Lesson Plan Format

All lesson plans include:

- **Title and Metadata**: Topic, duration, grade, subject
- **Learning Objectives**: CBC competency-aligned goals
- **Standards Alignment**: Reference to curriculum competencies
- **40-Minute Timeline**:
  - Hook & Activation (5 min)
  - Direct Instruction (8-10 min)
  - Guided Practice (10-12 min)
  - Independent Practice (10-15 min)
  - Closure & Reflection (3-5 min)
- **Differentiation Strategies**: For diverse learners
- **Assessment Methods**: Formative and summative
- **Resources**: Materials and technology needed
- **Homework/Extensions**: Follow-up activities

## Configuration

### Environment Variables

```bash
# Service Selection
AI_SERVICE_TYPE=placeholder|openai|openrouter|custom

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-...

# Custom Backend Configuration
CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
CUSTOM_AI_API_KEY=your-secret-key
```

### Testing Configuration

```bash
# Development - Placeholder (no API key needed)
AI_SERVICE_TYPE=placeholder

# Production - OpenAI
AI_SERVICE_TYPE=openai
OPENAI_API_KEY=sk-...
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Prompt is required" | Empty or missing prompt | Provide a non-empty prompt string |
| "Prompt exceeds maximum length" | Prompt > 5000 chars | Shorten the prompt |
| "OPENAI_API_KEY not set" | Missing env variable | Set OPENAI_API_KEY in environment |
| "Invalid JSON in request body" | Malformed JSON | Check JSON syntax in request |
| "Method not allowed" | Using GET instead of POST | Use POST method |

## JavaScript/TypeScript Client Example

```typescript
async function generateLessonPlan(
  prompt: string,
  grade: string = 'General',
  subject: string = 'General'
) {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      grade,
      subject,
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Lesson Plan Generated:');
    console.log(data.response);
  } else {
    console.error('Error:', data.error);
  }
}

// Usage
await generateLessonPlan(
  'Create an interactive lesson on photosynthesis',
  '8',
  'Science'
);
```

## Next Steps

1. ✅ **API is ready** - Start making requests immediately
2. 📚 **Add Curriculum PDFs** - Place CBC documents in `public/curriculum/`
3. 🔑 **Configure AI Service** - Set API keys for OpenAI or OpenRouter
4. 🎨 **Customize System Prompts** - Modify `buildSystemPrompt()` for specific needs
5. 📊 **Track Usage** - Monitor API requests and responses

## Support & Troubleshooting

For issues:
1. Check environment variables: `echo $AI_SERVICE_TYPE`
2. Review API logs for error messages
3. Verify curriculum documents are in `public/curriculum/`
4. Test with placeholder service first
5. Check file permissions on curriculum documents

---

**Last Updated**: February 2026
**API Version**: 1.0.0
**Curriculum Support**: CBC (Kenyan Competency-Based Curriculum)

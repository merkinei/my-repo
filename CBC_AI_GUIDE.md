# Kenyan CBC AI Assistant - Complete Guide

This system generates **Kenyan CBC (Competency-Based Curriculum)** compliant teaching materials aligned with **KICD** and **TSC** standards.

## 📋 Table of Contents

1. [Features](#features)
2. [Document Types](#document-types)
3. [API Endpoints](#api-endpoints)
4. [Getting Started](#getting-started)
5. [Usage Examples](#usage-examples)
6. [Parser Details](#parser-details)
7. [Testing](#testing)

---

## ✨ Features

- **Official CBC Format**: Follows KICD/TSC professional standards
- **Three Document Types**: Lesson Plans, Schemes of Work, and Assessment Rubrics
- **AI-Powered Generation**: Works with OpenAI, OpenRouter, or custom backends
- **Structured Parsing**: Extracts data into typed objects for database storage
- **Curriculum Integration**: Automatically loads relevant CBC curriculum PDFs

---

## 📄 Document Types

### 1. Lesson Plan
**Kenyan CBC compliant lesson plan** with all required sections:
- Header (School, Term, Week, Lesson, Date, Class, Subject, Duration)
- Curriculum Details (Strand, Sub-Strand, Topic)
- Specific Learning Outcomes (learner-centered)
- Core Competencies (8 competencies checklist)
- Values (CBC values)
- Pertinent and Contemporary Issues (PCIs)
- Links to Other Subjects
- Teaching/Learning Resources
- Lesson Procedure (Introduction, Main Activity, Conclusion)
- Assessment (Formative & Summative)
- Differentiation (Gifted, Slow Learners, Disabled)
- Reflection (What worked, What didn't, Follow-up)

### 2. Scheme of Work
**Term-long planning document** with weekly breakdown:
- Header (School, Term, Year, Class, Subject)
- Weekly entries with:
  - Date range
  - Strand & Sub-Strand
  - Learning Outcomes
  - Key Inquiry Questions
  - Learning Experiences
  - Learning Resources
  - Assessment Methods
  - Reflection

### 3. Assessment Rubric
**4-point scale rubric** (CBC standard):
- Header (Subject, Class, Strand, Topic)
- Assessment Type (Formative/Summative)
- Assessment Task description
- Rubric Criteria with 4 levels:
  - Exceeding Expectations (4)
  - Meeting Expectations (3)
  - Approaching Expectations (2)
  - Below Expectations (1)
- Optional Holistic Scoring Guide

---

## 🔌 API Endpoints

### 1. **Generate CBC Documents** - `POST /api/ai-chat`

Generates Kenyan CBC-compliant teaching materials using AI.

**Request:**
```json
{
  "prompt": "Generate a Grade 7 English lesson plan on reading comprehension for Week 3, Term 1",
  "grade": "7",
  "subject": "English"
}
```

**Response:**
```json
{
  "success": true,
  "response": "# LESSON PLAN\n\n**SCHOOL:** ...",
  "timestamp": "2026-02-18T10:30:00.000Z"
}
```

**Prompt Examples:**
- `"Generate a Grade 7 English lesson plan on poetry analysis"`
- `"Create a Grade 5 Mathematics scheme of work for Term 2"`
- `"Develop an assessment rubric for Grade 8 Science on cell biology"`

---

### 2. **Parse CBC Documents** - `POST /api/parse-cbc`

Parses AI-generated CBC documents into structured data.

**Request:**
```json
{
  "text": "# LESSON PLAN\n\n**SCHOOL:** St. Mary's...",
  "documentType": "auto"
}
```

**Response:**
```json
{
  "success": true,
  "documentType": "lesson-plan",
  "data": {
    "school": "St. Mary's Primary School",
    "term": "Term 1",
    "week": 3,
    "subject": "English",
    "class": "Grade 7",
    "specificLearningOutcomes": [
      "Identify main ideas in texts",
      "Use context clues for vocabulary"
    ],
    ...
  },
  "warnings": []
}
```

**Document Type Options:**
- `"auto"` - Auto-detect document type (default)
- `"lesson-plan"` - Parse as lesson plan
- `"scheme-of-work"` - Parse as scheme of work
- `"rubric"` - Parse as assessment rubric

---

## 🚀 Getting Started

### Step 1: Configure AI Service

Choose one of these options:

#### Option A: OpenAI (Recommended)
```bash
export AI_SERVICE_TYPE=openai
export OPENAI_API_KEY=sk-your-api-key-here
```

#### Option B: OpenRouter
```bash
export AI_SERVICE_TYPE=openrouter
export OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

#### Option C: Custom Backend
```bash
export AI_SERVICE_TYPE=custom
export CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
export CUSTOM_AI_API_KEY=your-api-key
```

#### Option D: Development/Testing
```bash
export AI_SERVICE_TYPE=placeholder
# Uses built-in sample responses
```

### Step 2: Add CBC Curriculum Documents (Optional)

```bash
# Create directory structure
mkdir -p public/curriculum/Grade_7/English

# Add curriculum PDFs
cp CBC_Grade_7_English.pdf public/curriculum/Grade_7/English/
```

### Step 3: Start Your Server

```bash
npm run dev
```

---

## 📚 Usage Examples

### Example 1: Generate a Lesson Plan

```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on identifying main ideas in reading passages, for Term 1 Week 3",
    "grade": "7",
    "subject": "English"
  }'
```

**What You Get:**
- Fully formatted CBC lesson plan
- All required sections filled
- 40-minute timing breakdown
- Differentiation strategies
- Assessment methods
- Ready for TSC inspection

---

### Example 2: Generate a Scheme of Work

```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a complete Term 1 scheme of work for Grade 6 Mathematics covering number operations, fractions, and geometry",
    "grade": "6",
    "subject": "Mathematics"
  }'
```

**What You Get:**
- 14-week term breakdown
- Weekly learning outcomes
- Key inquiry questions
- Learning experiences
- Resource lists
- Assessment plans

---

### Example 3: Generate an Assessment Rubric

```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Develop a formative assessment rubric for Grade 8 Science practical lab report on photosynthesis",
    "grade": "8",
    "subject": "Science"
  }'
```

**What You Get:**
- 4-point CBC scale rubric
- Clear criteria for each level
- Formative assessment focus
- Ready to use in class

---

### Example 4: Parse Generated Document

```bash
# First, generate a document
LESSON_PLAN=$(curl -s -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on poetry",
    "grade": "7",
    "subject": "English"
  }' | jq -r '.response')

# Then, parse it into structured data
curl -X POST http://localhost:4321/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": $(echo "$LESSON_PLAN" | jq -Rs .),
    \"documentType\": \"auto\"
  }" | jq
```

**What You Get:**
- Structured JSON object
- All fields extracted
- Types preserved
- Ready for database storage

---

## 🔍 Parser Details

### Lesson Plan Parser

**Extracts:**
- ✅ All header fields (school, term, week, etc.)
- ✅ Curriculum details (strand, sub-strand, topic)
- ✅ Learning outcomes (array)
- ✅ Core competencies (boolean flags)
- ✅ Values and PCIs (arrays)
- ✅ Lesson procedure with timing
- ✅ Teacher and learner activities
- ✅ Assessment strategies
- ✅ Differentiation for 3 groups
- ✅ Reflection fields

**TypeScript Interface:**
```typescript
interface CBCLessonPlan {
  school: string;
  term: string;
  week: number;
  lesson: number;
  date: string;
  class: string;
  subject: string;
  duration: string;
  numberOfStudents: number;
  topicArea: string;
  subTopic: string;
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string[];
  coreCompetencies: {
    communication?: boolean;
    collaboration?: boolean;
    criticalThinkingAndProblemSolving?: boolean;
    creativity?: boolean;
    citizenship?: boolean;
    digitalLiteracy?: boolean;
    learningToLearn?: boolean;
    selfEfficacy?: boolean;
  };
  values: string[];
  pcis: string[];
  integration: string[];
  learningResources: string[];
  lessonProcedure: {
    introduction: { duration: string; activities: string[] };
    mainActivity: { 
      duration: string; 
      teacherActivities: string[]; 
      learnerActivities: string[] 
    };
    conclusion: { duration: string; activities: string[] };
  };
  assessment: {
    formative: string[];
    summative?: string[];
  };
  differentiation: {
    gifted: string[];
    slow: string[];
    disabled: string[];
  };
  reflection: {
    whatWorkedWell: string;
    whatDidNotWork: string;
    followUp: string;
  };
}
```

---

### Scheme of Work Parser

**Extracts:**
- ✅ Header information
- ✅ Weekly breakdown (up to 14 weeks)
- ✅ Strands and sub-strands per week
- ✅ Learning outcomes
- ✅ Key inquiry questions
- ✅ Learning experiences
- ✅ Resources and assessment

---

### Rubric Parser

**Extracts:**
- ✅ Subject, class, strand, topic
- ✅ Rubric type (formative/summative)
- ✅ Assessment task description
- ✅ Criteria with 4 performance levels
- ✅ Optional holistic scoring guide

---

## 🧪 Testing

### Test 1: Generate and Parse Lesson Plan

```bash
# Create test script
cat > test-lesson-plan.sh << 'EOF'
#!/bin/bash

echo "=== Generating CBC Lesson Plan ==="
RESPONSE=$(curl -s -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on identifying main ideas, Term 1 Week 3",
    "grade": "7",
    "subject": "English"
  }')

echo "$RESPONSE" | jq -r '.response' > lesson-plan.md
echo "✅ Generated lesson plan saved to: lesson-plan.md"

echo -e "\n=== Parsing Lesson Plan ==="
PARSED=$(curl -s -X POST http://localhost:4321/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": $(cat lesson-plan.md | jq -Rs .)
  }")

echo "$PARSED" | jq > lesson-plan.json
echo "✅ Parsed data saved to: lesson-plan.json"

echo -e "\n=== Extracted Data Preview ==="
echo "$PARSED" | jq '{
  success,
  documentType,
  subject: .data.subject,
  class: .data.class,
  learningOutcomes: .data.specificLearningOutcomes,
  competencies: .data.coreCompetencies
}'
EOF

chmod +x test-lesson-plan.sh
./test-lesson-plan.sh
```

### Test 2: Generate Scheme of Work

```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a complete scheme of work for Grade 5 Mathematics Term 2",
    "grade": "5",
    "subject": "Mathematics"
  }' | jq -r '.response' > scheme-of-work.md

echo "✅ Scheme saved to: scheme-of-work.md"
```

### Test 3: Generate Assessment Rubric

```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create an assessment rubric for Grade 9 Science lab report on chemical reactions",
    "grade": "9",
    "subject": "Science"
  }' | jq -r '.response' > rubric.md

# Parse it
curl -X POST http://localhost:4321/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d "{\"text\": $(cat rubric.md | jq -Rs .)}" | jq > rubric.json

echo "✅ Rubric and parsed JSON saved"
```

---

## 📦 Integration with Your Database

### Example: Save to Database

```typescript
import { parseLessonPlan } from '@/lib/api/cbc-parser';

async function saveLessonPlan(aiGeneratedText: string) {
  // Parse the AI-generated text
  const result = parseLessonPlan(aiGeneratedText);
  
  if (!result.success) {
    console.error('Parsing errors:', result.errors);
    return;
  }
  
  // Save to your database
  await db.lessonPlans.create({
    data: {
      school: result.data.school,
      term: result.data.term,
      week: result.data.week,
      subject: result.data.subject,
      class: result.data.class,
      strand: result.data.strand,
      subStrand: result.data.subStrand,
      learningOutcomes: result.data.specificLearningOutcomes,
      // ... other fields
      createdAt: new Date(),
    },
  });
  
  console.log('✅ Lesson plan saved to database');
}
```

---

## ⚠️ Important Notes

### CBC Compliance Checklist

When generating documents, ensure:
- ✅ Uses "learner" not "student"
- ✅ Uses "learning outcomes" not "objectives"
- ✅ Includes all 8 core competencies
- ✅ Has differentiation for 3 groups (gifted, slow, disabled)
- ✅ Includes PCIs (Pertinent and Contemporary Issues)
- ✅ Has formative assessment strategies
- ✅ Lesson times add up to specified duration
- ✅ Reflection section is complete
- ✅ Uses proper CBC terminology (Strand, Sub-Strand)

### Common Errors and Solutions

**Error:** "Subject is required"
- **Solution:** Ensure the AI-generated document has a clear `SUBJECT:` field

**Error:** "No weekly data found"
- **Solution:** For schemes of work, ensure there's a proper table with week numbers

**Error:** "Rubric criteria are required"
- **Solution:** Ensure the rubric has a table with 4 performance levels

---

## 📖 Next Steps

1. **Test the System**: Run the test scripts above
2. **Customize Prompts**: Adjust prompts to your specific needs
3. **Add Curriculum PDFs**: Place relevant CBC documents in `public/curriculum/`
4. **Build Your UI**: Create a frontend to interact with these APIs
5. **Store Data**: Integrate with your database using the parsed structures

---

## 🆘 Support

For issues or questions:
1. Check that AI service is properly configured
2. Verify curriculum PDFs are in correct directories
3. Review API response for specific error messages
4. Test with placeholder service first (`AI_SERVICE_TYPE=placeholder`)

---

**Last Updated:** February 18, 2026  
**Version:** 1.0.0  
**Standards:** KICD CBC Framework, TSC Professional Standards

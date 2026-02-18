#!/bin/bash

# CBC AI System Test Script
# Tests lesson plan generation and parsing

echo "======================================"
echo "CBC AI System Test"
echo "======================================"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if ! curl -s http://localhost:4321 > /dev/null 2>&1; then
    echo "❌ Server is not running on port 4321"
    echo "   Please start the server with: npm run dev"
    exit 1
fi
echo "✅ Server is running"
echo ""

# Test 1: Generate Lesson Plan
echo "📝 Test 1: Generating CBC Lesson Plan..."
echo "   Grade: 7 | Subject: English | Topic: Reading Comprehension"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on identifying main ideas and supporting details in reading passages, for Term 1 Week 3",
    "grade": "7",
    "subject": "English"
  }')

# Check if request was successful
if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Lesson plan generated successfully"
    
    # Save to file
    echo "$RESPONSE" | jq -r '.response' > test-lesson-plan.md
    echo "✅ Saved to: test-lesson-plan.md"
    echo ""
    
    # Show preview
    echo "📄 Preview (first 20 lines):"
    echo "---"
    head -20 test-lesson-plan.md
    echo "---"
    echo "(See test-lesson-plan.md for full content)"
    echo ""
else
    echo "❌ Failed to generate lesson plan"
    echo "$RESPONSE" | jq
    exit 1
fi

# Test 2: Parse Lesson Plan
echo "🔍 Test 2: Parsing Generated Lesson Plan..."
echo ""

PARSED=$(curl -s -X POST http://localhost:4321/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": $(cat test-lesson-plan.md | jq -Rs .)
  }")

# Check if parsing was successful
if echo "$PARSED" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Lesson plan parsed successfully"
    
    # Save to file
    echo "$PARSED" | jq > test-lesson-plan.json
    echo "✅ Saved to: test-lesson-plan.json"
    echo ""
    
    # Show key data
    echo "📊 Extracted Key Data:"
    echo "---"
    echo "$PARSED" | jq '{
      documentType,
      subject: .data.subject,
      class: .data.class,
      strand: .data.strand,
      subStrand: .data.subStrand,
      week: .data.week,
      term: .data.term,
      duration: .data.duration,
      learningOutcomes: .data.specificLearningOutcomes,
      coreCompetencies: .data.coreCompetencies,
      assessmentMethods: .data.assessment.formative[0:2]
    }'
    echo "---"
    echo ""
else
    echo "❌ Failed to parse lesson plan"
    echo "$PARSED" | jq
    
    # Show any errors
    if echo "$PARSED" | jq -e '.errors' > /dev/null 2>&1; then
        echo ""
        echo "Parsing Errors:"
        echo "$PARSED" | jq -r '.errors[]'
    fi
    
    exit 1
fi

# Test 3: Generate Scheme of Work
echo "📋 Test 3: Generating Scheme of Work..."
echo ""

SCHEME_RESPONSE=$(curl -s -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a scheme of work for Grade 7 English Term 1 focusing on reading, writing, and language skills",
    "grade": "7",
    "subject": "English"
  }')

if echo "$SCHEME_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Scheme of work generated successfully"
    echo "$SCHEME_RESPONSE" | jq -r '.response' > test-scheme.md
    echo "✅ Saved to: test-scheme.md"
    echo ""
else
    echo "⚠️  Scheme generation had issues (continuing...)"
fi

# Test 4: Generate Assessment Rubric
echo "📏 Test 4: Generating Assessment Rubric..."
echo ""

RUBRIC_RESPONSE=$(curl -s -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a formative assessment rubric for Grade 7 English reading comprehension focusing on main idea identification and evidence citation",
    "grade": "7",
    "subject": "English"
  }')

if echo "$RUBRIC_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Assessment rubric generated successfully"
    echo "$RUBRIC_RESPONSE" | jq -r '.response' > test-rubric.md
    echo "✅ Saved to: test-rubric.md"
    echo ""
else
    echo "⚠️  Rubric generation had issues (continuing...)"
fi

# Summary
echo "======================================"
echo "✅ Test Complete!"
echo "======================================"
echo ""
echo "Generated Files:"
echo "  📝 test-lesson-plan.md    - Full lesson plan"
echo "  📊 test-lesson-plan.json  - Parsed structured data"
echo "  📋 test-scheme.md         - Scheme of work"
echo "  📏 test-rubric.md         - Assessment rubric"
echo ""
echo "Next Steps:"
echo "  1. Review generated files"
echo "  2. Check JSON structure in test-lesson-plan.json"
echo "  3. Verify CBC compliance"
echo "  4. Integrate with your database"
echo ""

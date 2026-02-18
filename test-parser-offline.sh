#!/bin/bash

# Direct CBC Parser Test (No Server Required)
# Tests the parser functionality directly with Node.js

echo "======================================"
echo "CBC Parser Direct Test"
echo "======================================"
echo ""

# Create a test lesson plan file
cat > test-sample-lesson.md << 'EOF'
# LESSON PLAN

**SCHOOL:** Test Primary School  
**TERM:** Term 1  
**WEEK:** 3  **LESSON:** 1  **DATE:** 18/02/2026  
**CLASS/GRADE:** Grade 7  
**SUBJECT:** English  
**DURATION:** 40 minutes  
**NUMBER OF STUDENTS:** 35

## CURRICULUM DETAILS

**STRAND:** Reading  
**SUB-STRAND:** Comprehension  
**TOPIC/SUB-TOPIC:** Main Ideas

## SPECIFIC LEARNING OUTCOMES
By the end of the lesson, the learner should be able to:
1. Identify main ideas in texts
2. Use context clues for vocabulary
3. Make inferences from text

## CORE COMPETENCIES
[X] Communication and Collaboration  
[X] Critical Thinking and Problem Solving  
[X] Learning to Learn  

## VALUES
Respect, Responsibility

## PERTINENT AND CONTEMPORARY ISSUES (PCIs)
- Reading culture promotion

## LINKS TO OTHER SUBJECTS
- Kiswahili (reading strategies)

## TEACHING/LEARNING RESOURCES
- Reading passages
- Graphic organizers

## LESSON PROCEDURE

### A. INTRODUCTION (5 minutes)

**Teacher Activities:**
- Greet learners
- Ask opening question

**Learner Activities:**
- Respond to greetings
- Answer questions

### B. MAIN ACTIVITY (28 minutes)

**Teacher Activities:**
- Explain main idea concept
- Model think-aloud strategy

**Learner Activities:**
- Listen attentively
- Work in groups

### C. CONCLUSION (7 minutes)

**Teacher Activities:**
- Review key concepts
- Assign homework

**Learner Activities:**
- Summarize learning
- Write homework

## ASSESSMENT

### Formative Assessment
- Observation during group work
- Exit tickets

## DIFFERENTIATION

### For Gifted and Talented Learners
- Provide complex passages

### For Slow Learners
- Use simpler texts

### For Learners with Disabilities
- Provide audio versions

## REFLECTION

**What worked well:**  
Group work was effective

**What did not work:**  
Some timing issues

**Follow-up:**  
Need better time management
EOF

echo "✅ Created test lesson plan: test-sample-lesson.md"
echo ""

# Create a simple Node.js test script
cat > test-parser-direct.mjs << 'EOF'
import { readFileSync } from 'fs';
import { parseLessonPlan, parseDocument } from './src/lib/api/cbc-parser.ts';

console.log('📖 Reading test lesson plan...');
const lessonText = readFileSync('test-sample-lesson.md', 'utf-8');

console.log('\n🔍 Parsing lesson plan...');
const result = parseLessonPlan(lessonText);

if (result.success) {
  console.log('\n✅ PARSING SUCCESSFUL!\n');
  console.log('Document Type: lesson-plan');
  console.log('Subject:', result.data.subject);
  console.log('Class:', result.data.class);
  console.log('Strand:', result.data.strand);
  console.log('Week:', result.data.week);
  console.log('\nLearning Outcomes:');
  result.data.specificLearningOutcomes.forEach((outcome, i) => {
    console.log(`  ${i + 1}. ${outcome}`);
  });
  
  console.log('\nCore Competencies:');
  Object.entries(result.data.coreCompetencies).forEach(([key, value]) => {
    if (value) console.log(`  ✓ ${key}`);
  });
  
  console.log('\n📊 Full parsed data saved to: test-parsed-output.json');
  
  import('fs').then(fs => {
    fs.writeFileSync('test-parsed-output.json', JSON.stringify(result, null, 2));
  });
  
} else {
  console.log('\n❌ PARSING FAILED\n');
  console.log('Errors:', result.errors);
}
EOF

echo "📝 Testing parser with TypeScript/Node..."
echo ""

# Try to run with tsx or ts-node if available
if command -v tsx &> /dev/null; then
    tsx test-parser-direct.mjs
elif command -v ts-node &> /dev/null; then
    ts-node test-parser-direct.mjs
else
    echo "⚠️  tsx or ts-node not available"
    echo ""
    echo "To test the parser, install dependencies first:"
    echo "  npm install"
    echo ""
    echo "Then run the server test:"
    echo "  npm run dev (in background)"
    echo "  ./test-cbc-system.sh"
fi

echo ""
echo "======================================"
echo "Alternative: Manual Review"
echo "======================================"
echo ""
echo "Without a running server, you can:"
echo "1. Review the generated files:"
echo "   - CBC_AI_GUIDE.md (complete documentation)"
echo "   - CBC_QUICK_REFERENCE.md (quick start)"
echo "   - public/curriculum/Grade_7/English/sample-lesson-plan.md (example)"
echo ""
echo "2. Review the code:"
echo "   - src/lib/api/cbc-templates.ts (templates)"
echo "   - src/lib/api/cbc-parser.ts (parser logic)"
echo ""
echo "3. Once dependencies install, run: ./test-cbc-system.sh"
echo ""

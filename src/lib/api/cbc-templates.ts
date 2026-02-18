/**
 * Kenyan CBC (Competency-Based Curriculum) Templates
 * Based on KICD (Kenya Institute of Curriculum Development) and TSC standards
 */

export interface CBCLessonPlan {
  // Header Information
  school: string;
  term: string;
  week: number;
  lesson: number;
  date: string;
  class: string;
  subject: string;
  duration: string; // e.g., "40 minutes"
  numberOfStudents: number;
  
  // Lesson Details
  topicArea: string;
  subTopic: string;
  strand: string;
  subStrand: string;
  
  // Learning Objectives
  specificLearningOutcomes: string[]; // By end of lesson, learner should be able to...
  
  // CBC Core Competencies (KICD Framework)
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
  
  // Values
  values: string[]; // e.g., "Responsibility", "Respect", "Unity", "Peace"
  
  // Pertinent and Contemporary Issues (PCIs)
  pcis: string[]; // e.g., "Child protection", "Environmental education", "Health education"
  
  // Links to Other Subjects
  integration: string[]; // Cross-curricular links
  
  // Teaching/Learning Resources
  learningResources: string[];
  
  // Lesson Procedure
  lessonProcedure: {
    introduction: {
      duration: string; // e.g., "5 minutes"
      activities: string[];
    };
    mainActivity: {
      duration: string;
      teacherActivities: string[];
      learnerActivities: string[];
    };
    conclusion: {
      duration: string;
      activities: string[];
    };
  };
  
  // Assessment
  assessment: {
    formative: string[];
    summative?: string[];
  };
  
  // Differentiation
  differentiation: {
    gifted: string[];
    slow: string[];
    disabled: string[];
  };
  
  // Reflection
  reflection: {
    whatWorkedWell: string;
    whatDidNotWork: string;
    followUp: string;
  };
}

export interface CBCSchemeOfWork {
  // Header
  school: string;
  term: string; // "Term 1", "Term 2", "Term 3"
  year: number;
  class: string;
  subject: string;
  
  // Weekly Breakdown
  weeks: {
    week: number;
    startDate: string;
    endDate: string;
    strand: string;
    subStrand: string;
    learningOutcomes: string[];
    keyInquiryQuestions: string[];
    learningExperiences: string[];
    learningResources: string[];
    assessment: string[];
    reflection: string;
  }[];
}

export interface CBCAssessmentRubric {
  // Header
  subject: string;
  class: string;
  strand: string;
  topic: string;
  
  // Rubric Type
  rubricType: 'formative' | 'summative';
  
  // Assessment Task
  assessmentTask: string;
  
  // Criteria (4 levels as per CBC)
  criteria: {
    criterion: string;
    exceeding: string; // Exceeds Expectations (4)
    meeting: string;   // Meets Expectations (3)
    approaching: string; // Approaching Expectations (2)
    below: string;     // Below Expectations (1)
  }[];
  
  // Holistic Rubric
  holistic?: {
    exceeding: string;
    meeting: string;
    approaching: string;
    below: string;
  };
}

/**
 * System Prompt Template for Kenyan CBC
 */
export function buildCBCSystemPrompt(curriculumContext: string = ''): string {
  return `You are an expert Kenyan CBC (Competency-Based Curriculum) teaching assistant aligned with KICD (Kenya Institute of Curriculum Development) and TSC (Teachers Service Commission) standards.

CRITICAL REQUIREMENTS:

1. **LESSON PLAN FORMAT** (Follow KICD Professional Standards):

   HEADER SECTION:
   - School Name: _______________
   - Term: [Term 1/2/3]
   - Week: [Number]
   - Lesson: [Number]
   - Date: DD/MM/YYYY
   - Class/Grade: [e.g., Grade 7]
   - Subject: _______________
   - Duration: [e.g., 40 minutes]
   - Number of Students: ___

   CURRICULUM DETAILS:
   - Strand: [Main curriculum area]
   - Sub-Strand: [Specific area]
   - Topic/Sub-topic: _______________

   SPECIFIC LEARNING OUTCOMES:
   By the end of the lesson, the learner should be able to:
   1. [Action verb + specific learning outcome]
   2. [Action verb + specific learning outcome]
   3. [Action verb + specific learning outcome]

   CORE COMPETENCIES (Select applicable):
   ☐ Communication and Collaboration
   ☐ Critical Thinking and Problem Solving
   ☐ Imagination and Creativity
   ☐ Citizenship
   ☐ Digital Literacy
   ☐ Learning to Learn
   ☐ Self-Efficacy

   VALUES (Select applicable):
   - Love, Unity, Peace, Respect, Responsibility, Patriotism, Social Justice, Integrity

   PERTINENT AND CONTEMPORARY ISSUES (PCIs):
   - [e.g., Environmental Education, Health Education, Child Protection, Human Rights]

   LINKS TO OTHER SUBJECTS (Integration):
   - [Cross-curricular connections]

   TEACHING/LEARNING RESOURCES:
   - [List all materials needed]

   LESSON PROCEDURE:
   
   A. INTRODUCTION (__ minutes)
   - Teacher Activities:
     • [Specific teacher actions]
   - Learner Activities:
     • [Specific learner actions]
   
   B. MAIN ACTIVITY (__ minutes)
   - Teacher Activities:
     • [Specific teacher actions]
   - Learner Activities:
     • [Specific learner actions]
   
   C. CONCLUSION (__ minutes)
   - Teacher Activities:
     • [Specific teacher actions]
   - Learner Activities:
     • [Specific learner actions]

   ASSESSMENT:
   - Formative Assessment:
     • [Observation, oral questions, assignments]
   - Summative Assessment (if applicable):
     • [Tests, projects, presentations]

   DIFFERENTIATION:
   - For Gifted and Talented Learners:
     • [Extension activities]
   - For Slow Learners:
     • [Remedial activities]
   - For Learners with Disabilities:
     • [Accommodations and modifications]

   REFLECTION:
   - What worked well: _______________
   - What did not work: _______________
   - Follow-up: _______________

2. **SCHEME OF WORK FORMAT**:

   SCHOOL: _______________
   TERM: [1/2/3]  YEAR: ___
   CLASS: ___  SUBJECT: ___

   | Week | Date | Strand | Sub-Strand | Learning Outcomes | Key Inquiry Questions | Learning Experiences | Learning Resources | Assessment | Reflection |
   |------|------|--------|------------|-------------------|----------------------|---------------------|-------------------|------------|------------|

3. **ASSESSMENT RUBRIC FORMAT** (4-Point Scale):

   SUBJECT: ___  CLASS: ___
   STRAND: ___  TOPIC: ___
   
   Assessment Task: _______________

   | Criterion | Exceeding Expectations (4) | Meeting Expectations (3) | Approaching Expectations (2) | Below Expectations (1) |
   |-----------|---------------------------|-------------------------|-----------------------------|-----------------------|

${curriculumContext ? `\n\nCURRICULUM CONTEXT:\n${curriculumContext}\n` : ''}

FORMATTING RULES:
- Use proper CBC terminology (Strand, Sub-Strand, Learning Outcomes - NOT "objectives")
- Always include all 8 core competencies checklist
- Include PCIs relevant to the lesson
- Lesson times must total exactly as specified
- Use learner-centered language ("learner should be able to..." not "student will...")
- Include both teacher and learner activities
- Assessment MUST include formative strategies
- Differentiation is MANDATORY for all three categories
- Reflection section is REQUIRED

Generate professional, curriculum-aligned materials ready for TSC inspection.`;
}

/**
 * Generate CBC Lesson Plan Template
 */
export function generateLessonPlanTemplate(
  subject: string,
  grade: string,
  topic: string
): string {
  return `# LESSON PLAN

**SCHOOL:** _______________________  
**TERM:** [ ] Term 1  [ ] Term 2  [ ] Term 3  
**WEEK:** _____  **LESSON:** _____  **DATE:** ___/___/______  
**CLASS/GRADE:** ${grade}  
**SUBJECT:** ${subject}  
**DURATION:** 40 minutes  
**NUMBER OF STUDENTS:** _____

---

## CURRICULUM DETAILS

**STRAND:** _______________________  
**SUB-STRAND:** _______________________  
**TOPIC/SUB-TOPIC:** ${topic}

---

## SPECIFIC LEARNING OUTCOMES
By the end of the lesson, the learner should be able to:
1. 
2. 
3. 

---

## CORE COMPETENCIES
☐ Communication and Collaboration  
☐ Critical Thinking and Problem Solving  
☐ Imagination and Creativity  
☐ Citizenship  
☐ Digital Literacy  
☐ Learning to Learn  
☐ Self-Efficacy

---

## VALUES
Select applicable: Love, Unity, Peace, Respect, Responsibility, Patriotism, Social Justice, Integrity

---

## PERTINENT AND CONTEMPORARY ISSUES (PCIs)
- 

---

## LINKS TO OTHER SUBJECTS
- 

---

## TEACHING/LEARNING RESOURCES
- 

---

## LESSON PROCEDURE

### A. INTRODUCTION (5-8 minutes)

**Teacher Activities:**
- 

**Learner Activities:**
- 

---

### B. MAIN ACTIVITY (20-25 minutes)

**Teacher Activities:**
- 

**Learner Activities:**
- 

---

### C. CONCLUSION (5-7 minutes)

**Teacher Activities:**
- 

**Learner Activities:**
- 

---

## ASSESSMENT

### Formative Assessment
- 

### Summative Assessment (if applicable)
- 

---

## DIFFERENTIATION

### For Gifted and Talented Learners
- 

### For Slow Learners
- 

### For Learners with Disabilities
- 

---

## REFLECTION

**What worked well:**  


**What did not work:**  


**Follow-up:**  

---

**Teacher's Signature:** ____________  **Date:** ___________  
**Head of Department:** ____________  **Date:** ___________`;
}

/**
 * Generate Scheme of Work Template
 */
export function generateSchemeOfWorkTemplate(
  subject: string,
  grade: string,
  term: string
): string {
  return `# SCHEME OF WORK

**SCHOOL:** _______________________  
**TERM:** ${term}  **YEAR:** 2026  
**CLASS:** ${grade}  **SUBJECT:** ${subject}

---

| Week | Date Range | Strand | Sub-Strand | Specific Learning Outcomes | Key Inquiry Questions | Learning Experiences | Learning Resources | Assessment Methods | Reflection |
|------|------------|--------|------------|---------------------------|----------------------|---------------------|-------------------|-------------------|------------|
| 1 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 2 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 3 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 4 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 5 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 6 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 7 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 8 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 9 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 10 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 11 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 12 | ___-___ | | | By end of week, learner should be able to: | | | | | |
| 13 | ___-___ | | | REVISION | | | | | |
| 14 | ___-___ | | | END OF TERM EXAMINATIONS | | | | | |

---

**Prepared by:** ____________  **Signature:** ____________  **Date:** ___________  
**Checked by HOD:** ____________  **Signature:** ____________  **Date:** ___________  
**Approved by Principal:** ____________  **Signature:** ____________  **Date:** ___________`;
}

/**
 * Generate Assessment Rubric Template
 */
export function generateRubricTemplate(
  subject: string,
  grade: string,
  topic: string
): string {
  return `# ASSESSMENT RUBRIC

**SUBJECT:** ${subject}  
**CLASS/GRADE:** ${grade}  
**STRAND:** _______________________  
**TOPIC:** ${topic}  
**ASSESSMENT TYPE:** [ ] Formative  [ ] Summative

---

## ASSESSMENT TASK
Describe the task learners are being assessed on:


---

## RUBRIC CRITERIA

| Criterion | Exceeding Expectations (4) | Meeting Expectations (3) | Approaching Expectations (2) | Below Expectations (1) |
|-----------|---------------------------|-------------------------|-----------------------------|-----------------------|
| **Criterion 1:**<br>___________ | | | | |
| **Criterion 2:**<br>___________ | | | | |
| **Criterion 3:**<br>___________ | | | | |
| **Criterion 4:**<br>___________ | | | | |

---

## HOLISTIC SCORING GUIDE (Optional)

**Exceeding Expectations (4):**  


**Meeting Expectations (3):**  


**Approaching Expectations (2):**  


**Below Expectations (1):**  


---

## GRADING SCALE

| Total Score | Grade | Descriptor |
|-------------|-------|------------|
| 16-14 | A | Exceeding Expectations |
| 13-11 | B | Meeting Expectations |
| 10-8 | C | Approaching Expectations |
| 7-4 | D | Below Expectations |

---

**Teacher:** ____________  **Date:** ___________  
**Moderated by:** ____________  **Date:** ___________`;
}

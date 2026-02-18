/**
 * CBC Document Parser
 * Extracts structured data from AI-generated Kenyan CBC-compliant documents
 * (Lesson Plans, Schemes of Work, and Assessment Rubrics)
 */

import type {
  CBCLessonPlan,
  CBCSchemeOfWork,
  CBCAssessmentRubric,
} from './cbc-templates';

/**
 * Parsed Document Result
 */
export interface ParsedDocument<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

/**
 * Parse CBC Lesson Plan from AI-generated text
 */
export function parseLessonPlan(text: string): ParsedDocument<CBCLessonPlan> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Initialize lesson plan object
    const lessonPlan: Partial<CBCLessonPlan> = {};

    // Extract header information
    lessonPlan.school = extractField(text, /SCHOOL:\s*(.+)/i) || '';
    lessonPlan.term = extractField(text, /TERM:\s*(Term\s*\d|[123])/i) || '';
    lessonPlan.week = parseInt(extractField(text, /WEEK:\s*(\d+)/i) || '0');
    lessonPlan.lesson = parseInt(extractField(text, /LESSON:\s*(\d+)/i) || '0');
    lessonPlan.date = extractField(text, /DATE:\s*([\d\/\-]+)/i) || '';
    lessonPlan.class = extractField(text, /CLASS(?:\/GRADE)?:\s*(.+)/i) || '';
    lessonPlan.subject = extractField(text, /SUBJECT:\s*(.+)/i) || '';
    lessonPlan.duration = extractField(text, /DURATION:\s*(.+)/i) || '40 minutes';
    lessonPlan.numberOfStudents = parseInt(
      extractField(text, /NUMBER OF STUDENTS:\s*(\d+)/i) || '0'
    );

    // Extract curriculum details
    lessonPlan.strand = extractField(text, /STRAND:\s*(.+)/i) || '';
    lessonPlan.subStrand = extractField(text, /SUB-STRAND:\s*(.+)/i) || '';
    lessonPlan.topicArea = extractField(text, /TOPIC(?:\/SUB-TOPIC)?:\s*(.+)/i) || '';
    lessonPlan.subTopic = lessonPlan.topicArea;

    // Extract specific learning outcomes
    lessonPlan.specificLearningOutcomes = extractListSection(
      text,
      /SPECIFIC LEARNING OUTCOMES[\s\S]*?By the end of the lesson.*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    );

    // Extract core competencies
    lessonPlan.coreCompetencies = {
      communication: checkboxChecked(text, /Communication and Collaboration/i),
      collaboration: checkboxChecked(text, /Communication and Collaboration/i),
      criticalThinkingAndProblemSolving: checkboxChecked(text, /Critical Thinking/i),
      creativity: checkboxChecked(text, /Imagination and Creativity/i),
      citizenship: checkboxChecked(text, /Citizenship/i),
      digitalLiteracy: checkboxChecked(text, /Digital Literacy/i),
      learningToLearn: checkboxChecked(text, /Learning to Learn/i),
      selfEfficacy: checkboxChecked(text, /Self-Efficacy/i),
    };

    // Extract values
    lessonPlan.values = extractCommaSeparatedList(
      text,
      /VALUES[\s\S]*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    );

    // Extract PCIs
    lessonPlan.pcis = extractListSection(
      text,
      /PERTINENT AND CONTEMPORARY ISSUES[\s\S]*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    );

    // Extract integration/links
    lessonPlan.integration = extractListSection(
      text,
      /LINKS TO OTHER SUBJECTS[\s\S]*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    );

    // Extract learning resources
    lessonPlan.learningResources = extractListSection(
      text,
      /TEACHING\/LEARNING RESOURCES[\s\S]*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    );

    // Extract lesson procedure
    const introSection = extractSection(text, /INTRODUCTION\s*\(([^)]+)\)([\s\S]*?)(?=###|##\s+[A-Z])/i);
    const mainSection = extractSection(text, /MAIN ACTIVITY\s*\(([^)]+)\)([\s\S]*?)(?=###|##\s+[A-Z])/i);
    const conclusionSection = extractSection(text, /CONCLUSION\s*\(([^)]+)\)([\s\S]*?)(?=###|##\s+[A-Z])/i);

    lessonPlan.lessonProcedure = {
      introduction: {
        duration: introSection.duration || '5 minutes',
        activities: [
          ...extractActivities(introSection.content, 'Teacher'),
          ...extractActivities(introSection.content, 'Learner'),
        ],
      },
      mainActivity: {
        duration: mainSection.duration || '25 minutes',
        teacherActivities: extractActivities(mainSection.content, 'Teacher'),
        learnerActivities: extractActivities(mainSection.content, 'Learner'),
      },
      conclusion: {
        duration: conclusionSection.duration || '10 minutes',
        activities: [
          ...extractActivities(conclusionSection.content, 'Teacher'),
          ...extractActivities(conclusionSection.content, 'Learner'),
        ],
      },
    };

    // Extract assessment
    const formativeAssessment = extractListSection(
      text,
      /Formative Assessment[\s\S]*?:([\s\S]*?)(?=###|##\s+[A-Z]|Summative)/i
    );
    const summativeAssessment = extractListSection(
      text,
      /Summative Assessment[\s\S]*?:([\s\S]*?)(?=###|##\s+[A-Z])/i
    );

    lessonPlan.assessment = {
      formative: formativeAssessment,
      summative: summativeAssessment.length > 0 ? summativeAssessment : undefined,
    };

    // Extract differentiation
    lessonPlan.differentiation = {
      gifted: extractListSection(
        text,
        /For Gifted and Talented[\s\S]*?:([\s\S]*?)(?=###|##\s+[A-Z])/i
      ),
      slow: extractListSection(
        text,
        /For Slow Learners[\s\S]*?:([\s\S]*?)(?=###|##\s+[A-Z])/i
      ),
      disabled: extractListSection(
        text,
        /For Learners with Disabilities[\s\S]*?:([\s\S]*?)(?=###|##\s+[A-Z])/i
      ),
    };

    // Extract reflection
    lessonPlan.reflection = {
      whatWorkedWell: extractField(text, /What worked well:\s*([\s\S]*?)(?=\n\*\*What did not|$)/i) || '',
      whatDidNotWork: extractField(text, /What did not work:\s*([\s\S]*?)(?=\n\*\*Follow-up|$)/i) || '',
      followUp: extractField(text, /Follow-up:\s*([\s\S]*?)(?=\n##|\n\*\*|$)/i) || '',
    };

    // Validation
    if (!lessonPlan.subject) errors.push('Subject is required');
    if (!lessonPlan.class) errors.push('Class/Grade is required');
    if (!lessonPlan.strand) warnings.push('Strand is missing');
    if (!lessonPlan.specificLearningOutcomes || lessonPlan.specificLearningOutcomes.length === 0) {
      errors.push('Specific learning outcomes are required');
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    return {
      success: true,
      data: lessonPlan as CBCLessonPlan,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Parse CBC Scheme of Work from AI-generated text
 */
export function parseSchemeOfWork(text: string): ParsedDocument<CBCSchemeOfWork> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const scheme: Partial<CBCSchemeOfWork> = {};

    // Extract header
    scheme.school = extractField(text, /SCHOOL:\s*(.+)/i) || '';
    scheme.term = extractField(text, /TERM:\s*(Term\s*\d|[123])/i) || '';
    scheme.year = parseInt(extractField(text, /YEAR:\s*(\d{4})/i) || new Date().getFullYear().toString());
    scheme.class = extractField(text, /CLASS:\s*(.+)/i) || '';
    scheme.subject = extractField(text, /SUBJECT:\s*(.+)/i) || '';

    // Extract weekly data from table
    scheme.weeks = parseSchemeTable(text);

    // Validation
    if (!scheme.subject) errors.push('Subject is required');
    if (!scheme.class) errors.push('Class is required');
    if (!scheme.weeks || scheme.weeks.length === 0) {
      errors.push('No weekly data found');
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    return {
      success: true,
      data: scheme as CBCSchemeOfWork,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Parse CBC Assessment Rubric from AI-generated text
 */
export function parseAssessmentRubric(text: string): ParsedDocument<CBCAssessmentRubric> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const rubric: Partial<CBCAssessmentRubric> = {};

    // Extract header
    rubric.subject = extractField(text, /SUBJECT:\s*(.+)/i) || '';
    rubric.class = extractField(text, /CLASS(?:\/GRADE)?:\s*(.+)/i) || '';
    rubric.strand = extractField(text, /STRAND:\s*(.+)/i) || '';
    rubric.topic = extractField(text, /TOPIC:\s*(.+)/i) || '';
    
    // Extract rubric type
    const typeMatch = text.match(/ASSESSMENT TYPE:.*?\[\s*[xX✓]\s*\]\s*(Formative|Summative)/i);
    rubric.rubricType = typeMatch ? (typeMatch[1].toLowerCase() as 'formative' | 'summative') : 'formative';

    // Extract assessment task
    rubric.assessmentTask = extractField(
      text,
      /ASSESSMENT TASK[\s\S]*?:([\s\S]*?)(?=\n##|\n\*\*[A-Z])/i
    )?.trim() || '';

    // Extract rubric criteria from table
    rubric.criteria = parseRubricTable(text);

    // Extract holistic scoring (if present)
    const holistic = extractHolisticScoring(text);
    if (holistic) {
      rubric.holistic = holistic;
    }

    // Validation
    if (!rubric.subject) errors.push('Subject is required');
    if (!rubric.class) errors.push('Class is required');
    if (!rubric.criteria || rubric.criteria.length === 0) {
      errors.push('Rubric criteria are required');
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    return {
      success: true,
      data: rubric as CBCAssessmentRubric,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Auto-detect document type and parse accordingly
 */
export function parseDocument(text: string): {
  type: 'lesson-plan' | 'scheme-of-work' | 'rubric' | 'unknown';
  result: ParsedDocument<CBCLessonPlan | CBCSchemeOfWork | CBCAssessmentRubric>;
} {
  // Check for lesson plan markers
  if (
    text.match(/LESSON PLAN/i) ||
    (text.match(/SPECIFIC LEARNING OUTCOMES/i) && text.match(/LESSON PROCEDURE/i))
  ) {
    return {
      type: 'lesson-plan',
      result: parseLessonPlan(text),
    };
  }

  // Check for scheme of work markers
  if (text.match(/SCHEME OF WORK/i) || text.match(/Week.*Strand.*Learning Outcomes/i)) {
    return {
      type: 'scheme-of-work',
      result: parseSchemeOfWork(text),
    };
  }

  // Check for rubric markers
  if (
    text.match(/ASSESSMENT RUBRIC/i) ||
    text.match(/Exceeding Expectations.*Meeting Expectations.*Below Expectations/i)
  ) {
    return {
      type: 'rubric',
      result: parseAssessmentRubric(text),
    };
  }

  return {
    type: 'unknown',
    result: {
      success: false,
      errors: ['Could not determine document type'],
    },
  };
}

// ====== Helper Functions ======

/**
 * Extract a single field using regex
 */
function extractField(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * Extract a bulleted or numbered list
 */
function extractListSection(text: string, pattern: RegExp): string[] {
  const match = text.match(pattern);
  if (!match) return [];

  const content = match[1];
  const items: string[] = [];

  // Match numbered lists (1., 2., etc.)
  const numberedMatches = content.matchAll(/^\s*\d+\.\s*(.+)$/gm);
  for (const m of numberedMatches) {
    items.push(m[1].trim());
  }

  // Match bulleted lists (-, *, •, etc.)
  if (items.length === 0) {
    const bulletedMatches = content.matchAll(/^\s*[-*•]\s*(.+)$/gm);
    for (const m of bulletedMatches) {
      items.push(m[1].trim());
    }
  }

  return items.filter((item) => item.length > 0);
}

/**
 * Extract comma-separated list
 */
function extractCommaSeparatedList(text: string, pattern: RegExp): string[] {
  const match = text.match(pattern);
  if (!match) return [];

  return match[1]
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !item.match(/^[-_]+$/));
}

/**
 * Check if a checkbox is marked
 */
function checkboxChecked(text: string, pattern: RegExp): boolean {
  const match = text.match(pattern);
  if (!match) return false;

  const context = text.slice(Math.max(0, match.index! - 10), match.index! + 50);
  return /\[[xX✓]\]/.test(context);
}

/**
 * Extract a section with duration
 */
function extractSection(text: string, pattern: RegExp): { duration: string; content: string } {
  const match = text.match(pattern);
  if (!match) return { duration: '', content: '' };

  return {
    duration: match[1].trim(),
    content: match[2].trim(),
  };
}

/**
 * Extract activities for teacher or learner
 */
function extractActivities(content: string, role: 'Teacher' | 'Learner'): string[] {
  const pattern = new RegExp(`${role} Activities[:\s]+([\s\S]*?)(?=${role === 'Teacher' ? 'Learner' : '$'}|###|##)`, 'i');
  const match = content.match(pattern);
  if (!match) return [];

  return extractListSection(match[1], /([\s\S]+)/);
}

/**
 * Parse scheme of work table
 */
function parseSchemeTable(text: string): CBCSchemeOfWork['weeks'] {
  const weeks: CBCSchemeOfWork['weeks'] = [];
  
  // Simple table parsing - looks for Week | Date | Strand pattern
  const tablePattern = /\|\s*(\d+)\s*\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|/g;
  
  let match;
  while ((match = tablePattern.exec(text)) !== null) {
    const [, weekNum, dateRange, strand, subStrand, outcomes, questions, experiences, resources, assessment, reflection] = match;
    
    if (weekNum && !isNaN(parseInt(weekNum))) {
      weeks.push({
        week: parseInt(weekNum),
        startDate: dateRange.split('-')[0]?.trim() || '',
        endDate: dateRange.split('-')[1]?.trim() || '',
        strand: strand.trim(),
        subStrand: subStrand.trim(),
        learningOutcomes: [outcomes.trim()],
        keyInquiryQuestions: [questions.trim()],
        learningExperiences: [experiences.trim()],
        learningResources: [resources.trim()],
        assessment: [assessment.trim()],
        reflection: reflection.trim(),
      });
    }
  }

  return weeks;
}

/**
 * Parse rubric criteria table
 */
function parseRubricTable(text: string): CBCAssessmentRubric['criteria'] {
  const criteria: CBCAssessmentRubric['criteria'] = [];
  
  // Look for table rows with | Criterion | Exceeding | Meeting | Approaching | Below |
  const tablePattern = /\|\s*\*\*([^*]+)\*\*[^|]*\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|/g;
  
  let match;
  while ((match = tablePattern.exec(text)) !== null) {
    const [, criterion, exceeding, meeting, approaching, below] = match;
    
    if (criterion && !criterion.match(/Criterion/i)) {
      criteria.push({
        criterion: criterion.trim(),
        exceeding: exceeding.trim(),
        meeting: meeting.trim(),
        approaching: approaching.trim(),
        below: below.trim(),
      });
    }
  }

  return criteria;
}

/**
 * Extract holistic scoring guide
 */
function extractHolisticScoring(text: string): CBCAssessmentRubric['holistic'] | null {
  const exceedingMatch = text.match(/\*\*Exceeding Expectations \(4\):\*\*\s*([\s\S]*?)(?=\*\*Meeting|$)/i);
  const meetingMatch = text.match(/\*\*Meeting Expectations \(3\):\*\*\s*([\s\S]*?)(?=\*\*Approaching|$)/i);
  const approachingMatch = text.match(/\*\*Approaching Expectations \(2\):\*\*\s*([\s\S]*?)(?=\*\*Below|$)/i);
  const belowMatch = text.match(/\*\*Below Expectations \(1\):\*\*\s*([\s\S]*?)(?=\n##|$)/i);

  if (exceedingMatch && meetingMatch && approachingMatch && belowMatch) {
    return {
      exceeding: exceedingMatch[1].trim(),
      meeting: meetingMatch[1].trim(),
      approaching: approachingMatch[1].trim(),
      below: belowMatch[1].trim(),
    };
  }

  return null;
}

/**
 * Curriculum Context Loader
 * Handles loading and parsing CBC curriculum documents from the public/curriculum directory
 * 
 * This utility supports:
 * - PDF files (requires pdf-parse library - to be installed)
 * - Text files (.txt, .md)
 * - JSON curriculum data
 */

import fs from 'fs';
import path from 'path';

interface CurriculumDocument {
  grade: string;
  subject: string;
  content: string;
  source: string;
  lastUpdated: string;
}

/**
 * Get relevant curriculum context based on grade and subject
 * @param grade - Grade level (e.g., "7", "Grade 7")
 * @param subject - Subject name (e.g., "English", "Mathematics")
 * @returns Formatted curriculum context string
 */
export async function getCurriculumContextForLesson(
  grade: string,
  subject: string
): Promise<string> {
  try {
    const curriculumPath = path.join(process.cwd(), 'public', 'curriculum');
    
    // Check if curriculum directory exists
    if (!fs.existsSync(curriculumPath)) {
      return buildDefaultContext(grade, subject);
    }

    const documents = await loadCurriculumDocuments(curriculumPath, grade, subject);
    
    if (documents.length === 0) {
      return buildDefaultContext(grade, subject);
    }

    return formatCurriculumContext(documents, grade, subject);
  } catch (error) {
    console.warn('Error loading curriculum context:', error);
    return buildDefaultContext(grade, subject);
  }
}

/**
 * Load curriculum documents from directory structure
 */
async function loadCurriculumDocuments(
  basePath: string,
  grade: string,
  subject: string
): Promise<CurriculumDocument[]> {
  const documents: CurriculumDocument[] = [];
  
  // Normalize grade (7 -> "Grade_7" or "Grade 7")
  const normalizedGrade = normalizeGrade(grade);
  
  try {
    // Look for subject-specific files
    const gradePath = path.join(basePath, normalizedGrade, subject);
    
    if (fs.existsSync(gradePath)) {
      const files = fs.readdirSync(gradePath);
      
      for (const file of files) {
        const filePath = path.join(gradePath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json'))) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          documents.push({
            grade: normalizedGrade,
            subject,
            content: content.substring(0, 2000), // Limit content size
            source: file,
            lastUpdated: stats.mtime.toISOString(),
          });
        }
        // TODO: Add PDF parsing when pdf-parse is available
      }
    }
  } catch (error) {
    console.warn(`Could not load curriculum documents for ${normalizedGrade} ${subject}:`, error);
  }
  
  return documents;
}

/**
 * Format curriculum documents into a context string for the AI prompt
 */
function formatCurriculumContext(
  documents: CurriculumDocument[],
  grade: string,
  subject: string
): string {
  let context = `\n[CBC Curriculum Materials - ${grade} ${subject}]\n`;
  context += `Loaded from ${documents.length} document(s):\n\n`;
  
  for (const doc of documents) {
    context += `From: ${doc.source}\n`;
    context += `---\n`;
    context += doc.content;
    context += `\n---\n\n`;
  }
  
  return context;
}

/**
 * Build default context when no curriculum documents are found
 */
function buildDefaultContext(grade: string, subject: string): string {
  const contexts: Record<string, string> = {
    '7_English': `
[CBC Grade 7 English - Default Standards]

Key Competencies:
- Reading Comprehension: Students analyze texts for main ideas, supporting details, and inference
- Critical Thinking: Students evaluate author's purpose, bias, and perspective
- Communication: Students express ideas clearly both verbally and in writing
- Information Literacy: Students access, evaluate, and synthesize information

Core Skills:
- Identify and analyze main ideas and details
- Use context clues for vocabulary development
- Make evidence-based inferences
- Compare perspectives and viewpoints
- Analyze literary and informational texts
- Develop effective reading strategies

Standards Alignment:
- CBC English Competencies (Grade 7)
- Focus on comprehension strategies and analytical skills
- Emphasis on active reading techniques
    `.trim(),
    '7_Mathematics': `
[CBC Grade 7 Mathematics - Default Standards]

Key Competencies:
- Number sense and operations
- Algebraic thinking
- Geometry and spatial reasoning
- Data analysis and probability

Standards Alignment:
- CBC Mathematics Competencies (Grade 7)
    `.trim(),
  };
  
  const key = \`\${grade}_\${subject}\`;
  return contexts[key] || \`[CBC Grade \${grade} \${subject} - To add curriculum, place documents in public/curriculum directory]\`;
}

/**
 * Normalize grade input to directory format
 * Accepts: "7", "Grade 7", "Grade_7"
 */
function normalizeGrade(grade: string): string {
  let cleaned = grade.replace(/[^0-9]/g, '');
  return \`Grade_\${cleaned}\`;
}

/**
 * List all available curriculum documents
 */
export async function listAvailableCurriculum(): Promise<string[]> {
  try {
    const curriculumPath = path.join(process.cwd(), 'public', 'curriculum');
    
    if (!fs.existsSync(curriculumPath)) {
      return [];
    }
    
    const items: string[] = [];
    
    const traverseDir = (dir: string, prefix = ''): void => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        if (file === 'README.md') continue;
        
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const display = prefix ? \`\${prefix}/\${file}\` : file;
        
        if (stats.isDirectory()) {
          traverseDir(fullPath, display);
        } else if (stats.isFile()) {
          items.push(display);
        }
      }
    };
    
    traverseDir(curriculumPath);
    return items;
  } catch (error) {
    console.warn('Error listing curriculum:', error);
    return [];
  }
}

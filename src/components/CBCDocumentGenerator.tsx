/**
 * CBC Document Generator Component
 * Example React/TypeScript component for generating and parsing CBC documents
 */

import { useState } from 'react';
import type { CBCLessonPlan, CBCSchemeOfWork, CBCAssessmentRubric } from '@/lib/api/cbc-templates';

interface GenerateRequest {
  prompt: string;
  grade: string;
  subject: string;
}

interface ParseResult {
  success: boolean;
  documentType: 'lesson-plan' | 'scheme-of-work' | 'rubric' | 'unknown';
  data?: CBCLessonPlan | CBCSchemeOfWork | CBCAssessmentRubric;
  errors?: string[];
  warnings?: string[];
}

export default function CBCDocumentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [grade, setGrade] = useState('7');
  const [subject, setSubject] = useState('English');
  const [documentType, setDocumentType] = useState<'lesson-plan' | 'scheme' | 'rubric'>('lesson-plan');
  
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [error, setError] = useState('');

  // Generate CBC document
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setGeneratedText('');
    setParsedData(null);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildPrompt(),
          grade,
          subject,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedText(result.response);
        // Auto-parse the generated document
        await handleParse(result.response);
      } else {
        setError(result.error || 'Failed to generate document');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Parse generated document
  const handleParse = async (text: string) => {
    try {
      const response = await fetch('/api/parse-cbc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const result: ParseResult = await response.json();
      setParsedData(result);
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  // Build appropriate prompt based on document type
  const buildPrompt = (): string => {
    const basePrompt = prompt || getDefaultPrompt();
    
    switch (documentType) {
      case 'lesson-plan':
        return `Generate a Grade ${grade} ${subject} lesson plan on ${basePrompt}`;
      case 'scheme':
        return `Create a Grade ${grade} ${subject} scheme of work for ${basePrompt}`;
      case 'rubric':
        return `Develop an assessment rubric for Grade ${grade} ${subject} on ${basePrompt}`;
      default:
        return basePrompt;
    }
  };

  const getDefaultPrompt = (): string => {
    switch (documentType) {
      case 'lesson-plan':
        return 'reading comprehension strategies';
      case 'scheme':
        return 'Term 1 covering all strands';
      case 'rubric':
        return 'essay writing skills';
      default:
        return '';
    }
  };

  // Save to database (example)
  const handleSave = async () => {
    if (!parsedData?.data) {
      alert('No parsed data to save');
      return;
    }

    try {
      // Replace with your actual database endpoint
      const response = await fetch('/api/save-cbc-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: parsedData.documentType,
          data: parsedData.data,
        }),
      });

      if (response.ok) {
        alert('✅ Document saved to database!');
      } else {
        alert('❌ Failed to save document');
      }
    } catch (err) {
      alert(`Error saving: ${err}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CBC Document Generator</h1>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="lesson-plan">Lesson Plan</option>
              <option value="scheme">Scheme of Work</option>
              <option value="rubric">Assessment Rubric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="English">English</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Kiswahili">Kiswahili</option>
              <option value="CRE">CRE</option>
              <option value="IRE">IRE</option>
              <option value="HRE">HRE</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Topic/Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`e.g., ${getDefaultPrompt()}`}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate CBC Document'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Generated Document Display */}
      {generatedText && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Markdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-semibold">Generated Document (Markdown)</h2>
              <button
                onClick={() => navigator.clipboard.writeText(generatedText)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                📋 Copy
              </button>
            </div>
            <div className="p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono max-h-[600px] overflow-auto">
                {generatedText}
              </pre>
            </div>
          </div>

          {/* Parsed Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-semibold">Parsed Data (JSON)</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2))}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  disabled={!parsedData?.success}
                >
                  💾 Save to DB
                </button>
              </div>
            </div>
            <div className="p-4">
              {parsedData ? (
                <>
                  {parsedData.success ? (
                    <div>
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-800 font-semibold">
                          ✅ Successfully parsed as: {parsedData.documentType}
                        </p>
                      </div>
                      
                      {parsedData.warnings && parsedData.warnings.length > 0 && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-yellow-800 font-semibold mb-2">⚠️ Warnings:</p>
                          <ul className="list-disc list-inside text-sm">
                            {parsedData.warnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <pre className="text-sm font-mono max-h-[500px] overflow-auto bg-gray-50 p-3 rounded">
                        {JSON.stringify(parsedData.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-800 font-semibold mb-2">❌ Parsing Errors:</p>
                      <ul className="list-disc list-inside text-sm">
                        {parsedData.errors?.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">Parsing in progress...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">💡 Quick Tips:</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Lesson Plan:</strong> Generates 40-min CBC-compliant lesson with all sections</li>
          <li>• <strong>Scheme of Work:</strong> Creates term-long planning (14 weeks)</li>
          <li>• <strong>Rubric:</strong> Produces 4-point CBC assessment rubric</li>
          <li>• All documents follow KICD/TSC standards</li>
          <li>• Parsed data is ready for database storage</li>
        </ul>
      </div>
    </div>
  );
}

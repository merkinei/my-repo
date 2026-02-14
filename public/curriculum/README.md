# CBC Curriculum Documents

This directory is for storing Kenyan CBC (Competency-Based Curriculum) documents and PDFs.

## Setup Instructions

1. **Add CBC Curriculum PDFs** to this directory:
   - Place subject-specific curriculum documents here
   - Organize by grade level and subject
   - Example: `Grade_7_English_Curriculum.pdf`

2. **Supported File Types:**
   - PDF documents (`.pdf`)
   - Text files (`.txt`, `.md`)
   - JSON curriculum data (`.json`)

## Directory Structure

```
curriculum/
├── README.md
├── Grade_7/
│   ├── English/
│   │   ├── reading-comprehension.pdf
│   │   ├── writing-standards.pdf
│   │   └── literature-analysis.pdf
│   ├── Mathematics/
│   │   └── competencies.pdf
│   └── Science/
│       └── standards.pdf
├── Grade_8/
│   └── ...
└── General/
    └── cbc-framework.pdf
```

## How It Works

Once you add PDFs to this directory:

1. The AI service will automatically detect and load them
2. Curriculum context will be included in the system prompt
3. AI-generated lesson plans will reference relevant competencies
4. Grade-specific standards will be applied to lesson generation

## Example Usage

### With OpenAI:
```bash
AI_SERVICE_TYPE=openai
OPENAI_API_KEY=sk-...
# Then POST to /api/ai-chat with your prompt
```

### With Custom Backend:
```bash
AI_SERVICE_TYPE=custom
CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
```

## Future Enhancements

- [ ] Automatic PDF parsing and text extraction
- [ ] Vector database integration for semantic search
- [ ] Curriculum competency mapping
- [ ] Grade and subject filtering
- [ ] Standards alignment in lesson plans

## Support

For issues with curriculum integration, check:
1. File permissions (readable by the app)
2. File format (PDF, TXT, or JSON)
3. File size (reasonable for processing)
4. AI service logs for parsing errors

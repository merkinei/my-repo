# CBC AI Quick Reference

## 🚀 Quick Start (3 Commands)

```bash
# 1. Set AI service (choose one)
export AI_SERVICE_TYPE=placeholder  # or openai, openrouter

# 2. Start server
npm run dev

# 3. Test the system
chmod +x test-cbc-system.sh && ./test-cbc-system.sh
```

---

## 📝 Generate Documents

### Lesson Plan
```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate Grade 7 English lesson on poetry", "grade": "7", "subject": "English"}'
```

### Scheme of Work
```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create Grade 6 Math scheme for Term 1", "grade": "6", "subject": "Mathematics"}'
```

### Assessment Rubric
```bash
curl -X POST http://localhost:4321/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Rubric for Grade 8 Science lab report", "grade": "8", "subject": "Science"}'
```

---

## 🔍 Parse Documents

```bash
curl -X POST http://localhost:4321/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d '{"text": "...generated document text..."}'
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/lib/api/cbc-templates.ts` | CBC document templates & system prompt |
| `src/lib/api/cbc-parser.ts` | Parse AI docs → JSON |
| `src/pages/api/ai-chat.ts` | Generate documents API |
| `src/pages/api/parse-cbc.ts` | Parse documents API |
| `src/components/CBCDocumentGenerator.tsx` | Example React component |
| `test-cbc-system.sh` | Automated test script |
| `CBC_AI_GUIDE.md` | Complete documentation |
| `CBC_IMPLEMENTATION_SUMMARY.md` | Implementation overview |

---

## ✅ CBC Compliance Checklist

**Every Lesson Plan Must Have:**
- [x] Header (School, Term, Week, etc.)
- [x] Strand & Sub-Strand
- [x] Specific Learning Outcomes
- [x] 8 Core Competencies
- [x] Values & PCIs
- [x] Lesson Procedure (Intro, Main, Conclusion)
- [x] Formative Assessment
- [x] Differentiation (Gifted, Slow, Disabled)
- [x] Reflection

---

## 🎯 Common Prompts

```
"Generate a Grade [X] [Subject] lesson plan on [Topic] for Term [1/2/3] Week [#]"

"Create a scheme of work for Grade [X] [Subject] Term [1/2/3] covering [topics]"

"Develop a [formative/summative] assessment rubric for Grade [X] [Subject] on [skill]"
```

---

## 🔧 AI Service Setup

### OpenAI
```bash
export AI_SERVICE_TYPE=openai
export OPENAI_API_KEY=sk-...
```

### OpenRouter
```bash
export AI_SERVICE_TYPE=openrouter
export OPENROUTER_API_KEY=sk-or-v1-...
```

### Development
```bash
export AI_SERVICE_TYPE=placeholder
```

---

## 📊 Parser Output Structure

```typescript
{
  success: boolean,
  documentType: "lesson-plan" | "scheme-of-work" | "rubric",
  data: {
    // All CBC fields extracted
    subject: string,
    class: string,
    strand: string,
    learningOutcomes: string[],
    // ... etc
  },
  errors?: string[],
  warnings?: string[]
}
```

---

## 💡 Tips

1. **Be Specific**: Include grade, subject, topic in prompts
2. **Add Context**: Mention term, week, strand if known
3. **Use Curriculum PDFs**: Place in `public/curriculum/Grade_X/Subject/`
4. **Test First**: Use placeholder mode before production
5. **Parse Generated Docs**: Get structured data for database

---

## 📞 Need Help?

- Read: `CBC_AI_GUIDE.md` - Full documentation
- Check: `CBC_IMPLEMENTATION_SUMMARY.md` - Overview
- Run: `./test-cbc-system.sh` - Test everything
- View: `public/curriculum/Grade_7/English/sample-lesson-plan.md` - Example

---

**Standards:** KICD CBC Framework | TSC Professional Standards  
**Version:** 1.0.0 | **Date:** Feb 2026

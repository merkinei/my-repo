# AI Service Integration Guide

## Overview

The AI Chat API endpoint (`/api/ai-chat`) is now fully configured to support multiple AI service providers. This guide explains how to connect your preferred AI service.

## Supported AI Services

### 1. **OpenAI (GPT-4)**
The easiest option for production use.

#### Setup Steps:
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set environment variable:
   ```
   AI_SERVICE_TYPE=openai
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. Restart your application
4. The API will automatically route requests to OpenAI's GPT-4 Turbo model

#### Features:
- High-quality responses
- System prompt for CBC curriculum alignment
- Temperature: 0.7 (balanced creativity)
- Max tokens: 2000 per response

### 2. **OpenRouter**
Access multiple AI models through a single API.

#### Setup Steps:
1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. Set environment variable:
   ```
   AI_SERVICE_TYPE=openrouter
   OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```
3. Restart your application
4. The API will automatically route requests to OpenRouter using GPT-4 Turbo

#### Features:
- Access to multiple models (GPT-4, Claude, Mistral, etc.)
- Same API format as OpenAI
- Temperature: 0.7 (balanced creativity)
- Max tokens: 2000 per response
- Easy model switching by changing the model parameter

#### Available Models on OpenRouter:
- `openai/gpt-4-turbo` (default)
- `anthropic/claude-3-opus`
- `mistralai/mistral-large`
- Many others available - check OpenRouter dashboard for full list

### 3. **Custom Backend**
Connect to your own Flask, Node.js, or Python backend.

#### Setup Steps:
1. Ensure your backend accepts POST requests with this format:
   ```json
   {
     "prompt": "Your prompt text here"
   }
   ```
2. Your backend should return:
   ```json
   {
     "response": "Generated content here"
   }
   ```
   OR
   ```json
   {
     "result": "Generated content here"
   }
   ```
3. Set environment variables:
   ```
   AI_SERVICE_TYPE=custom
   CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
   CUSTOM_AI_API_KEY=your-api-key-optional
   ```
4. Restart your application

#### Example Backend (Flask):
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')
    
    # Your AI logic here
    response = generate_teaching_materials(prompt)
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
```

#### Example Backend (Node.js):
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  
  // Your AI logic here
  const response = await generateTeachingMaterials(prompt);
  
  res.json({ response });
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

### 4. **Placeholder (Development)**
Default mode for testing without external services.

#### Setup:
```
AI_SERVICE_TYPE=placeholder
```
OR leave unset (defaults to placeholder)

#### Response:
Returns a placeholder message indicating the API is ready for connection.

## API Endpoint Details

### Request
```
POST /api/ai-chat
Content-Type: application/json

{
  "prompt": "Generate a Grade 7 English lesson plan on Reading Comprehension for Term 1, Week 3"
}
```

### Response (Success)
```json
{
  "success": true,
  "response": "Generated teaching materials...",
  "timestamp": "2026-02-14T10:30:00.000Z"
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2026-02-14T10:30:00.000Z"
}
```

## Validation Rules

- **Prompt**: Required, non-empty string
- **Max Length**: 5000 characters
- **Method**: POST only
- **Content-Type**: application/json

## Error Handling

The API handles these error cases:

| Status | Error | Solution |
|--------|-------|----------|
| 405 | Method not allowed | Use POST method |
| 400 | Invalid JSON | Check request body format |
| 400 | Prompt is required | Include non-empty prompt |
| 400 | Prompt exceeds max length | Keep prompt under 5000 chars |
| 500 | Internal server error | Check environment variables |
| 500 | API key not set | Set OPENAI_API_KEY or CUSTOM_AI_ENDPOINT |

## Environment Variables Reference

### For OpenAI
```env
AI_SERVICE_TYPE=openai
OPENAI_API_KEY=sk-your-key-here
```

### For OpenRouter
```env
AI_SERVICE_TYPE=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### For Custom Backend
```env
AI_SERVICE_TYPE=custom
CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
CUSTOM_AI_API_KEY=your-optional-api-key
```

### For Development
```env
AI_SERVICE_TYPE=placeholder
```

## Testing the API

### Using cURL
```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate a lesson plan for Grade 5 Mathematics"}'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('/api/ai-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'Generate a lesson plan for Grade 5 Mathematics' 
  })
});

const data = await response.json();
console.log(data.response);
```

### Using Python/Requests
```python
import requests

response = requests.post('http://localhost:3000/api/ai-chat', json={
    'prompt': 'Generate a lesson plan for Grade 5 Mathematics'
})

print(response.json()['response'])
```

## Frontend Integration

The AI Chat Page (`/ai-chat`) is already integrated with the API:

1. Users enter a prompt in the textarea
2. Click "Generate Materials" button
3. The frontend sends the prompt to `/api/ai-chat`
4. Response is displayed in the response area
5. Example prompts from the CMS are available in the sidebar

## Troubleshooting

### "Internal server error"
- Check that environment variables are set correctly
- Verify API keys are valid
- Check browser console for detailed error messages

### "Failed to connect to the AI service"
- Verify the endpoint URL is correct (for custom backend)
- Check that your backend is running and accessible
- Verify CORS settings if backend is on different domain

### "API key not set"
- Ensure environment variable is set before starting the app
- Restart the application after setting environment variables
- Check for typos in variable names

### Slow responses
- OpenAI responses typically take 2-10 seconds
- Custom backends depend on your implementation
- Consider implementing response streaming for better UX

## Performance Tips

1. **Caching**: Consider caching common prompts to reduce API calls
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Timeouts**: Set appropriate timeout values for API calls
4. **Streaming**: For long responses, consider implementing streaming
5. **Batch Processing**: Group similar prompts for efficiency

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files (not in git)
3. **CORS**: Configure CORS properly if backend is on different domain
4. **Rate Limiting**: Implement rate limiting on the backend
5. **Input Validation**: Validate and sanitize user input
6. **HTTPS**: Always use HTTPS in production

## Next Steps

1. Choose your AI service provider
2. Set up environment variables
3. Test the API using the provided examples
4. Visit `/ai-chat` page to test the frontend integration
5. Monitor logs for any issues

## Support

For issues or questions:
- Check the error messages in browser console
- Review environment variable configuration
- Test the API endpoint directly with cURL or Postman
- Check your AI service provider's documentation

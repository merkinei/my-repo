#!/bin/bash

# CBC AI System - Deployment Preparation Script
# Prepares your project for deployment to Vercel/Netlify/Cloudflare

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   CBC AI System - Deployment Preparation                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "⚠️  Git not initialized. Initializing..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$BRANCH" != "main" ]; then
    echo "📝 Ensuring you're on 'main' branch..."
    git checkout -b main 2>/dev/null || git checkout main
fi

# Add all changes
echo ""
echo "📦 Staging all files for commit..."
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "✅ No new changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "CBC AI System ready for deployment

- Kenyan CBC-compliant lesson plan generator
- Scheme of work generator
- Assessment rubric generator
- Document parser for structured data
- KICD/TSC standards compliance
- API endpoints for generation and parsing
"
    echo "✅ Changes committed"
fi

# Check for remote
if git remote get-url origin &>/dev/null; then
    REMOTE=$(git remote get-url origin)
    echo ""
    echo "✅ Git remote configured: $REMOTE"
    
    # Ask if they want to push
    echo ""
    echo "📤 Ready to push to GitHub?"
    read -p "Push now? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Pushing to GitHub..."
        git push -u origin main
        echo "✅ Pushed to GitHub"
    else
        echo "⏭️  Skipping push. You can push later with: git push origin main"
    fi
else
    echo ""
    echo "⚠️  No git remote configured."
    echo ""
    echo "To add GitHub remote:"
    echo "  1. Create a repo at github.com"
    echo "  2. Run: git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git"
    echo "  3. Run: git push -u origin main"
fi

# Create .env.example for reference
echo ""
echo "📝 Creating .env.example file..."
cat > .env.example << 'EOF'
# CBC AI System - Environment Variables
# Copy this to .env for local development
# Add these to your deployment platform's environment settings

# AI Service Configuration (choose one)
AI_SERVICE_TYPE=openai
# AI_SERVICE_TYPE=openrouter
# AI_SERVICE_TYPE=placeholder

# OpenAI Configuration (if using OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key-here

# OpenRouter Configuration (if using OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here

# Custom Backend Configuration (if using custom AI)
# CUSTOM_AI_ENDPOINT=https://your-backend.com/api/generate
# CUSTOM_AI_API_KEY=your-custom-api-key
EOF
echo "✅ Created .env.example"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "💡 Tip: Copy .env.example to .env for local testing"
    echo "   cp .env.example .env"
fi

# Create deployment checklist
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Deployment Checklist                                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Git initialized and committed"
echo "✅ .env.example created"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Push to GitHub:"
echo "    git push origin main"
echo ""
echo "2️⃣  Choose a deployment platform:"
echo ""
echo "    🟢 Vercel (Recommended):"
echo "       • Go to vercel.com"
echo "       • Sign up with GitHub"
echo "       • Import your repository"
echo "       • Add environment variables"
echo "       • Deploy!"
echo ""
echo "    🔵 Netlify:"
echo "       • Go to netlify.com"
echo "       • Sign up with GitHub"
echo "       • New site from Git"
echo "       • Select repository"
echo "       • Add environment variables"
echo "       • Deploy!"
echo ""
echo "    🟠 Cloudflare Pages:"
echo "       • Go to pages.cloudflare.com"
echo "       • Connect GitHub"
echo "       • Select repository"
echo "       • Configure build settings"
echo "       • Deploy!"
echo ""
echo "3️⃣  Add Environment Variables on platform:"
echo "    AI_SERVICE_TYPE=openai"
echo "    OPENAI_API_KEY=sk-your-key"
echo ""
echo "4️⃣  Test your deployed API:"
echo "    curl -X POST https://YOUR-SITE.vercel.app/api/ai-chat \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"prompt\": \"Generate Grade 7 English lesson\", \"grade\": \"7\", \"subject\": \"English\"}'"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   📚 Documentation                                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "• Deployment Guide:     DEPLOYMENT_GUIDE.md"
echo "• Full Documentation:   CBC_AI_GUIDE.md"
echo "• Quick Reference:      CBC_QUICK_REFERENCE.md"
echo "• Implementation:       CBC_IMPLEMENTATION_SUMMARY.md"
echo ""
echo "🚀 Your CBC AI system is ready for deployment!"
echo ""

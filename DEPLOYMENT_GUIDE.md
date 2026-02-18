# Deploy Your CBC AI System - Step-by-Step Guide

## 🚀 Best Free Deployment Options

Your CBC AI system is built with Astro and works on any platform. Here are 3 easy options:

---

## ✅ OPTION 1: Deploy to Vercel (Recommended - Easiest)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "CBC AI system ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (free account)
3. Choose **"Continue with GitHub"**
4. Click **"Import Project"**
5. Select your repository: **merkinei/my-repo**
6. Vercel will auto-detect Astro
7. Click **"Deploy"**

### Step 3: Set Environment Variables (For AI Features)
After deployment:
1. Go to your project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these:
   ```
   AI_SERVICE_TYPE = openai
   OPENAI_API_KEY = sk-your-api-key-here
   ```
   *(Or use OpenRouter instead)*
4. Click **"Redeploy"**

### Step 4: Test Your Deployment
Your site will be live at: `https://your-project.vercel.app`

Test the CBC API:
```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 English lesson plan on poetry",
    "grade": "7",
    "subject": "English"
  }'
```

**✅ Done! Your CBC AI system is live in ~2 minutes.**

---

## ✅ OPTION 2: Deploy to Netlify

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign up"** (free)
3. Choose **"GitHub"**
4. Click **"New site from Git"**
5. Select **merkinei/my-repo**
6. Build settings (auto-detected):
   - Build command: `npm run build:astro`
   - Publish directory: `dist`
7. Click **"Deploy site"**

### Step 3: Add Environment Variables
1. Go to **"Site settings"** → **"Environment variables"**
2. Add:
   ```
   AI_SERVICE_TYPE = openai
   OPENAI_API_KEY = sk-your-key
   ```
3. Click **"Redeploy"**

**✅ Live at: `https://your-site.netlify.app`**

---

## ✅ OPTION 3: Deploy to Cloudflare Pages

### Step 1: Update Build Script
```bash
# Already done - your package.json has build:astro
```

### Step 2: Deploy
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click **"Create a project"**
3. Connect your GitHub account
4. Select **merkinei/my-repo**
5. Build settings:
   - Build command: `npm run build:astro`
   - Build output: `dist`
6. Add environment variables:
   ```
   AI_SERVICE_TYPE = openai
   OPENAI_API_KEY = sk-your-key
   ```
7. Click **"Save and Deploy"**

**✅ Live at: `https://your-project.pages.dev`**

---

## 🔧 Before Deployment Checklist

### 1. Fix Build Script (Already Added)
Your `package.json` now has:
```json
"scripts": {
  "dev:astro": "npx astro dev",
  "build:astro": "npx astro build",
  "preview:astro": "npx astro preview"
}
```

### 2. Check Astro Config
Your `astro.config.mjs` should work as-is, but verify it has:
```javascript
export default defineConfig({
  output: 'server', // or 'hybrid'
  adapter: cloudflare() // or remove for other platforms
});
```

For Vercel/Netlify, you might want to change adapter or use SSR.

### 3. Test Locally (Optional - if server works)
```bash
npm run build:astro
npm run preview:astro
```

---

## 🎯 Quick Deploy Commands

### Push to GitHub First:
```bash
# If you haven't already
git init
git add .
git commit -m "CBC AI system - ready for deployment"
git branch -M main
git remote add origin https://github.com/merkinei/my-repo.git
git push -u origin main
```

### Then Choose Platform Above ⬆️

---

## 🔑 Get Your API Keys

### For OpenAI:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Go to **"API keys"**
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. Add to your deployment platform's environment variables

### For OpenRouter (Alternative):
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up
3. Go to **"Keys"**
4. Create a key
5. Add to deployment as `OPENROUTER_API_KEY`

---

## 📊 After Deployment - Test Your CBC APIs

### Test Document Generation:
```bash
# Replace with your deployed URL
curl -X POST https://YOUR-SITE.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a Grade 7 Mathematics lesson plan on fractions for Term 2 Week 5",
    "grade": "7",
    "subject": "Mathematics"
  }'
```

### Test Document Parsing:
```bash
curl -X POST https://YOUR-SITE.vercel.app/api/parse-cbc \
  -H "Content-Type: application/json" \
  -d '{
    "text": "# LESSON PLAN\n\n**SCHOOL:** Test...",
  }'
```

---

## 💡 Deployment Tips

### Free Tier Limits:
- **Vercel**: Unlimited hobby projects, 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month, 300 build minutes
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month

### Which to Choose?
- **Easiest**: Vercel (best auto-detection)
- **Fastest**: Cloudflare Pages (global CDN)
- **Most Features**: Netlify (great for forms, functions)

**Recommendation: Start with Vercel** - works out of the box with Astro.

---

## 🐛 Troubleshooting

### Build Fails with "wix not found"
Your build script already uses `npx astro build` (via `build:astro`), so this won't happen on deployment platforms.

### API Routes Not Working
Make sure your deployment platform supports:
- **Server-Side Rendering (SSR)** - Vercel, Netlify, Cloudflare all support this
- Check `astro.config.mjs` has `output: 'server'` or `'hybrid'`

### Environment Variables Not Working
1. Make sure you added them in the platform's dashboard
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

---

## 🎉 Next Steps After Deployment

1. **Test All APIs**
   - Generate lesson plan
   - Generate scheme of work
   - Generate rubric
   - Parse documents

2. **Build Your Frontend**
   - Use the example component: `src/components/CBCDocumentGenerator.tsx`
   - Create UI pages for teachers
   - Add authentication if needed

3. **Add Database** (Optional)
   - Use Vercel Postgres, Supabase, or PlanetScale
   - Store parsed lesson plans
   - Save user-generated documents

4. **Monitor Usage**
   - Check OpenAI usage dashboard
   - Monitor API calls
   - Set up alerts

---

## 📞 Need Help?

**Documentation:**
- Full guide: `CBC_AI_GUIDE.md`
- Implementation: `CBC_IMPLEMENTATION_SUMMARY.md`
- Quick ref: `CBC_QUICK_REFERENCE.md`

**Platform Docs:**
- [Vercel with Astro](https://vercel.com/docs/frameworks/astro)
- [Netlify with Astro](https://docs.netlify.com/integrations/frameworks/astro/)
- [Cloudflare Pages with Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

---

## ⚡ TL;DR - Fastest Deploy

```bash
# 1. Commit your code
git add . && git commit -m "Deploy CBC AI" && git push

# 2. Go to vercel.com → Sign up → Import merkinei/my-repo

# 3. Add environment variable: OPENAI_API_KEY

# 4. Deploy! ✅
```

**Your CBC AI system will be live in 2 minutes!** 🚀

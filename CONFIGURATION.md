# Configuration Guide

How to customize Resume Interview Coach settings.

## 📝 Environment Variables

All configuration is in `~/midcareerswitcher/.env.local`

### Required Variables

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
DATABASE_URL=file:./dev.db
```

## 🤖 Changing OpenAI Models

### Available Models

Edit `OPENAI_MODEL` in `.env.local`:

#### GPT-4o (Default - Recommended)
```bash
OPENAI_MODEL=gpt-4o
```
- **Best for:** Most accurate evaluations and feedback
- **Cost:** ~$2.50 per 1M input tokens, ~$10 per 1M output tokens
- **Speed:** Fast
- **Quality:** Highest

#### GPT-4o-mini (Balanced)
```bash
OPENAI_MODEL=gpt-4o-mini
```
- **Best for:** Good quality at lower cost
- **Cost:** ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Speed:** Very fast
- **Quality:** Good

#### GPT-3.5-turbo (Budget)
```bash
OPENAI_MODEL=gpt-3.5-turbo
```
- **Best for:** Testing or high-volume usage
- **Cost:** ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens
- **Speed:** Very fast
- **Quality:** Adequate

### Cost Estimates Per Conversation

Typical usage (1 evaluation + 20 questions with 3 attempts each):

| Model | Estimated Cost |
|-------|----------------|
| gpt-4o | $0.50 - $1.00 |
| gpt-4o-mini | $0.03 - $0.06 |
| gpt-3.5-turbo | $0.01 - $0.02 |

**Note:** Costs vary based on resume length, job description length, and response length.

### Applying Model Changes

After editing `.env.local`:
1. Save the file
2. Restart the dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

## 🎙️ Changing ElevenLabs Voice

### Finding Voice IDs

1. Go to https://elevenlabs.io/app/voice-library
2. Browse available voices
3. Click on a voice to see its ID
4. Copy the Voice ID

### Popular Voices

Update `ELEVENLABS_VOICE_ID` in `.env.local`:

```bash
# Professional, clear female voice (default)
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Professional male voice (Adam)
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Young male voice (Antoni)
ELEVENLABS_VOICE_ID=ErXwobaYiN019PkySvjV

# British female voice (Bella)
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

### Custom Voice

If you've cloned your own voice:
1. Go to ElevenLabs dashboard
2. Find your custom voice
3. Copy the Voice ID
4. Update `.env.local`

## 💾 Database Configuration

### Default (SQLite)
```bash
DATABASE_URL=file:./dev.db
```
- Simple, file-based
- No setup required
- Perfect for local use

### Changing Database Location
```bash
# Different file location
DATABASE_URL=file:./data/conversations.db

# Or absolute path
DATABASE_URL=file:/home/chrisfkh/mydata/conversations.db
```

After changing, run:
```bash
npx prisma db push
```

### Resetting Database
To start fresh:
```bash
rm prisma/dev.db
npx prisma db push
```
**Warning:** This deletes all conversations!

## ⚙️ Advanced Configuration

### Changing Model Parameters

Edit `/home/chrisfkh/midcareerswitcher/lib/openai.ts` to adjust:

#### Temperature (Creativity)
```typescript
temperature: 0.7,  // Default
// 0.0 = Very deterministic
// 1.0 = Very creative
```

Lower temperature (0.3-0.5) for:
- More consistent evaluations
- More predictable feedback

Higher temperature (0.8-1.0) for:
- More creative questions
- More varied feedback

#### Max Tokens (Response Length)
```typescript
max_tokens: 1000,  // Optional, limits response length
```

### Customizing Prompts

All prompts are in `/lib/openai.ts`:

- `getInitialEvaluation()` - Initial resume evaluation
- `generateClarifyingQuestions()` - Clarifying questions
- `getFinalEvaluation()` - Final evaluation
- `generateInterviewQuestions()` - Interview questions
- `evaluateResponse()` - Response feedback

**Example:** Making evaluations more encouraging:

```typescript
// Add to the prompt:
"Be encouraging and highlight potential. Focus on growth opportunities."
```

### Changing Question Count

Edit `/lib/openai.ts` in `generateClarifyingQuestions()`:

```typescript
Generate no more than 5 questions.  // Change 5 to your desired number
```

Or in `generateInterviewQuestions()`:

```typescript
// Change from 5 to your desired number per category
1. HIRING_TYPICAL (5 questions): ...
```

## 🎨 UI Customization

### Colors

Edit `/app/globals.css` for theme colors:

```css
/* Primary color (buttons, links) */
.bg-blue-600 { /* Change blue to your color */ }

/* Success color (approved responses) */
.bg-green-600 { /* Change green to your color */ }
```

### Fonts

Edit `/app/layout.tsx` to change fonts:

```typescript
import { Inter } from "next/font/google";  // Replace Geist

const inter = Inter({
  subsets: ["latin"],
});
```

## 🔒 Security Settings

### API Key Security

**Never commit `.env.local` to Git!**

Verify `.gitignore` includes:
```
.env*
!.env.example
```

### Production Deployment

For production, use environment variables from your hosting platform:
- Vercel: Project Settings → Environment Variables
- AWS: AWS Systems Manager Parameter Store
- Docker: Use `--env-file` flag

## 📊 Logging and Debugging

### Enable Prisma Query Logging

Edit `/lib/prisma.ts`:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // More verbose
});
```

### Enable Next.js Debug Mode

```bash
NODE_OPTIONS='--inspect' npm run dev
```

### View API Logs

All API calls log to terminal. Watch for:
- Error messages
- API response times
- Database queries

## 🎯 Performance Tuning

### Reduce API Costs

1. **Use gpt-4o-mini** for most operations
2. **Cache TTS audio** (already implemented)
3. **Limit clarifying questions** to 3 instead of 5
4. **Use shorter prompts** where possible

### Speed Up Responses

1. Use **gpt-4o-mini** or **gpt-3.5-turbo**
2. Reduce temperature to 0.5
3. Set max_tokens limit

### Database Optimization

SQLite is already optimized for this use case. For high volume:
1. Switch to PostgreSQL
2. Add indexes to Prisma schema
3. Enable connection pooling

## 🔄 Backup and Restore

### Backup Database
```bash
cp prisma/dev.db prisma/dev.db.backup
```

### Restore Database
```bash
cp prisma/dev.db.backup prisma/dev.db
```

### Export Conversations

Use Prisma Studio to export:
```bash
npx prisma studio
```
Then export data as needed from the web interface.

## 🧪 Testing Configuration

After making changes:

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Test in browser:**
   - Create new conversation
   - Check terminal for errors
   - Verify API calls work

3. **Check costs:**
   - Monitor OpenAI dashboard
   - Monitor ElevenLabs dashboard

## 📝 Configuration Checklist

After changing settings:

- [ ] `.env.local` updated and saved
- [ ] Server restarted
- [ ] Browser refreshed
- [ ] Test conversation created
- [ ] No errors in terminal
- [ ] API calls working
- [ ] Audio playing correctly
- [ ] Database accessible

## 🆘 Configuration Issues

### Changes Not Taking Effect
- Restart dev server (Ctrl+C then `npm run dev`)
- Clear browser cache (Ctrl+Shift+Delete)
- Check `.env.local` syntax (no spaces around =)

### API Key Errors
- Verify keys are correct (no extra spaces)
- Check API account has credits
- Ensure `.env.local` is in project root

### Model Not Found
- Use exact model name from OpenAI
- Check model availability in your region
- Verify API access to that model

---

**Need help?** Check the terminal output for specific error messages.


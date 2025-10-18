# Usage Checklist

Quick reference for using Resume Interview Coach.

## 🏁 Before You Start

- [ ] Development server is running (`npm run dev`)
- [ ] Browser open to http://localhost:3000
- [ ] Microphone permissions granted
- [ ] Resume file ready (PDF or DOCX)
- [ ] Job description copied

## 📝 Creating a Conversation

- [ ] Click "New Conversation"
- [ ] Upload resume (drag & drop or click)
- [ ] Paste complete job description
- [ ] Click "Start Evaluation"

## 📊 Evaluation Phase

- [ ] Review initial score and feedback
- [ ] Read strengths and gaps carefully
- [ ] Decide: Answer clarifying questions OR skip to practice
- [ ] If answering: provide detailed, specific responses
- [ ] Submit and review final evaluation

## 🎤 Interview Practice

- [ ] Select question category
- [ ] Click speaker icon to hear question
- [ ] Click microphone to start recording
- [ ] Speak clearly (1-3 minutes)
- [ ] Click again to stop recording
- [ ] Wait for transcription and feedback
- [ ] Review feedback carefully
- [ ] Retry if not approved, or move to next question

## ✅ Quality Checks

### Good Recording Checklist:
- [ ] Quiet environment (no background noise)
- [ ] Clear speech (not too fast)
- [ ] Structured answer (STAR method for behavioral)
- [ ] Specific examples provided
- [ ] Addressed the question directly
- [ ] 1-3 minutes in length

### Good Clarifying Answer Checklist:
- [ ] Concrete examples given
- [ ] Quantified achievements (numbers, metrics)
- [ ] Explained transferable skills
- [ ] Mentioned specific tools/technologies
- [ ] Showed learning initiatives

## 🔍 Review History

- [ ] Click conversation card from home page
- [ ] Review evaluation scores
- [ ] Read all feedback
- [ ] Listen to approved responses as examples
- [ ] Identify patterns in weak areas

## ⚡ Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Mic not working | Check browser permissions (address bar) |
| Server not responding | Restart: Ctrl+C then `npm run dev` |
| Audio won't play | Check browser/system volume |
| Upload fails | Check file format (PDF/DOCX only) |
| API error | Verify keys in `.env.local` |
| Blank page | Check terminal for errors |

## 💾 Configuration Check

If something's not working, verify `.env.local` exists with:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
DATABASE_URL=file:./dev.db
```

## 🎯 Best Practices

- ✅ Complete evaluation before practicing
- ✅ Practice all 4 question categories
- ✅ Get "approved" on challenging questions
- ✅ Listen to your recordings
- ✅ Use specific examples
- ✅ Keep answers 1-3 minutes
- ✅ Review history before real interviews

## 🔄 Workflow Summary

```
1. Upload Resume + Job Description
   ↓
2. Get Initial Evaluation (score, strengths, gaps)
   ↓
3. Answer Clarifying Questions (optional)
   ↓
4. Get Final Evaluation
   ↓
5. Practice Interview Questions (20 total)
   ↓
6. Review History & Improve
```

## 📈 Scoring Guide

- **8-10** → Apply confidently
- **6-7** → Apply with some upskilling
- **1-5** → Gain more experience first

## 🎓 Question Categories

1. **Hiring Manager - Typical** → Technical/domain basics
2. **Hiring Manager - Challenging** → Deep technical/weaknesses
3. **HR - Typical** → Behavioral, culture fit
4. **HR - Challenging** → Address concerns/gaps

---

**Ready?** → http://localhost:3000 🚀


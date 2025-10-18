# Quick Start Guide

Welcome to Resume Interview Coach! This guide will help you get up and running quickly.

## ✅ Prerequisites Checklist

Before you begin, make sure you have:
- [x] Node.js 18+ installed
- [x] OpenAI API key
- [x] ElevenLabs API key
- [x] Development server running at http://localhost:3000

## 🚀 Starting the Application

### If the server is not running:

```bash
cd /home/chrisfkh/midcareerswitcher
npm run dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://10.255.255.254:3000

### To stop the server:

Press `Ctrl + C` in the terminal where the server is running.

## 📋 Step-by-Step Usage Guide

### 1. Home Page
When you first open http://localhost:3000, you'll see:
- Your conversation history (empty if first time)
- A "New Conversation" button

### 2. Create a New Conversation

**Click "New Conversation"** and you'll be taken to the upload page.

#### Upload Your Resume:
- **Supported formats:** PDF or DOCX only
- **Methods:** 
  - Drag and drop the file into the upload area
  - Click to browse and select a file
- The file will be automatically parsed

#### Paste Job Description:
- Copy the complete job description from the job posting
- Paste it into the text area
- Include as much detail as possible for better evaluation

**Click "Start Evaluation"** when ready.

### 3. Initial Evaluation

The AI will analyze your resume against the job description and provide:

- **Score (1-10):** Overall suitability rating
- **Strengths:** What makes you a good fit
- **Gaps:** Areas where you might be lacking

**What to do next:**

**Option A: Answer Clarifying Questions** (Recommended)
- Click "Answer Questions"
- You'll get up to 5 questions about:
  - Transferable skills from past experience
  - Recent training or certifications
  - Relevant projects not mentioned in resume
  - Other hidden qualifications
- Fill in your answers (be specific and detailed)
- Click "Submit Answers"

**Option B: Skip to Interview Practice**
- Click "Skip to Interview Practice"
- You'll proceed directly with the initial evaluation

### 4. Final Evaluation (if you answered questions)

After submitting your clarifying answers:
- **Updated Score:** May improve based on new information
- **Final Summary:** Comprehensive assessment
- **Updated Strengths:** Including newly discovered skills
- **Remaining Gaps:** What still needs work

**Click "Proceed to Interview Practice →"**

### 5. Interview Practice

#### Select a Question Category:

Four categories are available:
1. **Hiring Manager - Typical** (5 questions)
   - Standard technical/domain questions
   
2. **Hiring Manager - Challenging** (5 questions)
   - Difficult questions targeting your weak areas
   
3. **HR - Typical** (5 questions)
   - Behavioral, cultural fit, motivation questions
   
4. **HR - Challenging** (5 questions)
   - Probing questions addressing gaps or concerns

#### Practice Flow:

For each question:

1. **Listen to the Question**
   - Click the speaker icon 🔊 to hear the question
   - Powered by ElevenLabs text-to-speech

2. **Record Your Answer**
   - Click the microphone button 🎤 to start recording
   - Speak your answer clearly
   - Click again to stop recording
   - **Note:** Grant microphone permissions when prompted by your browser

3. **Wait for Processing**
   - Audio is transcribed (OpenAI Whisper)
   - AI evaluates your response

4. **Review Feedback**
   - See your transcribed response
   - Read AI feedback and suggestions
   - Check if response is "Approved ✓"

5. **Retry or Continue**
   - **If not approved:** Record again with improvements
   - **If approved or satisfied:** Click "Next →"

6. **Navigate Questions**
   - Use "← Previous" and "Next →" buttons
   - Complete all questions in the category

7. **Finish Category**
   - Click "Complete Category" on the last question
   - Choose another category or view history

### 6. View Full History

Click "View Full History" or click any conversation card from the home page.

**You can see:**
- Resume and job description used
- Initial evaluation results
- Clarifying questions and your answers
- Final evaluation results
- All interview questions organized by category
- All your practice attempts with:
  - Timestamp
  - Audio playback 🔊
  - Transcription
  - AI feedback
  - Approval status

**Navigate:**
- Click "Continue Practice" to add more attempts
- Click "Back to Home" to see all conversations

## 🎯 Tips for Best Results

### Resume Upload
- Use a well-formatted resume (clear sections, bullet points)
- Ensure text is readable (avoid image-only PDFs)
- Include relevant keywords from the job description

### Job Description
- Paste the complete job posting
- Include responsibilities, requirements, and nice-to-haves
- More detail = better evaluation

### Clarifying Questions
- Be specific and provide concrete examples
- Mention certifications, courses, or self-study
- Explain transferable skills with context
- Don't just say "yes" - elaborate!

### Voice Recording
- **Environment:** Record in a quiet space
- **Distance:** Speak 6-12 inches from microphone
- **Pace:** Speak clearly at a normal pace (not too fast)
- **Structure:** Use the STAR method for behavioral questions:
  - **S**ituation
  - **T**ask
  - **A**ction
  - **R**esult
- **Length:** Aim for 1-3 minutes per answer
- **Practice:** Don't worry about perfection - that's what practice is for!

### Getting Better Feedback
- Listen to your recording before reviewing feedback
- Compare "approved" responses to earlier attempts
- Focus on specific improvements suggested by AI
- Practice the same question multiple times to see progress

## 🔧 Troubleshooting

### Microphone Not Working
1. Check browser permissions (usually in address bar)
2. Make sure no other app is using the microphone
3. Try refreshing the page
4. Test microphone in system settings

### Audio Not Playing
1. Check browser audio permissions
2. Check system volume
3. Try a different browser

### Server Not Responding
1. Check if dev server is running in terminal
2. Look for error messages in terminal
3. Restart the server:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

### API Errors
1. Verify API keys in `.env.local`
2. Check OpenAI account has credits
3. Check ElevenLabs account has credits
4. Look at terminal logs for specific errors

### File Upload Issues
- Ensure file is PDF or DOCX (not .doc)
- Check file size (< 10MB recommended)
- Make sure file is not password-protected
- Try a different file

### Database Issues
If you need to reset everything:
```bash
cd /home/chrisfkh/midcareerswitcher
rm prisma/dev.db
npx prisma db push
```
**Warning:** This deletes all conversations!

## 📊 Understanding Your Scores

### Score Ranges:
- **8-10 (Green):** Strong candidate - ready to apply
- **6-7 (Yellow):** Good potential - some upskilling recommended
- **1-5 (Red):** Significant gaps - consider gaining more experience

### What Affects Your Score:
- Matching skills and experience
- Years of experience vs. requirements
- Education and certifications
- Relevant projects and achievements
- Cultural fit indicators
- Transferable skills

### Improving Your Score:
1. Answer clarifying questions thoroughly
2. Update resume with missing information
3. Gain specific skills mentioned in gaps
4. Get relevant certifications
5. Work on personal projects demonstrating required skills

## 🎓 Interview Practice Strategy

### Recommended Approach:

1. **Start with Typical Questions** (both HR and Hiring Manager)
   - Build confidence
   - Get comfortable with the interface
   - Practice basic articulation

2. **Move to Challenging Questions**
   - Address your specific weaknesses
   - Practice difficult scenarios
   - Refine responses based on AI feedback

3. **Iterate on Weak Answers**
   - Don't move on until you get approval
   - Review feedback carefully
   - Try different approaches

4. **Review Your History**
   - Listen to earlier vs. later attempts
   - Note improvement patterns
   - Identify remaining weak points

### Time Investment:
- **Quick Session:** 30 minutes (5 questions)
- **Thorough Session:** 1-2 hours (complete evaluation + 1 category)
- **Full Preparation:** 3-4 hours (evaluation + all 20 questions)

## 🔄 Managing Multiple Applications

Each conversation is saved independently, so you can:
- Upload the same resume with different job descriptions
- Compare scores across different roles
- Track which roles are the best fit
- Practice different interview styles

## 📱 Browser Compatibility

**Recommended browsers:**
- ✅ Chrome (best support)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (may have audio issues)

**Required features:**
- JavaScript enabled
- Microphone access
- Modern browser (2020+)

## 💡 Pro Tips

1. **Save job descriptions:** Keep the full text before applying
2. **Multiple attempts:** Don't settle for first response
3. **Real interviews:** Practice with someone after AI approval
4. **Track progress:** Note score improvements over time
5. **Resume updates:** Update your resume based on gap analysis
6. **Voice warm-up:** Do vocal exercises before recording
7. **Review patterns:** Look for common weak points across questions
8. **Use examples:** Always back up claims with specific examples

## 🎉 You're Ready!

Open http://localhost:3000 in your browser and start your first conversation!

Remember: This is a practice tool. The more you use it, the better you'll get at both articulating your experience and interviewing in general.

Good luck with your job search! 🚀

---

## Need Help?

- Check the main README.md for technical details
- Review terminal output for error messages
- Ensure all API keys are correctly set in `.env.local`


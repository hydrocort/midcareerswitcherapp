import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

export interface InitialEvaluation {
  score: number;
  strengths: string[];
  gaps: string[];
  summary: string;
}

export interface ClarifyingQuestion {
  id: number;
  question: string;
}

export interface FinalEvaluation {
  score: number;
  summary: string;
  strengths: string[];
  remainingGaps: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'HIRING_TYPICAL' | 'HIRING_CHALLENGING' | 'HR_TYPICAL' | 'HR_CHALLENGING';
  question: string;
}

export async function getInitialEvaluation(
  resumeText: string,
  jobDescription: string
): Promise<InitialEvaluation> {
  const prompt = `You are an expert career coach and hiring consultant. Analyze the following resume against the job description and provide a detailed evaluation.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a JSON response with the following structure:
{
  "score": <number between 1-10>,
  "strengths": [<array of specific strengths matching the role>],
  "gaps": [<array of specific gaps or missing qualifications>],
  "summary": "<brief 2-3 sentence overall assessment>"
}

Be specific and constructive. Focus on transferable skills, relevant experience, and concrete gaps.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export async function generateClarifyingQuestions(
  resumeText: string,
  jobDescription: string,
  gaps: string[]
): Promise<ClarifyingQuestion[]> {
  const prompt = `You are an expert career coach. Based on the identified gaps between the candidate's resume and the job requirements, generate up to 5 clarifying questions to uncover hidden transferable skills, relevant experience, or recent upskilling efforts.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

IDENTIFIED GAPS:
${gaps.join('\n')}

Generate questions that might reveal:
- Transferable skills from past experiences
- Recent training, courses, or certifications
- Relevant projects or side work not mentioned in resume
- Soft skills or domain knowledge gained informally

Provide a JSON response with the following structure:
{
  "questions": [
    {"id": 1, "question": "<question text>"},
    {"id": 2, "question": "<question text>"},
    ...
  ]
}

Generate no more than 5 questions.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const result = JSON.parse(content);
  return result.questions || [];
}

export async function getFinalEvaluation(
  resumeText: string,
  jobDescription: string,
  initialEvaluation: InitialEvaluation,
  clarifyingAnswers: { question: string; answer: string }[]
): Promise<FinalEvaluation> {
  const prompt = `You are an expert career coach. Based on the initial evaluation and the candidate's clarifying answers, provide a final assessment of their suitability for the role.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INITIAL EVALUATION:
Score: ${initialEvaluation.score}/10
Strengths: ${initialEvaluation.strengths.join(', ')}
Gaps: ${initialEvaluation.gaps.join(', ')}

CLARIFYING Q&A:
${clarifyingAnswers.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}

Based on the additional information, provide an updated evaluation in JSON format:
{
  "score": <updated score between 1-10>,
  "summary": "<comprehensive final assessment 3-4 sentences>",
  "strengths": [<updated list of strengths including newly discovered ones>],
  "remainingGaps": [<gaps that still exist after considering clarifying answers>]
}

Be fair and thorough. Give credit for transferable skills and upskilling efforts.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export async function generateInterviewQuestions(
  resumeText: string,
  jobDescription: string,
  finalEvaluation: FinalEvaluation
): Promise<InterviewQuestion[]> {
  const prompt = `You are an expert interviewer for both hiring managers and HR professionals. Generate 20 interview questions (5 in each category) based on the job role and candidate evaluation.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE EVALUATION:
Score: ${finalEvaluation.score}/10
Strengths: ${finalEvaluation.strengths.join(', ')}
Remaining Gaps: ${finalEvaluation.remainingGaps.join(', ')}

Generate exactly 20 questions in 4 categories:

1. HIRING_TYPICAL (5 questions): Standard technical/domain questions a hiring manager would ask
2. HIRING_CHALLENGING (5 questions): Difficult technical questions targeting the candidate's weak areas
3. HR_TYPICAL (5 questions): Standard HR questions (behavioral, cultural fit, motivation)
4. HR_CHALLENGING (5 questions): Probing HR questions addressing gaps or concerns

Provide a JSON response:
{
  "questions": [
    {"id": "1", "category": "HIRING_TYPICAL", "question": "<question>"},
    {"id": "2", "category": "HIRING_TYPICAL", "question": "<question>"},
    ...
  ]
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const result = JSON.parse(content);
  return result.questions || [];
}

export async function evaluateResponse(
  question: string,
  transcription: string,
  jobDescription: string,
  resumeText: string
): Promise<{ feedback: string; isApproved: boolean }> {
  const prompt = `You are an expert interview coach. Evaluate the candidate's response to the interview question.

INTERVIEW QUESTION:
${question}

CANDIDATE'S RESPONSE:
${transcription}

JOB DESCRIPTION (for context):
${jobDescription}

Provide constructive feedback in JSON format:
{
  "feedback": "<detailed feedback on the response: what was good, what could be improved, specific suggestions>",
  "isApproved": <true if response is strong and ready, false if needs improvement>
}

Be encouraging but honest. Provide specific, actionable suggestions for improvement.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const file = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });

  return transcription.text;
}


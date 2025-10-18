'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import EvaluationDisplay from '@/app/components/EvaluationDisplay';

interface Conversation {
  id: string;
  createdAt: string;
  resumeText: string;
  resumeFileName: string;
  jobDescription: string;
  initialEvaluation: string | null;
  finalEvaluation: string | null;
  clarifyingQuestions: any[];
  clarifyingAnswers: any[];
  questions: Question[];
}

interface Question {
  id: string;
  category: string;
  questionText: string;
  attempts: Attempt[];
}

interface Attempt {
  id: string;
  transcription: string;
  feedback: string;
  isApproved: boolean;
  createdAt: string;
  audioPath: string;
}

const CATEGORY_LABELS = {
  HIRING_TYPICAL: 'Hiring Manager - Typical',
  HIRING_CHALLENGING: 'Hiring Manager - Challenging',
  HR_TYPICAL: 'HR - Typical',
  HR_CHALLENGING: 'HR - Challenging',
};

export default function HistoryPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();
      setConversation(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading conversation history..." />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Conversation not found</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const initialEvaluation = conversation.initialEvaluation
    ? JSON.parse(conversation.initialEvaluation)
    : null;
  const finalEvaluation = conversation.finalEvaluation
    ? JSON.parse(conversation.finalEvaluation)
    : null;

  const date = new Date(conversation.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Conversation History</h1>
          <p className="mt-2 text-gray-600">{date}</p>
        </div>

        <div className="space-y-8">
          {/* Resume & Job Description */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {conversation.resumeFileName}
              </p>
              <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-md">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {conversation.resumeText}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {conversation.jobDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Evaluations */}
          {initialEvaluation && (
            <EvaluationDisplay
              title="Initial Evaluation"
              score={initialEvaluation.score}
              strengths={initialEvaluation.strengths}
              gaps={initialEvaluation.gaps}
              summary={initialEvaluation.summary}
            />
          )}

          {/* Clarifying Q&A */}
          {conversation.clarifyingAnswers && conversation.clarifyingAnswers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Clarifying Questions & Answers
              </h2>
              <div className="space-y-4">
                {conversation.clarifyingAnswers.map((qa: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900 mb-2">
                      Q: {qa.question}
                    </p>
                    <p className="text-gray-700">A: {qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {finalEvaluation && (
            <EvaluationDisplay
              title="Final Evaluation"
              score={finalEvaluation.score}
              strengths={finalEvaluation.strengths}
              gaps={finalEvaluation.remainingGaps}
              summary={finalEvaluation.summary}
            />
          )}

          {/* Interview Practice */}
          {conversation.questions && conversation.questions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Interview Practice
                </h2>
                <button
                  onClick={() => router.push(`/conversation/${conversationId}/practice`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Continue Practice
                </button>
              </div>

              {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
                const categoryQuestions = conversation.questions.filter(
                  (q) => q.category === category
                );

                if (categoryQuestions.length === 0) return null;

                return (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {label}
                    </h3>
                    <div className="space-y-4">
                      {categoryQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <p className="font-medium text-gray-900 mb-3">
                            {question.questionText}
                          </p>

                          {question.attempts && question.attempts.length > 0 ? (
                            <div className="space-y-3">
                              {question.attempts.map((attempt) => (
                                <div
                                  key={attempt.id}
                                  className={`p-3 rounded-md ${
                                    attempt.isApproved
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs text-gray-500">
                                      {new Date(attempt.createdAt).toLocaleString()}
                                    </span>
                                    {attempt.isApproved && (
                                      <span className="text-xs font-semibold text-green-700">
                                        ✓ Approved
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong>Response:</strong> {attempt.transcription}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Feedback:</strong> {attempt.feedback}
                                  </p>
                                  <audio
                                    controls
                                    className="mt-2 w-full"
                                    src={attempt.audioPath}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              No attempts yet
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


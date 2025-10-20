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
  const [deletingAttemptId, setDeletingAttemptId] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showJobDescModal, setShowJobDescModal] = useState(false);

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

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }

    setDeletingAttemptId(attemptId);
    try {
      const response = await fetch(`/api/attempts/${attemptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete attempt');
      }

      // Reload conversation to reflect the deletion
      await loadConversation();
    } catch (error) {
      console.error('Error deleting attempt:', error);
      alert('Failed to delete recording. Please try again.');
    } finally {
      setDeletingAttemptId(null);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Conversation History</h1>
              <p className="mt-2 text-gray-600">{date}</p>
            </div>
            {!finalEvaluation && (
              <button
                onClick={() => router.push(`/conversation/${conversationId}/evaluation`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Continue Evaluation
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Resume & Job Description */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">Resume</h2>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {conversation.resumeFileName}
                  </p>
                </div>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Expand resume"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-md">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {conversation.resumeText}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
                <button
                  onClick={() => setShowJobDescModal(true)}
                  className="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Expand job description"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
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
                                    <div className="flex items-center gap-2">
                                      {attempt.isApproved && (
                                        <span className="text-xs font-semibold text-green-700">
                                          ✓ Approved
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleDeleteAttempt(attempt.id)}
                                        disabled={deletingAttemptId === attempt.id}
                                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                        title="Delete recording"
                                      >
                                        {deletingAttemptId === attempt.id ? (
                                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        ) : (
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
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

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Resume</h2>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  {conversation.resumeFileName}
                </p>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {conversation.resumeText}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Modal */}
      {showJobDescModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
              <button
                onClick={() => setShowJobDescModal(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {conversation.jobDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


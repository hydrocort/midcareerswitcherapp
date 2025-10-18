'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VoiceRecorder from '@/app/components/VoiceRecorder';
import LoadingSpinner from '@/app/components/LoadingSpinner';

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
}

const CATEGORY_LABELS = {
  HIRING_TYPICAL: 'Hiring Manager - Typical',
  HIRING_CHALLENGING: 'Hiring Manager - Challenging',
  HR_TYPICAL: 'HR - Typical',
  HR_CHALLENGING: 'HR - Challenging',
};

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [conversationId]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();

      if (!data.questions || data.questions.length === 0) {
        // Generate questions if not exists
        await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId }),
        });

        // Reload conversation
        const reloadResponse = await fetch(`/api/conversations/${conversationId}`);
        const reloadData = await reloadResponse.json();
        setQuestions(reloadData.questions);
      } else {
        setQuestions(data.questions);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const filteredQuestions = selectedCategory
    ? questions.filter((q) => q.category === selectedCategory)
    : [];

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const playQuestion = async () => {
    if (!currentQuestion) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentQuestion.questionText,
          questionId: currentQuestion.id,
          conversationId,
        }),
      });

      const data = await response.json();
      setAudioUrl(data.audioUrl);

      const audio = new Audio(data.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (error) {
      console.error('Error playing question:', error);
      setIsPlaying(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setProcessing(true);
    setCurrentAttempt(null);

    try {
      // Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('questionId', currentQuestion.id);
      formData.append('conversationId', conversationId);

      const sttResponse = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const { transcription, audioPath } = await sttResponse.json();

      // Get feedback
      const feedbackResponse = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          transcription,
          audioPath,
        }),
      });

      const { attempt } = await feedbackResponse.json();
      setCurrentAttempt(attempt);

      // Reload questions to update attempts
      await loadQuestions();
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAttempt(null);
      setAudioUrl(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAttempt(null);
      setAudioUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading interview questions..." />
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
            <p className="mt-2 text-gray-600">
              Select a category of questions to practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
              const count = questions.filter((q) => q.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentQuestionIndex(0);
                  }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-blue-500"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {label}
                  </h3>
                  <p className="text-gray-600">{count} questions</p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => router.push(`/conversation/${conversationId}/history`)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentQuestionIndex(0);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center"
            >
              ← Back to Categories
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
            </h1>
            <p className="mt-2 text-gray-600">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex-1">
                {currentQuestion?.questionText}
              </h2>
              <button
                onClick={playQuestion}
                disabled={isPlaying}
                className="ml-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                </svg>
              </button>
            </div>

            {processing ? (
              <LoadingSpinner message="Processing your response..." />
            ) : (
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            )}
          </div>

          {/* Feedback Card */}
          {currentAttempt && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Feedback</h3>
                {currentAttempt.isApproved && (
                  <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    Approved ✓
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Your Response:
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {currentAttempt.transcription}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  AI Feedback:
                </h4>
                <p className="text-gray-700">{currentAttempt.feedback}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentQuestionIndex === filteredQuestions.length - 1 ? (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentQuestionIndex(0);
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Complete Category
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


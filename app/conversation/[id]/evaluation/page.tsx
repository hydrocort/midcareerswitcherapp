'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EvaluationDisplay from '@/app/components/EvaluationDisplay';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface ClarifyingQuestion {
  id: number;
  question: string;
}

export default function EvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [initialEvaluation, setInitialEvaluation] = useState<any>(null);
  const [finalEvaluation, setFinalEvaluation] = useState<any>(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showClarifying, setShowClarifying] = useState(false);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();

      if (data.initialEvaluation) {
        setInitialEvaluation(JSON.parse(data.initialEvaluation));
        setClarifyingQuestions(data.clarifyingQuestions || []);
        
        if (data.finalEvaluation) {
          setFinalEvaluation(JSON.parse(data.finalEvaluation));
        }
      } else {
        // Need to run initial evaluation
        runInitialEvaluation();
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setLoading(false);
    }
  };

  const runInitialEvaluation = async () => {
    setEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });

      const data = await response.json();
      setInitialEvaluation(data.evaluation);
      setClarifyingQuestions(data.questions);
      setLoading(false);
      setEvaluating(false);
    } catch (error) {
      console.error('Error evaluating:', error);
      setEvaluating(false);
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async () => {
    setEvaluating(true);
    try {
      const formattedAnswers = clarifyingQuestions.map((q) => ({
        question: q.question,
        answer: answers[q.id] || '',
      }));

      const response = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          answers: formattedAnswers,
        }),
      });

      const data = await response.json();
      setFinalEvaluation(data.finalEvaluation);
      setShowClarifying(false);
      setEvaluating(false);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setEvaluating(false);
    }
  };

  const handleProceedToQuestions = async () => {
    setLoading(true);
    try {
      await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });

      router.push(`/conversation/${conversationId}/practice`);
    } catch (error) {
      console.error('Error generating questions:', error);
      setLoading(false);
    }
  };

  if (loading || evaluating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner
          message={
            evaluating
              ? 'Analyzing your resume...'
              : 'Loading evaluation...'
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Evaluation Results</h1>
          <p className="mt-2 text-gray-600">
            Review your resume evaluation and answer clarifying questions
          </p>
        </div>

        <div className="space-y-8">
          {initialEvaluation && (
            <EvaluationDisplay
              title="Initial Evaluation"
              score={initialEvaluation.score}
              strengths={initialEvaluation.strengths}
              gaps={initialEvaluation.gaps}
              summary={initialEvaluation.summary}
            />
          )}

          {!finalEvaluation && !showClarifying && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                Would you like to answer some clarifying questions to improve your evaluation?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClarifying(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Answer Questions
                </button>
                <button
                  onClick={handleProceedToQuestions}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip to Interview Practice
                </button>
              </div>
            </div>
          )}

          {showClarifying && !finalEvaluation && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Clarifying Questions
              </h2>
              <p className="text-gray-600 mb-6">
                These questions help us better understand your background and identify transferable skills.
              </p>
              <div className="space-y-6">
                {clarifyingQuestions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {q.question}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Your answer..."
                      value={answers[q.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [q.id]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowClarifying(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAnswers}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Submit Answers
                </button>
              </div>
            </div>
          )}

          {finalEvaluation && (
            <>
              <EvaluationDisplay
                title="Final Evaluation"
                score={finalEvaluation.score}
                strengths={finalEvaluation.strengths}
                gaps={finalEvaluation.remainingGaps}
                summary={finalEvaluation.summary}
              />

              <div className="flex justify-end">
                <button
                  onClick={handleProceedToQuestions}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors text-lg"
                >
                  Proceed to Interview Practice →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


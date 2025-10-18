'use client';

interface EvaluationDisplayProps {
  score: number;
  strengths: string[];
  gaps?: string[];
  summary: string;
  title: string;
}

export default function EvaluationDisplay({
  score,
  strengths,
  gaps,
  summary,
  title,
}: EvaluationDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div
          className={`${getScoreBackground(
            score
          )} px-4 py-2 rounded-full flex items-center space-x-2`}
        >
          <span className="text-sm font-medium text-gray-700">Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/10
          </span>
        </div>
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-700">{summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-700 bg-green-50 p-3 rounded-md"
              >
                <span className="text-green-600 mr-2">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {gaps && gaps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {gaps.map((gap, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-700 bg-orange-50 p-3 rounded-md"
                >
                  <span className="text-orange-600 mr-2">•</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


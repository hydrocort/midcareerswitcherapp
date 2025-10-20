'use client';

import Link from 'next/link';

interface ConversationCardProps {
  id: string;
  createdAt: string;
  resumeFileName: string;
  jobDescription: string;
  initialScore: number | null;
  finalScore: number | null;
}

export default function ConversationCard({
  id,
  createdAt,
  resumeFileName,
  jobDescription,
  initialScore,
  finalScore,
}: ConversationCardProps) {
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusBadge = () => {
    if (finalScore !== null) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Completed
        </span>
      );
    } else if (initialScore !== null) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          New
        </span>
      );
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Route to evaluation page if not completed, otherwise history
  const getRoute = () => {
    if (finalScore !== null) {
      return `/conversation/${id}/history`;
    }
    return `/conversation/${id}/evaluation`;
  };

  return (
    <Link href={getRoute()}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {resumeFileName}
            </h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge()}
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {truncateText(jobDescription, 250)}
        </p>

        <div className="flex items-center space-x-4 text-sm">
          {initialScore !== null && (
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">Initial:</span>
              <span className="font-semibold text-blue-600">{initialScore}/10</span>
            </div>
          )}
          {finalScore !== null && (
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">Final:</span>
              <span className="font-semibold text-green-600">{finalScore}/10</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


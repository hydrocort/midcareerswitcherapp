'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ConversationCard from './components/ConversationCard';
import LoadingSpinner from './components/LoadingSpinner';

interface Conversation {
  id: string;
  createdAt: string;
  resumeFileName: string;
  jobDescription: string;
  initialScore: number | null;
  finalScore: number | null;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Resume Interview Coach
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              AI-powered resume evaluation and interview practice
            </p>
          </div>
          <Link href="/conversation/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New Conversation</span>
            </button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading conversations..." />
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No conversations yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating a new conversation
            </p>
            <Link href="/conversation/new">
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors">
                Create Your First Conversation
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {conversations.map((conversation) => (
              <ConversationCard key={conversation.id} {...conversation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

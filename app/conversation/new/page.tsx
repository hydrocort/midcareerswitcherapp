'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function NewConversation() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload and parse resume
      const formData = new FormData();
      formData.append('file', resumeFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const { text: resumeText, fileName: resumeFileName } = await uploadResponse.json();

      // Create conversation
      const conversationResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          resumeFileName,
          jobDescription,
        }),
      });

      if (!conversationResponse.ok) {
        throw new Error('Failed to create conversation');
      }

      const conversation = await conversationResponse.json();

      // Redirect to evaluation page
      router.push(`/conversation/${conversation.id}/evaluation`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            New Conversation
          </h1>
          <p className="mt-2 text-gray-600">
            Upload your resume and provide the job description to get started
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Creating your conversation..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Upload Your Resume
              </label>
              <FileUpload
                onFileSelect={setResumeFile}
                disabled={loading}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <label
                htmlFor="jobDescription"
                className="block text-lg font-semibold text-gray-900 mb-4"
              >
                Job Description
              </label>
              <textarea
                id="jobDescription"
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !resumeFile || !jobDescription.trim()}
              >
                Start Evaluation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


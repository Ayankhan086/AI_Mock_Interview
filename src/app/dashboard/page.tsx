"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/interviews')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data.interviews) {
          setInterviews(data.interviews);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error && error !== 'Unauthorized') return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-[calc(100vh-160px)] p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Your <span className="text-[var(--color-primary)]">Dashboard</span></h1>
        <Link href="/interview/setup" className="btn-primary px-6 py-3 rounded-xl">
          + New Interview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-sm p-10 text-center rounded-2xl text-gray-500">
            <p className="text-xl mb-4">No interviews yet.</p>
            <Link href="/interview/setup" className="text-[var(--color-primary)] font-medium hover:underline">Start your first mock interview now</Link>
          </div>
        ) : (
          interviews.map((interview: any) => (
            <div key={interview.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 rounded-2xl flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-[var(--color-primary)] px-3 py-1 rounded text-sm font-medium">{interview.interviewType}</span>
                <span className="text-xs text-gray-400 font-medium">{new Date(interview.startedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 mb-6 flex-grow font-medium">
                Status: <span className="capitalize">{interview.status}</span>
              </p>
              {interview.reports && interview.reports.length > 0 ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Score</p>
                  <p className="text-2xl font-bold text-gray-900">{interview.reports[0].overallScore}<span className="text-sm text-gray-400 font-normal">/100</span></p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">No report generated</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Your <span className="text-[var(--color-gold)]">Dashboard</span></h1>
        <Link href="/interview/setup" className="btn-gold px-6 py-3 rounded-xl">
          + New Interview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length === 0 ? (
          <div className="col-span-full glass-panel p-10 text-center rounded-2xl text-gray-400">
            <p className="text-xl mb-4">No interviews yet.</p>
            <Link href="/interview/setup" className="text-[var(--color-gold)] hover:underline">Start your first mock interview now</Link>
          </div>
        ) : (
          interviews.map((interview: any) => (
            <div key={interview.id} className="glass-panel p-6 rounded-2xl flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/10 px-3 py-1 rounded text-sm text-[var(--color-gold-light)]">{interview.interviewType}</span>
                <span className="text-xs text-gray-500">{new Date(interview.startedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300 mb-6 flex-grow">
                Status: {interview.status}
              </p>
              {interview.reports && interview.reports.length > 0 ? (
                <div className="mt-4 p-4 bg-black/30 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Score</p>
                  <p className="text-2xl font-bold text-white">{interview.reports[0].overallScore}/100</p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-black/30 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No report generated</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewSetup() {
  const router = useRouter();
  const [interviewType, setInterviewType] = useState('Behavioral');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewType })
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/interview/${data.interview.id}`);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-gray-100 shadow-md p-10 rounded-3xl w-full max-w-lg z-10 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Select Interview Type</h2>
        
        <div className="flex flex-col gap-4 mb-10 text-left">
          {['Behavioral', 'Technical', 'System Design', 'HR / Culture Fit'].map((type) => (
            <label key={type} className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${interviewType === type ? 'border-[var(--color-primary)] bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <input 
                type="radio" 
                name="type" 
                value={type} 
                checked={interviewType === type}
                onChange={() => setInterviewType(type)}
                className="w-5 h-5 accent-[var(--color-primary)]"
              />
              <span className="text-lg text-gray-800 font-medium">{type}</span>
            </label>
          ))}
        </div>
        
        <button onClick={handleStart} disabled={loading} className="btn-primary w-full p-4 rounded-xl text-lg shadow-sm">
          {loading ? 'Initializing AI...' : 'Start Session'}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    jobRole: '',
    experienceLevel: 'Junior',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-gold)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input type="text" required className="input-field w-full p-3 rounded-xl"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" required className="input-field w-full p-3 rounded-xl"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" required className="input-field w-full p-3 rounded-xl"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Target Job Role</label>
            <input type="text" placeholder="e.g. Frontend Developer" required className="input-field w-full p-3 rounded-xl"
              value={formData.jobRole} onChange={e => setFormData({...formData, jobRole: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Experience Level</label>
            <select className="input-field w-full p-3 rounded-xl appearance-none"
              value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="btn-gold p-4 rounded-xl mt-4">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-[var(--color-gold)] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

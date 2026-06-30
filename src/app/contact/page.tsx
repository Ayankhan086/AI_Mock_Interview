"use client";

import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Get in touch</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Have questions about MockAI? Interested in enterprise pricing or university partnerships? We'd love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-600">support@mockai.example.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Office</h3>
                <p className="text-gray-600">123 Innovation Drive<br />San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-8 text-[var(--color-primary)] font-medium hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" required className="input-field w-full p-3 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" required className="input-field w-full p-3 rounded-xl" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="input-field w-full p-3 rounded-xl" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={5} className="input-field w-full p-3 rounded-xl resize-none"></textarea>
              </div>
              
              <button type="submit" className="btn-primary p-4 rounded-xl mt-2 text-lg font-medium">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

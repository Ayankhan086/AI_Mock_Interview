import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          No hidden fees. Choose the plan that fits your interview timeline.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
            <p className="text-gray-500 mb-6">Perfect for trying out the platform.</p>
            <div className="text-5xl font-extrabold text-gray-900 mb-6">$0<span className="text-xl font-medium text-gray-400">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                3 Mock Interviews per month
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Basic AI Feedback
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                No Custom Resumes
              </li>
            </ul>
            <Link href="/register" className="w-full py-4 rounded-xl text-center font-medium border-2 border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-[var(--color-primary)] rounded-3xl p-8 shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-500 mb-6">For serious job seekers preparing for big loops.</p>
            <div className="text-5xl font-extrabold text-gray-900 mb-6">$29<span className="text-xl font-medium text-gray-400">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Unlimited Mock Interviews
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Advanced Analytical Reports
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Custom Resume Uploads
              </li>
            </ul>
            <Link href="/register" className="w-full py-4 rounded-xl text-center font-medium btn-primary">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coaching</h3>
            <p className="text-gray-500 mb-6">For universities and career coaching firms.</p>
            <div className="text-5xl font-extrabold text-gray-900 mb-6">$99<span className="text-xl font-medium text-gray-400">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Multiple User Accounts
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                White-label Reports
              </li>
            </ul>
            <Link href="/contact" className="w-full py-4 rounded-xl text-center font-medium border-2 border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

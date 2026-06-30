import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-32 text-center lg:pt-32 lg:pb-40">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Ace your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-500">Voice AI</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
          Experience highly realistic, dynamic voice interviews. No scripts, no text chat—just you and an expert AI interviewer adapting to your every word.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-lg font-medium w-full sm:w-auto text-center shadow-lg shadow-indigo-500/20">
            Start Practicing Free
          </Link>
          <Link href="/features" className="px-8 py-4 rounded-xl text-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all w-full sm:w-auto text-center shadow-sm">
            How it works
          </Link>
        </div>
        
        <div className="mt-16 flex items-center justify-center gap-4 text-sm text-gray-500 font-medium">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p>Join 10,000+ candidates landing top jobs</p>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="w-full border-y border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-8">Trusted by candidates hired at</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {['Google', 'Microsoft', 'Meta', 'Amazon', 'Apple'].map((company) => (
              <span key={company} className="text-xl font-bold text-gray-700">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why MockAI?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Standard question banks don't prepare you for the pressure of a real conversation. Our AI does.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Voice",
              desc: "Talk naturally. The AI listens, pauses when you pause, and responds via voice with zero latency.",
              icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            },
            {
              title: "Dynamic Follow-ups",
              desc: "Give a vague answer? The AI will push back and ask you to elaborate, just like a real hiring manager.",
              icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            },
            {
              title: "Actionable Feedback",
              desc: "Get a detailed markdown report immediately after your interview highlighting strengths and areas to improve.",
              icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

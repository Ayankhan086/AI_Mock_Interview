import Link from 'next/link';

export default function Features() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Platform Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Everything you need to confidently walk into your next interview.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-24 grid gap-24">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center group">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors">Zero-Latency Voice</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Using the browser's native Web Speech API, MockAI listens to you in real-time. When you finish speaking, the AI responds instantly. There are no text boxes to type in during the interview—it is a 100% voice-driven experience designed to simulate a real video call.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-3xl p-8 aspect-video flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              🎙️
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center group">
          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-3xl p-8 aspect-video flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              🧠
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors">Dynamic Follow-ups</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Static lists of questions are useless if you don't know how to handle follow-ups. Our LangGraph-powered conversational engine evaluates your answer contextually. If you use the STAR method well, it might ask you to expand on a specific metric. If you give a vague answer, it will push back.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center group">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors">Actionable Analytics</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At the end of every session, MockAI generates a comprehensive markdown report. You get an overall score, a breakdown of what you did well, and specific, actionable feedback on areas where your answers fell short.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-3xl p-8 aspect-video flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              📊
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-indigo-50 py-24 text-center mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to ace your next interview?</h2>
        <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-lg font-medium inline-block shadow-md">
          Start Practicing Today
        </Link>
      </section>
    </div>
  );
}

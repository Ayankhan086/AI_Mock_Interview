import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">About MockAI</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We believe that standard interview prep is broken. Memorizing flashcards and typing out answers doesn't prepare you for the pressure of speaking to a real human. That's why we built MockAI.
        </p>
      </section>

      <section className="w-full bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our mission is to democratize access to high-quality interview preparation. Professional interview coaching can cost hundreds of dollars an hour, making it inaccessible to most job seekers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By leveraging advanced Large Language Models and real-time voice synthesis, MockAI provides the exact same caliber of dynamic, push-and-pull conversational practice at a fraction of the cost.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-3xl p-12 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🚀</span>
              <h3 className="text-2xl font-bold text-[var(--color-primary)]">Empowering Careers</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to ace your next interview?</h2>
        <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-lg font-medium inline-block shadow-md">
          Start Practicing Today
        </Link>
      </section>
    </div>
  );
}

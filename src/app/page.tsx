import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-gold)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-gold)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="z-10 text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
          Master Your <span className="text-[var(--color-gold)]">Interview</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10">
          Experience real, dynamic voice conversations with our AI interviewer. No scripts, no text chat—just you, the AI, and realistic practice.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-gold px-8 py-4 rounded-xl text-lg w-full sm:w-auto text-center">
            Start Practicing
          </Link>
          <Link href="/login" className="glass-panel px-8 py-4 rounded-xl text-lg w-full sm:w-auto text-center hover:bg-white/10 transition-colors">
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}

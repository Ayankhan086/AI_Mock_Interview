"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isStaticPage = ['/', '/about', '/features', '/pricing', '/contact'].includes(pathname);
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      
      {isAuthPage && (
        <div className="w-full pt-8 pb-4 flex justify-center z-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">MockAI</span>
          </Link>
        </div>
      )}

      <main className={`flex-grow flex flex-col ${!isAuthPage ? 'pt-20' : ''}`}>
        {children}
      </main>

      {isStaticPage && <Footer />}
    </>
  );
}

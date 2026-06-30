"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(() => setIsLoggedIn(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-[var(--color-primary)] to-blue-500 shadow-lg' : 'bg-gradient-to-r from-[var(--color-primary)] to-blue-500'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl text-white">MockAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-all px-3 py-2 rounded-lg hover:bg-white/20 hover:text-white ${pathname === link.href ? 'text-white bg-white/20' : 'text-indigo-100'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all hidden sm:block">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-white/20 text-white hover:bg-white/30 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all hidden sm:block">
                Login
              </Link>
              <Link href="/register" className="bg-white text-[var(--color-primary)] hover:bg-indigo-50 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

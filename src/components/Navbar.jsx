import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tentang', href: '#about' },
    { name: 'Proyek', href: '#projects' },
    { name: 'Pengalaman', href: '#experience' },
    { name: 'Dokumentasi', href: '#documentation' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b ${isScrolled
          ? 'bg-white/10 backdrop-blur-lg border-white/10 py-4 shadow-sm'
          : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="w-full px-6 md:px-12 flex justify-between items-center relative">
        {/* Placeholder for Logo to maintain flex-between spacing */}
        <div className="w-8"></div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex items-center gap-8"
        >
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-zinc-400 hover:text-white transition-colors relative group uppercase tracking-widest"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="text-xs font-bold px-6 py-2 transition-all uppercase tracking-widest bg-white text-black hover:bg-zinc-200"
          >
            HUBUNGI SAYA
          </a>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="md:hidden p-2 text-white transition-colors duration-500 relative z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="md:hidden fixed top-0 right-0 w-[60vw] sm:w-[40vw] h-screen overflow-hidden bg-[#050505]/95 backdrop-blur-xl border-l border-white/10 pointer-events-auto shadow-2xl pt-24"
          >
            <div className="flex flex-col gap-6 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-zinc-300 hover:text-white transition-colors uppercase tracking-widest border-b border-white/5 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-4 text-center text-sm font-bold bg-white text-black px-6 py-4 transition-all uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HUBUNGI SAYA
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

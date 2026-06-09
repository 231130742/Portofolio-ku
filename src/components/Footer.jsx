import React from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <a href="#" className="text-2xl font-bold tracking-tighter text-white">
              Port<span className="text-brand-blue">folio.</span>
              <br></br><span>Roihan Sabila Harahap</span>
            </a>
            <p className="mt-2 text-slate-400 max-w-xs">
              Merancang solusi teknologi yang fungsional, rapi, dan mudah digunakan.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-slate-300 hover:bg-brand-blue hover:text-white transition-all">
              <FaGithub size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-slate-300 hover:bg-brand-blue hover:text-white transition-all">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-slate-300 hover:bg-brand-blue hover:text-white transition-all">
              <FaTwitter size={20} />
            </a>
            <a href="mailto:hello@example.com" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-slate-300 hover:bg-brand-blue hover:text-white transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Roihan Sabila Harahap. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

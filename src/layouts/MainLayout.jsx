import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InteractiveBackground } from '../components/InteractiveBackground';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-transparent">
      <InteractiveBackground />
      <Navbar />
      <main className="flex-grow z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export function Contact() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-24">

          {/* Left: Huge Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                MARI
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-white">
                  BANGUN
                </span>
                <br />
                BERSAMA.
              </h2>
              <p className="text-zinc-400 text-xl font-light max-w-sm">
                Tinggalkan pesan jika Anda ingin membuat sesuatu yang luar biasa.
              </p>
            </div>

            <div className="mt-16 space-y-6">
              <a href="mailto:hello@example.com" className="flex items-center gap-4 text-white hover:text-brand-light transition-colors group">
                <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                  <Mail size={20} />
                </span>
                <span className="text-lg font-medium">roihansabilaharahap08@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-white">
                <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <MapPin size={20} />
                </span>
                <span className="text-lg font-medium text-zinc-400">Medan, Indonesia</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Brutalist Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2"
          >
            <form className="flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors peer"
                  placeholder="Nama Anda"
                />
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors peer"
                  placeholder="Alamat Email"
                />
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  required
                  rows="3"
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors resize-none peer"
                  placeholder="Ceritakan tentang proyek Anda..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="group relative inline-flex items-center justify-between w-full sm:w-auto px-8 py-6 bg-white text-black font-black text-xl uppercase tracking-widest overflow-hidden transition-transform active:scale-95 self-start"
              >
                <div className="absolute inset-0 bg-brand-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Kirim Pesan
                </span>
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 ml-8" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

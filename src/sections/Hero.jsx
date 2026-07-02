import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import foto from '../assets/section1benar.png';

const TypewriterText = ({ text, delay = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * 0.04,
      delay: delay,
      ease: "linear",
    });
    return controls.stop;
  }, [count, delay, text]);

  return (
    <span>
      <motion.span>{displayText}</motion.span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[3px] h-[1em] bg-brand-light ml-[4px] align-middle"
        style={{ marginBottom: "-0.1em" }}
      />
    </span>
  );
};

export function Hero() {
  return (
    <section id="home" className="min-h-[100vh] flex flex-col justify-center pt-24 pb-10 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">

          {/* Left Column: Text & CTA */}
          <div className="flex flex-col items-start w-full md:w-3/5 lg:w-1/2">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span>
              </div>
              <span className="text-zinc-400 text-sm font-medium uppercase tracking-widest">
                SIAP BEKERJA
              </span>
            </motion.div>

            {/* Main Title - Huge & Editorial */}
            <div className="relative z-10 w-full mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[11vw] sm:text-[9vw] md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter"
              >
                MEMBANGUN
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-light to-white">
                  SOLUSI
                </span>
                <br />
                DIGITAL.
              </motion.h1>
            </div>

            <div className="mb-8">
              <p className="text-lg md:text-xl text-zinc-400 max-w-lg font-mono leading-relaxed">
                <span className="text-brand-blue mr-2">~</span>
                <TypewriterText
                  text="Mengubah ide-ide kompleks menjadi produk digital yang nyata. Saya berfokus pada pengembangan web, desain antarmuka, Internet Of Things dan penyelesaian masalah melalui teknologi. jika tertarik bisa kepoin aja.."
                  delay={0.8}
                />
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#projects"
                aria-label="Gulir ke bagian Proyek"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-brand-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 font-bold text-lg group-hover:text-white transition-colors duration-300">
                  Jelajahi Proyek
                </span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Profile Image (Hidden on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex justify-end items-center w-full md:w-2/5 lg:w-1/2"
          >
            <div className="relative w-64 md:w-80 lg:w-[400px]">
              {/* Glow Effect behind the frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-brand-blue/30 rounded-full blur-3xl mix-blend-screen translate-y-10"></div>

              {/* Glassmorphic Frame */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md shadow-2xl">
                <img
                  src={foto}
                  alt="Foto Profil Roihan Sabila Harahap"
                  width="400"
                  height="500"
                  fetchpriority="high"
                  className="absolute bottom-0 w-full h-full object-cover object-top transition-all duration-700 hover:scale-[1.05] grayscale brightness-75 hover:grayscale-0 hover:brightness-100"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
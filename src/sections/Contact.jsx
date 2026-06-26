import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export function Contact() {
  const { approvedMessages } = usePortfolio();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

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
            <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors peer"
                  placeholder="Nama Anda"
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors peer"
                  placeholder="Alamat Email"
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl md:text-4xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue transition-colors resize-none peer"
                  placeholder="Ceritakan tentang proyek Anda..."
                  disabled={status === 'submitting'}
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl text-center font-medium">
                  Terima kasih! Pesan Anda telah terkirim dan menunggu persetujuan.
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center font-medium">
                  Gagal mengirim pesan. Silakan coba lagi.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group relative inline-flex items-center justify-between w-full sm:w-auto px-8 py-6 bg-white text-black font-black text-xl uppercase tracking-widest overflow-hidden transition-transform active:scale-95 self-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-brand-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {status === 'submitting' ? 'Mengirim...' : 'Kirim Pesan'}
                </span>
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 ml-8" />
              </button>
            </form>
          </motion.div>

        </div>

        {/* Approved Comments Section */}
        {approvedMessages && approvedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 border-t border-white/10 pt-24"
          >
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Apa Kata Mereka</h3>
              <p className="text-zinc-500 font-light">Pesan dan ulasan dari mereka yang telah terhubung.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedMessages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  key={msg.id} 
                  className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-zinc-800/60 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <MessageSquareQuote className="text-brand-blue mb-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 relative z-10" size={36} />
                  
                  <p className="text-zinc-300 text-lg leading-relaxed mb-8 italic relative z-10 line-clamp-5">"{msg.message}"</p>
                  
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-purple-500 flex items-center justify-center font-black text-white text-xl uppercase shadow-lg shadow-brand-blue/30">
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{msg.name}</h4>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">{new Date(msg.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

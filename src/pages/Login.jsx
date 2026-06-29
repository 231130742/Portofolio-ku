import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_username', data.username);
        navigate('/admin');
      } else {
        setError(data.message || 'Login gagal, periksa username dan password.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Static Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute w-[60vw] h-[60vw] bg-brand-blue/10 rounded-full blur-[120px]"
          style={{ top: '-10%', left: '-10%' }}
        />
        <div 
          className="absolute w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px]"
          style={{ bottom: '-10%', right: '-10%' }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full backdrop-blur-3xl border border-white/10"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -40, 0], x: [0, 30, 0], rotate: [0, 180, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Animated Glow Behind Card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-purple-500 to-brand-blue rounded-[2.5rem] blur-xl opacity-30 animate-pulse"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          {/* Top Edge Shine */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px]" />

          <div className="text-center mb-10 relative">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-blue/20 to-purple-500/20 text-brand-blue mb-6 relative group"
            >
              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-brand-blue/50 transition-colors duration-500" />
              <ShieldCheck size={48} strokeWidth={1.5} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <motion.div 
                animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-3 -right-3 text-purple-400"
              >
                <Sparkles size={20} />
              </motion.div>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
               className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500 tracking-tighter"
            >
              Portal Admin
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
               className="text-zinc-400 text-sm mt-3 font-medium tracking-wide"
            >
              MANAJEMEN PORTOFOLIO EKSKLUSIF
            </motion.p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] relative overflow-hidden"
            >
              <div className="w-1 h-full absolute left-0 top-0 bottom-0 bg-red-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2.5 pl-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/5 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all focus:bg-brand-blue/5 font-bold text-lg"
                  placeholder="Masukkan username"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2.5 pl-1">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/5 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all focus:bg-brand-blue/5 font-bold text-lg tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full mt-10 flex items-center justify-center gap-2 py-4 bg-white text-black font-black text-lg uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-purple-500 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                {isLoading ? 'Memproses...' : (
                  <>
                    Akses Sistem <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center text-zinc-600 text-[11px] uppercase tracking-widest mt-8 font-bold flex items-center justify-center gap-2"
        >
          <Lock size={12} /> Koneksi Terenkripsi & Aman 100%
        </motion.p>
      </div>
    </div>
  );
}

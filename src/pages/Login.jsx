import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LogIn, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

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
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden group">
          
          {/* Subtle Top Border Glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="text-center mb-10 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="mx-auto w-20 h-20 bg-gradient-to-tr from-brand-blue/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-300"
            >
              <ShieldCheck className="text-brand-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" size={36} strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Secure authentication for portfolio management.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="leading-snug">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Username</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-brand-blue transition-colors">
                  <User size={18} strokeWidth={2} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue/50 focus:bg-brand-blue/5 focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-brand-blue transition-colors">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-brand-blue/50 focus:bg-brand-blue/5 focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium tracking-widest"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  <span className="tracking-wide">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide text-sm uppercase">Secure Login</span>
                  <LogIn size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-zinc-600 text-xs mt-6 font-medium tracking-wide">
          Protected Area &bull; Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}

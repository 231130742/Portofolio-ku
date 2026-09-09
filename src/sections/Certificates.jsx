import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Calendar, ExternalLink } from 'lucide-react';

export function Certificates() {
  const { certificates } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('Semua');

  if (!certificates || certificates.length === 0) return null;

  // Mendapatkan daftar kategori unik
  const categories = ['Semua', ...new Set(certificates.map(cert => cert.category))];

  // Filter sertifikat berdasarkan kategori aktif
  const filteredCertificates = activeCategory === 'Semua' 
    ? certificates 
    : certificates.filter(cert => cert.category === activeCategory);

  return (
    <section id="certificates" className="py-20 bg-zinc-950 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Sertifikat & <span className="text-yellow-500">Pencapaian</span></h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Koleksi kredensial, lisensi, pelatihan, dan pencapaian kompetisi yang telah saya raih selama perjalanan karir dan pendidikan.</p>
        </motion.div>

        {/* Filter Categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Certificates Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCertificates.map(cert => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                key={cert.id}
                className="group bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-yellow-500/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all flex flex-col"
              >
                {/* Image Section */}
                <div className="w-full aspect-[4/3] bg-black relative overflow-hidden flex items-center justify-center p-4">
                  {cert.image_url ? (
                    <img 
                      src={cert.image_url} 
                      alt={cert.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded-xl">
                      <Award size={48} className="text-zinc-600" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold tracking-widest uppercase">
                      {cert.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-yellow-500 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-brand-blue font-medium text-sm mb-4">
                    {cert.issuer}
                  </p>

                  <div className="mt-auto space-y-2 text-sm text-zinc-400">
                    {cert.issue_date && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-zinc-500" />
                        <span>Diterbitkan: {new Date(cert.issue_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                      </div>
                    )}
                    {cert.credential_id && (
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-zinc-500" />
                        <span>ID: {cert.credential_id}</span>
                      </div>
                    )}
                  </div>

                  {cert.credential_url && (
                    <a 
                      href={cert.credential_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-yellow-500 hover:text-black text-white font-bold rounded-xl transition-all"
                    >
                      Lihat Kredensial <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

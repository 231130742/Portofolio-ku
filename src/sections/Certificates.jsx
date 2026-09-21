import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Calendar, ExternalLink, X, ZoomIn } from 'lucide-react';

export function Certificates() {
  const { certificates } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState(null);

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
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCertificates.map(cert => (
              <motion.div whileHover={{ y: -5 }}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={cert.id}
                className="group bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 rounded-3xl overflow-hidden shadow-xl transition-all flex flex-col"
              >
                {/* Image Section */}
                <div 
                  className="w-full bg-black/50 relative overflow-hidden flex items-center justify-center p-6 cursor-pointer group/img min-h-[240px]"
                  onClick={() => cert.image_url && setSelectedImage(cert.image_url)}
                >
                  {cert.image_url ? (
                    <>
                      <img 
                        src={cert.image_url} 
                        alt={cert.title} 
                        className="max-w-full max-h-56 object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-2xl" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                        <div className="bg-yellow-500 text-black p-3 rounded-full transform translate-y-4 group-hover/img:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                          <ZoomIn size={24} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded-xl min-h-[200px]">
                      <Award size={48} className="text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase">
                      {cert.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-zinc-400 font-medium text-sm mb-6">
                    {cert.issuer}
                  </p>

                  <div className="mt-auto space-y-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                    {cert.issue_date && (
                      <div className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                        <div className="p-1.5 bg-white/5 rounded-md text-zinc-400"><Calendar size={14} /></div>
                        <span>Terbit: {new Date(cert.issue_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                      </div>
                    )}
                    {cert.credential_id && (
                      <div className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                        <div className="p-1.5 bg-white/5 rounded-md text-zinc-400"><Award size={14} /></div>
                        <span className="truncate">ID: {cert.credential_id}</span>
                      </div>
                    )}
                  </div>

                  {cert.credential_url && (
                    <a 
                      href={cert.credential_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-yellow-500 hover:text-black text-white text-sm font-bold rounded-xl transition-all"
                    >
                      Verifikasi Kredensial <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal / Lightbox for Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md cursor-pointer"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-50"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              src={selectedImage}
              alt="Certificate Detail"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

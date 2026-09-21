import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Calendar, ExternalLink, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export function Certificates() {
  const { certificates } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 50 : scrollLeft + clientWidth - 50;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

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

        {/* Elegant Non-Boxy Layout: Interactive List + Sticky Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          
          {/* Sticky Image Viewer (Left side) */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 order-1 relative z-20">
            <AnimatePresence mode="wait">
              {activeCert && (
                <motion.div
                  key={activeCert.id}
                  initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                  className="w-full aspect-[4/3] md:aspect-square lg:h-[70vh] flex flex-col items-center justify-center group relative"
                >
                  {/* Frameless glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-transparent to-yellow-500/20 rounded-full blur-[100px] -z-10 opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
                  
                  {activeCert.image_url ? (
                    <div 
                      className="relative w-full h-full flex items-center justify-center cursor-pointer" 
                      onClick={() => setSelectedImage(activeCert.image_url)}
                    >
                      <img 
                        src={activeCert.image_url} 
                        alt={activeCert.title} 
                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                         <div className="bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.6)] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                            <ZoomIn size={32} />
                         </div>
                      </div>
                    </div>
                  ) : (
                     <div className="text-zinc-600 flex flex-col items-center"><Award size={64} className="mb-4 opacity-50" /> <span className="font-medium tracking-widest uppercase text-sm">Preview Tidak Tersedia</span></div>
                  )}

                  {activeCert.credential_url && (
                    <div className="absolute bottom-0 left-0 w-full flex justify-center translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
                       <a href={activeCert.credential_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-wider text-sm rounded-full shadow-2xl hover:bg-yellow-500 hover:scale-105 transition-all">
                         Verifikasi Kredensial <ExternalLink size={18} />
                       </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Text List (Right side) */}
          <div className="lg:col-span-6 flex flex-col order-2 relative">
            {/* Minimalist vertical line indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

            {filteredCertificates.map((cert) => {
              const isActive = activeCert?.id === cert.id;
              return (
                <div 
                  key={cert.id}
                  onMouseEnter={() => setActiveCertId(cert.id)}
                  onClick={() => { 
                    setActiveCertId(cert.id); 
                    if(window.innerWidth < 1024) document.getElementById('certificates').scrollIntoView({behavior: 'smooth', block: 'start'}) 
                  }}
                  className={`group flex flex-col py-10 lg:py-12 border-b border-white/5 cursor-pointer transition-all duration-500 relative ${
                    isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                  }`}
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 transition-all duration-500 hidden lg:block ${isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} />

                  <div className={`transition-all duration-500 ${isActive ? 'lg:pl-12' : 'lg:pl-8'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-yellow-500' : 'text-zinc-500'}`}>
                        {cert.category}
                      </span>
                      {cert.issue_date && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                            <Calendar size={12} /> {new Date(cert.issue_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h3 className={`text-3xl md:text-4xl font-black mb-4 leading-tight transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                      {cert.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-400">
                      <span className="flex items-center gap-2"><Award size={18} className={isActive ? 'text-brand-blue' : ''} /> {cert.issuer}</span>
                      {cert.credential_id && (
                        <span className="flex items-center gap-2 font-mono text-xs bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                          ID: {cert.credential_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

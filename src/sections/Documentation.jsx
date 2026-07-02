import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export function Documentation() {
  const { docs } = usePortfolio();
  const [expandedDocs, setExpandedDocs] = useState({});

  const toggleExpand = (id) => {
    setExpandedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!docs || docs.length === 0) return null;

  return (
    <section id="documentation" className="py-32 relative bg-zinc-950/20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Berita &
              <br />
              <span className="text-zinc-500">Liputan.</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 max-w-md font-light leading-relaxed text-lg"
          >
            Kumpulan dokumentasi, penghargaan, dan liputan kegiatan terbaru yang pernah saya lakukan.
          </motion.p>
        </div>

        <div className="flex flex-col gap-12">
          {docs.map((doc, index) => (
            <motion.article
              key={doc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col md:flex-row gap-8 items-start relative pb-12 border-b border-white/5 last:border-0"
            >
              {/* Media Section */}
              <div className="w-full md:w-2/5 overflow-hidden rounded-xl aspect-video relative bg-black shrink-0">
                {doc.type === 'youtube' ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={doc.url}
                    title={doc.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                ) : (
                  <img 
                    src={doc.url} 
                    alt={doc.title} 
                    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                )}
                {doc.type === 'image' && (
                  <div className="absolute inset-0 bg-brand-blue/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-3/5 flex flex-col pt-2">
                <div className="flex items-center gap-2 text-brand-blue mb-4 text-sm font-bold tracking-widest uppercase">
                  <Calendar size={16} />
                  <span>{new Date(doc.doc_date || doc.created_at || new Date()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-brand-light transition-colors leading-tight">
                  {doc.title}
                </h3>
                
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-4 max-w-2xl whitespace-pre-wrap">
                  {doc.description ? (doc.description.length > 430 && !expandedDocs[doc.id] ? doc.description.substring(0, 430) + '...' : doc.description) : "Tidak ada deskripsi tersedia untuk dokumentasi ini."}
                </p>

                <div className="mt-auto flex items-center gap-6">
                  {doc.description && doc.description.length > 430 && (
                    <button onClick={() => toggleExpand(doc.id)} className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-widest text-sm hover:text-white transition-colors cursor-pointer">
                      {expandedDocs[doc.id] ? 'Tutup' : 'Baca Selengkapnya'}
                      {expandedDocs[doc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}

                  {doc.external_link && (
                    <a href={doc.external_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group-hover:text-brand-blue transition-colors cursor-pointer">
                      Kunjungi Situs
                      <ExternalLink size={16} className="transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

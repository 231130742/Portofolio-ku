import React from 'react';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Card, CardContent } from '../components/ui/Card';

export function Projects() {
  const { projects } = usePortfolio();
  
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Proyek
              <br />
              <span className="text-zinc-500">Pilihan.</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 max-w-md font-light leading-relaxed text-lg"
          >
            Kumpulan proyek pilihan yang menunjukkan passion saya terhadap kode yang bersih dan desain yang luar biasa.
          </motion.p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[400px]">
          {projects.map((project, index) => {
            // Make the first project take up more space (Bento style)
            const isFeatured = index === 0;
            const gridClass = isFeatured 
              ? "md:col-span-2 md:row-span-2" 
              : "md:col-span-1 md:row-span-1";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`${gridClass} h-full`}
              >
                <Card className="flex flex-col group h-full relative overflow-hidden bg-zinc-950/40 hover:bg-zinc-900/60 transition-colors duration-500 border-white/5 hover:border-brand-blue/30">
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 ${isFeatured ? 'opacity-80 group-hover:opacity-60' : 'opacity-90 group-hover:opacity-70'}`} />
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700 ease-out opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="relative z-20 flex flex-col h-full justify-end p-8 md:p-10">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-widest font-bold text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className={`font-bold text-white mb-3 tracking-tight ${isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                        {project.title}
                      </h3>
                      
                      <p className={`text-zinc-400 font-light mb-8 line-clamp-2 group-hover:line-clamp-none transition-all duration-500 ${isFeatured ? 'text-lg max-w-xl' : 'text-sm'}`}>
                        {project.description}
                      </p>
                      
                      <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-white hover:text-brand-light transition-colors"
                        >
                          <FaGithub size={18} /> Lihat Kode
                        </a>
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-white hover:text-brand-light transition-colors"
                        >
                          <ExternalLink size={18} /> Kunjungi Situs
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

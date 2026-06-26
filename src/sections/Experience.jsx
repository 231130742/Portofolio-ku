import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export function Experience() {
  const { experiences: organizations } = usePortfolio();

  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="experience" className="py-32 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left Title */}
          <div className="w-full md:w-1/3">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white tracking-tighter sticky top-32"
            >
              ORGANISASI & PENGALAMAN
              <span className="text-brand-blue">.</span>
            </motion.h2>
          </div>

          {/* Right Timeline */}
          <div className="w-full md:w-2/3">
            <div className="space-y-16">
              {organizations.map((org, index) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-0 border-l border-white/10 md:border-none"
                >
                  <div className="hidden md:block absolute left-[-40px] top-2 w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-4">
                    <span className="text-brand-blue font-mono text-sm tracking-widest shrink-0">
                      {org.start_year && org.end_year ? `${org.start_year} - ${org.end_year}` : org.period}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {org.role}
                    </h3>
                  </div>

                  <h4 className="text-zinc-500 font-medium text-lg uppercase tracking-widest mb-6">
                    {org.organization}
                  </h4>

                  <p className="text-zinc-400 leading-relaxed font-light text-lg max-w-2xl">
                    {org.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

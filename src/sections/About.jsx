import React from 'react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="py-32 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Left: Sticky Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/3 lg:sticky lg:top-32"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
              Tentang
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">
                Saya
              </span>
            </h2>
            <div className="w-20 h-1 bg-brand-blue mb-8"></div>
            <p className="text-zinc-400 font-light text-lg">
              Pengenalan singkat tentang latar belakang, pengalaman, dan visi di balik karya digital saya.
            </p>
          </motion.div>

          {/* Right: Scrolling Content & Image */}
          <div className="w-full lg:w-2/3 flex flex-col gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-video w-full rounded-2xl overflow-hidden glass p-2"
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-blue/10 mix-blend-overlay z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"
                  alt="Roihan Sabila Harahap coding"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed tracking-tight">
                Halo, saya Roihan Sabila Harahap, mahasiswa Teknologi Informasi yang senang mengeksplorasi banyak hal di dunia digital. Selain menikmati proses <strong className="font-bold text-brand-light">coding dan mendesain tampilan</strong> yang rapi, saya juga aktif memimpin organisasi kampus.
              </p>

              <p className="text-lg text-zinc-400 mt-8 font-light leading-loose">
                Pengalaman tersebut mengajarkan saya bahwa membangun produk digital yang baik tidak hanya membutuhkan logika teknis yang kuat, tetapi juga kerja sama tim dan komunikasi yang efektif.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/5">
                {[
                  { label: "Organisasi", value: "4+" },
                  { label: "Kepanitiaan", value: "5+" },
                  { label: "Penghargaan", value: "6+" },
                  { label: "Kopi", value: "∞" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-4xl font-black text-white">{stat.value}</span>
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest mt-2">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
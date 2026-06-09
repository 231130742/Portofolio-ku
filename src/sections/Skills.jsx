import React from 'react';
import { skills } from '../data/skills';

export function Skills() {
  // Flatten skills for the marquee
  const allSkills = skills.flatMap(category => category.items);
  // Duplicate for seamless scroll
  const marqueeSkills = [...allSkills, ...allSkills, ...allSkills];

  return (
    <section className="py-24 border-y border-white/5 bg-zinc-950/20 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {marqueeSkills.map((skill, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center px-12"
          >
            <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 to-zinc-900 uppercase tracking-tighter hover:text-white transition-colors duration-300 cursor-default">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

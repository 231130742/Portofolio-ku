import React from 'react';

export function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
        <div className="aurora-3"></div>
      </div>
      
      {/* Elegant Animated Grid */}
      <div className="absolute inset-0 perspective-1000">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid-move_2s_linear_infinite]"
          style={{
            maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 40%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}


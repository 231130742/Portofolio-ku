import React from 'react';
import Tilt from 'react-parallax-tilt';
import { cn } from '../../utils';

export function Card({ children, className, ...props }) {
  return (
    <Tilt 
      tiltMaxAngleX={5} 
      tiltMaxAngleY={5} 
      glareEnable={true} 
      glareMaxOpacity={0.1} 
      glareColor="#ffffff" 
      glarePosition="all" 
      glareBorderRadius="24px"
      scale={1.02}
      transitionSpeed={400}
      className="h-full"
    >
      <div
        className={cn(
          "glass rounded-[24px] overflow-hidden transition-shadow duration-300 hover:border-brand-blue/30 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] relative group h-full flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </Tilt>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

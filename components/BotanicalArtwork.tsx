'use me client';

import React from 'react';

interface BotanicalProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'hero-left' | 'hero-right';
}

export function BotanicalCorner({ className = '', position = 'top-left' }: BotanicalProps) {
  // Positioning transform styles
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-6 -translate-y-6',
    'top-right': 'top-0 right-0 translate-x-6 -translate-y-6 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 -translate-x-6 translate-y-6 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 translate-x-6 translate-y-6 scale-x-[-1] scale-y-[-1]',
    'hero-left': 'top-1/4 -left-12 opacity-85',
    'hero-right': 'top-1/3 -right-12 scale-x-[-1] opacity-85',
  }[position];

  return (
    <div className={`absolute pointer-events-none z-0 ${positionClasses} ${className}`}>
      <svg
        width="340"
        height="380"
        viewBox="0 0 340 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 sm:w-72 md:w-96 h-auto drop-shadow-sm transition-transform duration-700 hover:scale-105"
      >
        {/* Deep Forest Ink Stem */}
        <path
          d="M 10 10 C 60 80, 120 180, 180 340"
          stroke="#193c35"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 120 180 C 180 140, 260 120, 320 130"
          stroke="#193c35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Large Olive Grove Leaves */}
        <path
          d="M 60 80 C 30 50, 10 90, 45 120 C 70 110, 80 90, 60 80 Z"
          fill="#7e813c"
          opacity="0.9"
        />
        <path
          d="M 100 140 C 140 100, 180 110, 150 160 C 120 170, 95 160, 100 140 Z"
          fill="#7e813c"
          opacity="0.85"
        />
        <path
          d="M 150 240 C 210 200, 240 250, 190 280 C 160 270, 140 250, 150 240 Z"
          fill="#193c35"
          opacity="0.95"
        />

        {/* Sage Mist Leaves */}
        <path
          d="M 30 40 C 70 20, 90 60, 50 70 Z"
          fill="#c6d7d0"
        />
        <path
          d="M 180 140 C 230 110, 250 150, 200 165 Z"
          fill="#c6d7d0"
        />
        <path
          d="M 240 125 C 290 90, 310 130, 260 145 Z"
          fill="#c6d7d0"
        />

        {/* Mustard Bloom Flowers */}
        <circle cx="220" cy="115" r="18" fill="#e5ba2b" />
        <circle cx="220" cy="115" r="7" fill="#092a49" />
        
        <circle cx="130" cy="210" r="14" fill="#e5ba2b" />
        <circle cx="130" cy="210" r="5" fill="#092a49" />

        {/* Ember Orange Flower Accents */}
        <path
          d="M 280 130 C 295 100, 330 115, 315 140 C 300 150, 275 145, 280 130 Z"
          fill="#ec4f22"
        />
        <path
          d="M 80 180 C 60 160, 45 195, 70 205 Z"
          fill="#ec4f22"
        />

        {/* Dusty Peach Soft Petals */}
        <circle cx="170" cy="290" r="12" fill="#f6bba4" />
        <circle cx="280" cy="210" r="10" fill="#f6bba4" opacity="0.8" />

        {/* Deep Indigo Stem Details & Line Work */}
        <path
          d="M 180 340 C 220 310, 270 330, 300 360"
          stroke="#092a49"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle cx="300" cy="360" r="4" fill="#ff5734" />
        <circle cx="280" cy="345" r="3" fill="#ff5734" />
        <circle cx="260" cy="335" r="2.5" fill="#ff5734" />
      </svg>
    </div>
  );
}

export function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 pointer-events-none ${className}`}>
      <div className="h-[1px] w-16 sm:w-28 bg-[#f6bba4]" />
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2 C20 10, 28 14, 30 16 C28 18, 20 22, 16 30 C12 22, 4 18, 2 16 C4 14, 12 10, 16 2 Z" fill="#ff5734" opacity="0.85" />
        <circle cx="16" cy="16" r="3" fill="#e5ba2b" />
      </svg>
      <div className="h-[1px] w-16 sm:w-28 bg-[#f6bba4]" />
    </div>
  );
}

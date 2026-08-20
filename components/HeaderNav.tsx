'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeaderNavProps {
  currentHash?: string;
  recipientName?: string;
}

export function HeaderNav({ currentHash, recipientName }: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#fef1ec]/90 backdrop-blur-md border-b border-[#f6bba4]/40 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Name */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[#11223f] hover:text-[#ff5734] transition-colors"
        >
          <Sparkles className="w-5 h-5 text-[#ff5734] transition-transform group-hover:rotate-12" />
          <span className="font-sans font-semibold text-lg sm:text-xl tracking-[0.22em] uppercase">
            HarowisheZ
          </span>
        </Link>

      </div>
    </header>
  );
}

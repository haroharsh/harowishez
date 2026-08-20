'use client';

import React from 'react';
import { Quote, HeartHandshake, Sun, Sparkles, Feather, Compass } from 'lucide-react';
import { BotanicalDivider } from './BotanicalArtwork';

interface WishesGridProps {
  name: string;
  wishes: string[];
  quotes: string[];
}

export function WishesGrid({ name, wishes = [], quotes = [] }: WishesGridProps) {
  const lineIcons = [
    <HeartHandshake key="1" className="w-10 h-10 stroke-[1.25] text-[#ff5734]" />,
    <Sun key="2" className="w-10 h-10 stroke-[1.25] text-[#e5ba2b]" />,
    <Sparkles key="3" className="w-10 h-10 stroke-[1.25] text-[#193c35]" />,
    <Compass key="4" className="w-10 h-10 stroke-[1.25] text-[#092a49]" />,
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="eyebrow-label mb-3">WARMTH & REFLECTIONS</p>
        <h2 className="font-serif font-normal text-3xl sm:text-5xl uppercase tracking-wider text-[#11223f]">
          Wishes for {name}
        </h2>
        <BotanicalDivider className="my-4" />
      </div>

      {/* 3-4 Wishes Grid (White Editorial Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
        {wishes.map((wish, index) => (
          <div
            key={index}
            className="white-editorial-card flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#fef1ec] group-hover:bg-[#f6bba4]/40 transition-colors">
                {lineIcons[index % lineIcons.length]}
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#11223f]/40 font-medium">
                WISH N° 0{index + 1}
              </span>
            </div>

            <p className="font-sans font-light text-lg sm:text-xl text-[#11223f] leading-relaxed mb-6">
              {wish}
            </p>

            <div className="h-[2px] w-12 bg-[#ff5734] group-hover:w-full transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* 2-3 Quotes Grid */}
      {quotes.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-2">FOR YOUR HEART</p>
            <h3 className="font-serif text-2xl sm:text-4xl uppercase font-normal tracking-wide text-[#11223f]">
              Words For You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((quote, idx) => (
              <div
                key={idx}
                className="bg-[#ffffff] p-8 flex flex-col justify-between text-center relative group border-t-2 border-[#ff5734]/30 hover:border-[#ff5734] transition-all"
              >
                <Quote className="w-8 h-8 text-[#f6bba4] mx-auto mb-4 stroke-[1.2]" />
                <p className="font-serif italic text-lg sm:text-xl text-[#11223f] leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="font-sans text-xs tracking-[0.2em] uppercase text-[#ff5734] font-medium">
                  — Quote {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

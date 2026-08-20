'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame } from 'lucide-react';
import { BotanicalCorner, BotanicalDivider } from './BotanicalArtwork';
import { formatEyebrowDate } from '@/lib/utils';

interface HeroProps {
  name: string;
  birthdayDate: string;
  pictures?: string[];
  customMessage?: string;
}

export function HeroBirthday({ name, birthdayDate, pictures = [], customMessage }: HeroProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const formattedEyebrow = formatEyebrowDate(birthdayDate);

  // Fallback memory pictures if array is short
  const marqueeImages = pictures && pictures.length > 0 ? pictures : [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000'
  ];

  // Duplicate for smooth seamless loop
  const doubleMarqueeImages = [...marqueeImages, ...marqueeImages];

  const handleBlowCandles = () => {
    setCandlesBlown(true);

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff5734', '#e5ba2b', '#ec4f22', '#193c35', '#f6bba4', '#092a49']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-20 overflow-hidden bg-[#fef1ec]">
      
      {/* Botanical artwork corners */}
      <BotanicalCorner position="top-left" />
      <BotanicalCorner position="top-right" />
      <BotanicalCorner position="hero-left" />
      <BotanicalCorner position="hero-right" />

      {/* Infinite Floating Large Picture Marquee (Moving Right to Left BEHIND the Name) */}
      <div className="absolute inset-0 top-10 bottom-10 flex items-center overflow-hidden pointer-events-none z-0 opacity-55">
        <div className="animate-marquee-left flex gap-8 sm:gap-14 items-center px-4">
          {doubleMarqueeImages.map((imgUrl, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 h-80 sm:w-[400px] sm:h-[520px] bg-white p-3 sm:p-5 shadow-2xl rounded-sm transform rotate-[-3deg] even:rotate-[4deg] hover:scale-105 transition-transform border border-[#f6bba4]/60"
            >
              <img
                src={imgUrl}
                alt="Floating memory artwork"
                className="w-full h-full object-cover rounded-xs filter contrast-[1.08]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Date Eyebrow Label */}
        <p className="eyebrow-label mb-6 text-[#11223f]/80">
          {formattedEyebrow}
        </p>

        {/* Canela-style 120px Display Name */}
        <h1 className="display-hero-name mb-8 max-w-3xl drop-shadow-md">
          {name}
        </h1>

        {/* Subtitle / Wish Accent */}

        <BotanicalDivider className="w-full max-w-md my-2" />

        {/* Custom Message Card */}
        {customMessage && (
          <div className="mt-6 mb-10 max-w-2xl p-6 sm:p-8 bg-white border-l-4 border-[#ff5734] text-left shadow-sm">
            <p className="font-serif italic text-lg sm:text-xl text-[#11223f] leading-relaxed">
              &ldquo;{customMessage}&rdquo;
            </p>
            <div className="mt-4 text-right text-xs font-sans tracking-[0.2em] uppercase text-[#ff5734] font-medium">
              — With endless love
            </div>
          </div>
        )}

        {/* Interactive Candle / Make a Wish Button */}
        <div className="mt-4 flex flex-col items-center gap-4">
          <button
            onClick={handleBlowCandles}
            className={`btn-pill-filled text-sm sm:text-base py-3.5 px-8 flex items-center gap-3 ${
              candlesBlown ? '!bg-[#193c35] !border-[#193c35]' : ''
            }`}
          >
            {candlesBlown ? (
              <>
                <Sparkles className="w-5 h-5 text-[#e5ba2b] animate-spin" />
                <span>Wishes Celebrate {name}!</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-[#e5ba2b] animate-bounce" />
                <span>Make a Wish & Blow Candles</span>
              </>
            )}
          </button>
          
          {candlesBlown && (
            <p className="text-xs font-sans tracking-[0.18em] uppercase text-[#ff5734] animate-pulse">
              ✨ Wish Fullfilled ✨
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { BotanicalCorner, BotanicalDivider } from '@/components/BotanicalArtwork';
import { HashRouterListener } from '@/components/HashRouterListener';
import { getAllWishes } from '@/lib/wishService';
import { Sparkles, Search, ArrowRight, Gift } from 'lucide-react';

export const metadata = {
  title: 'Harowishez — Relative Birthday Portals',
  description: 'Botanical, hand-crafted birthday wish portals for relatives and loved ones.',
};

export default async function HomePage() {
  const wishes = await getAllWishes();

  return (
    <div className="min-h-screen bg-[#fef1ec] text-[#11223f] flex flex-col selection:bg-[#ff5734] selection:text-white">
      {/* Listens for hash changes in URL like #/gdadjgajdgajjhchcjh */}
      <HashRouterListener />

      {/* Navigation Bar */}
      <HeaderNav />

      <main className="flex-1">
        {/* Botanical Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-16 overflow-hidden">
          
          <BotanicalCorner position="top-left" />
          <BotanicalCorner position="top-right" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f6bba4]/30 text-[#11223f] text-xs font-semibold tracking-[0.22em] uppercase mb-8 border border-[#f6bba4]">
              <Sparkles className="w-4 h-4 text-[#ff5734]" />
              <span>FAMILY BIRTHDAY ARCHIVE</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.9] text-[#11223f] uppercase mb-6 tracking-tight">
              HAROWISHEZ
            </h1>

            <p className="font-serif italic text-2xl sm:text-3xl text-[#11223f]/80 max-w-2xl font-light mb-8">
              &ldquo;An art of love, creativity, and everlasting birthday wishes.&rdquo;
            </p>

            <BotanicalDivider className="w-full max-w-md my-4" />

            {/* Quick Hash Route Search / Direct Access Form */}
            <div className="w-full max-w-xl bg-white p-3 border border-[#f6bba4] shadow-sm mt-4">
              <form action="/wishes/gdadjgajdgajjhchcjh" className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#ff5734] ml-3" />
                <input
                  type="text"
                  name="hash"
                  placeholder="Enter secret wish hash (e.g. gdadjgajdgajjhchcjh)..."
                  className="flex-1 bg-transparent px-3 py-2 font-mono text-sm text-[#11223f] focus:outline-none placeholder:text-[#11223f]/40"
                  defaultValue="gdadjgajdgajjhchcjh"
                />
                <Link
                  href="/wishes/gdadjgajdgajjhchcjh"
                  className="btn-pill-filled text-xs py-2.5 px-5 flex items-center gap-2"
                >
                  <span>Open Wish</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </form>
              <div className="mt-2 text-center text-xs font-sans text-[#11223f]/60">
                Try visiting: <code className="text-[#ff5734] font-semibold">/#/gdadjgajdgajjhchcjh</code> or click Peter below!
              </div>
            </div>

          </div>
        </section>

        {/* Relatives Birthday Portals Grid */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-2">FAMILY PORTALS</p>
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-[#11223f]">
              Relative Birthday Pages
            </h2>
            <BotanicalDivider className="my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wishes.map((w) => (
              <Link
                key={w.hash}
                href={`/wishes/${w.hash}`}
                className="white-editorial-card group flex flex-col justify-between border-t-2 border-[#ff5734] transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#ff5734] font-semibold">
                      /#/{w.hash}
                    </span>
                    <Gift className="w-5 h-5 text-[#ff5734] transition-transform group-hover:scale-110" />
                  </div>

                  <h3 className="font-serif text-3xl text-[#11223f] mb-3 group-hover:text-[#ff5734] transition-colors">
                    {w.name}
                  </h3>

                  <p className="font-serif italic text-sm text-[#11223f]/80 line-clamp-2 mb-6">
                    &ldquo;{w.customMessage || w.wishes[0]}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f6bba4]/40 flex items-center justify-between">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#11223f] font-medium group-hover:underline">
                    View Celebration
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#ff5734] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#11223f] text-[#fef1ec] text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-serif italic text-2xl text-[#fef1ec] tracking-wide mb-2">
            from Harshit Choudhary
          </p>
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#fef1ec]/50">
            HAROWISHEZ © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

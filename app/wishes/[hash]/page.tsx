import React from 'react';
import { getWishByHash } from '@/lib/wishService';
import { HeaderNav } from '@/components/HeaderNav';
import { HeroBirthday } from '@/components/HeroBirthday';
import { WishesGrid } from '@/components/WishesGrid';
import { PhotoGallery } from '@/components/PhotoGallery';
import { SpotifyPlayer } from '@/components/SpotifyPlayer';
import { BotanicalDivider } from '@/components/BotanicalArtwork';
import { HashRouterListener } from '@/components/HashRouterListener';
import Link from 'next/link';
import { Sparkles, Home } from 'lucide-react';

interface PageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { hash } = await params;
  const wish = await getWishByHash(hash);

  if (!wish) {
    return {
      title: 'Birthday Wish Portal — Harowishez',
    };
  }

  return {
    title: `Happy Birthday ${wish.name}! — Harowishez`,
    description: `A personalized botanical birthday celebration for ${wish.name}.`,
  };
}

export default async function WishDetailPage({ params }: PageProps) {
  const { hash } = await params;
  const wish = await getWishByHash(hash);

  if (!wish) {
    return (
      <div className="min-h-screen bg-[#fef1ec] flex flex-col items-center justify-center p-6 text-center">
        <HashRouterListener />
        <HeaderNav />
        <div className="my-auto max-w-lg bg-white p-10 border border-[#f6bba4]">
          <Sparkles className="w-12 h-12 text-[#ff5734] mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-normal text-[#11223f] mb-3">
            Wish Portal Not Found
          </h1>
          <p className="font-sans text-sm text-[#11223f]/70 leading-relaxed mb-6">
            We couldn&apos;t locate a birthday wish page registered for the hash: <code className="bg-[#fef1ec] px-2 py-1 text-[#ff5734]">{hash}</code>
          </p>
          <Link href="/" className="btn-pill-filled text-xs">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef1ec] flex flex-col selection:bg-[#ff5734] selection:text-white">
      <HashRouterListener />
      
      {/* Header Navigation */}
      <HeaderNav currentHash={wish.hash} recipientName={wish.name} />

      {/* Hero Display with Infinite Right-to-Left Marquee behind name */}
      <HeroBirthday
        name={wish.name}
        birthdayDate={wish.birthdayDate}
        pictures={wish.pictures}
        customMessage={wish.customMessage}
      />

      {/* Spotify UI MP3 Player Widget */}
      <div className="px-4" >
        <SpotifyPlayer songUrl={wish.songUrl} recipientName={wish.name} />
      </div>

      {/* Wishes & Words For You Grid */}
      <WishesGrid
        name={wish.name}
        wishes={wish.wishes}
        quotes={wish.quotes}
      />

      {/* Clean Footer: 'from Harshit Choudhary' */}
      <footer className="mt-auto py-16 bg-[#11223f] text-[#fef1ec] px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <p className="font-serif italic text-3xl text-[#fef1ec] tracking-wide mb-2">
            from Harshit Choudhary
          </p>
          <BotanicalDivider className="w-48 opacity-40 my-3" />
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#fef1ec]/50">
            HAROWISHEZ © {new Date().getFullYear()} — CELEBRATING {wish.name.toUpperCase()}
          </p>
        </div>
      </footer>
    </div>
  );
}

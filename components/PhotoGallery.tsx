'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { BotanicalDivider } from './BotanicalArtwork';

interface PhotoGalleryProps {
  name: string;
  pictures: string[];
}

export function PhotoGallery({ name, pictures = [] }: PhotoGalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (!pictures || pictures.length === 0) {
    return null;
  }

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev! + 1) % pictures.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev! - 1 + pictures.length) % pictures.length);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-16">
        <p className="eyebrow-label mb-3">MEMORIES & MOMENTS</p>
        <h2 className="font-serif font-normal text-3xl sm:text-5xl uppercase tracking-wider text-[#11223f]">
          {name}&apos;s Memory Gallery
        </h2>
        <p className="font-serif italic text-lg text-[#11223f]/70 mt-2">
          Capturing cherished moments, laughter, and timeless adventures
        </p>
        <BotanicalDivider className="my-4" />
      </div>

      {/* Responsive Editorial Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pictures.map((picUrl, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenLightbox(idx)}
            className="group relative cursor-pointer bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 border border-[#f6bba4]/40"
          >
            {/* Polaroid style white frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fef1ec]">
              <img
                src={picUrl}
                alt={`${name} memory photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback placeholder image if URL fails
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000';
                }}
              />
              <div className="absolute inset-0 bg-[#11223f]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 text-[#ff5734] p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Bottom caption */}
            <div className="pt-4 pb-1 text-center flex items-center justify-between">
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#11223f]/60 font-medium">
                PHOTO N° {idx + 1}
              </span>
              <Camera className="w-4 h-4 text-[#ff5734] opacity-70" />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 bg-[#11223f]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Close button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-50"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {pictures.length > 1 && (
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-50"
              title="Previous Photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Photo Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] bg-white p-3 sm:p-5 shadow-2xl flex flex-col items-center border border-[#f6bba4]"
          >
            <img
              src={pictures[activePhotoIndex]}
              alt={`${name} photo enlarged`}
              className="max-h-[70vh] w-auto object-contain bg-[#fef1ec]"
            />
            <div className="w-full pt-4 flex items-center justify-between px-2">
              <span className="font-serif italic text-lg text-[#11223f]">
                {name}&apos;s Memories ({activePhotoIndex + 1} of {pictures.length})
              </span>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#ff5734] font-medium">
                HAROWISHEZ GALLERY
              </span>
            </div>
          </div>

          {/* Next button */}
          {pictures.length > 1 && (
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-50"
              title="Next Photo"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { BotanicalCorner, BotanicalDivider } from '@/components/BotanicalArtwork';
import { 
  Plus, Trash2, Edit3, Copy, Check, Eye, Sparkles, Image as ImageIcon, 
  Heart, Calendar, User, RefreshCw, Music
} from 'lucide-react';
import { UserWishData } from '@/lib/seedData';

export default function HaroAdminPage() {
  const [wishes, setWishes] = useState<UserWishData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Form State
  const [editingHash, setEditingHash] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [birthdayDate, setBirthdayDate] = useState('2026-10-18');
  const [customHash, setCustomHash] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  // Dynamic Arrays for Wishes, Quotes, Pictures
  const [wishesList, setWishesList] = useState<string[]>([
    'May this new year bring boundless happiness and good health!',
    'Wishing you laughter, peace, and fulfilled dreams.',
    'Thank you for being such an extraordinary blessing in our lives.'
  ]);
  const [quotesList, setQuotesList] = useState<string[]>([
    'Count your life by smiles, not tears. Count your age by friends, not years.',
    'The best is yet to be.'
  ]);
  const [picturesList, setPicturesList] = useState<string[]>([
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000'
  ]);
  const [newPicUrl, setNewPicUrl] = useState('');

  // Fetch all relatives
  const fetchWishes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishes');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWishes(json.data);
      }
    } catch (err) {
      console.error('Error loading relative wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const generateHash = () => {
    const cleanName = (name || 'relative').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
    const rand = Math.random().toString(36).substring(2, 10);
    setCustomHash(`${cleanName}-${rand}`);
  };

  const handleEdit = (w: UserWishData) => {
    setEditingHash(w.hash);
    setName(w.name);
    setBirthdayDate(w.birthdayDate);
    setCustomHash(w.hash);
    setSongUrl(w.songUrl || '');
    setCustomMessage(w.customMessage || '');
    setWishesList(w.wishes && w.wishes.length > 0 ? w.wishes : ['']);
    setQuotesList(w.quotes && w.quotes.length > 0 ? w.quotes : ['']);
    setPicturesList(w.pictures && w.pictures.length > 0 ? w.pictures : []);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingHash(null);
    setName('');
    setBirthdayDate('2026-10-18');
    setCustomHash('');
    setSongUrl('');
    setCustomMessage('');
    setWishesList([
      'May this new year bring boundless happiness and good health!',
      'Wishing you laughter, peace, and fulfilled dreams.',
      'Thank you for being such an extraordinary blessing in our lives.'
    ]);
    setQuotesList([
      'Count your life by smiles, not tears. Count your age by friends, not years.',
      'The best is yet to be.'
    ]);
    setPicturesList([
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000'
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter recipient name');
      return;
    }

    setSubmitting(true);
    const finalHash = customHash.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.random().toString(36).substring(2, 8);

    const payload = {
      name,
      birthdayDate,
      hash: finalHash,
      songUrl,
      customMessage,
      wishes: wishesList.filter((w) => w.trim() !== ''),
      quotes: quotesList.filter((q) => q.trim() !== ''),
      pictures: picturesList.filter((p) => p.trim() !== ''),
    };

    try {
      const url = editingHash ? `/api/wishes/${editingHash}` : '/api/wishes';
      const method = editingHash ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        alert(editingHash ? 'Profile updated!' : 'New Birthday Wish Portal created!');
        resetForm();
        fetchWishes();
      } else {
        alert('Error: ' + json.error);
      }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (hashToDelete: string, recipientName: string) => {
    if (!confirm(`Delete ${recipientName}'s birthday portal?`)) return;

    try {
      const res = await fetch(`/api/wishes/${hashToDelete}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchWishes();
      } else {
        alert('Error: ' + json.error);
      }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const copyShareLink = (hash: string) => {
    const origin = window.location.origin;
    const link = `${origin}/#/${hash}`;
    navigator.clipboard.writeText(link);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleAddWish = () => setWishesList([...wishesList, '']);
  const handleWishChange = (idx: number, val: string) => {
    const updated = [...wishesList];
    updated[idx] = val;
    setWishesList(updated);
  };
  const handleRemoveWish = (idx: number) => setWishesList(wishesList.filter((_, i) => i !== idx));

  const handleAddQuote = () => setQuotesList([...quotesList, '']);
  const handleQuoteChange = (idx: number, val: string) => {
    const updated = [...quotesList];
    updated[idx] = val;
    setQuotesList(updated);
  };
  const handleRemoveQuote = (idx: number) => setQuotesList(quotesList.filter((_, i) => i !== idx));

  const handleAddPictureUrl = () => {
    if (newPicUrl.trim()) {
      setPicturesList([...picturesList, newPicUrl.trim()]);
      setNewPicUrl('');
    }
  };
  const handleRemovePicture = (idx: number) => setPicturesList(picturesList.filter((_, i) => i !== idx));

  return (
    <div className="min-h-screen bg-[#fef1ec] text-[#11223f] flex flex-col">
      <HeaderNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        
        <div className="text-center mb-12 relative">
          <p className="eyebrow-label mb-2">DEVELOPER SECRET ACCESS</p>
          <h1 className="font-serif font-normal text-4xl sm:text-6xl text-[#11223f] uppercase">
            HaroAdmin Studio
          </h1>
          <p className="font-serif italic text-lg text-[#11223f]/70 mt-2 max-w-xl mx-auto">
            Manage birthday wish portals, Spotify MP3 tracks, infinite pictures, and custom hash routes.
          </p>
          <BotanicalDivider className="my-4" />
        </div>

        {/* Creator Form */}
        <div className="bg-white p-6 sm:p-10 border border-[#f6bba4] mb-16 relative">
          <div className="flex items-center justify-between border-b border-[#f6bba4]/40 pb-4 mb-8">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-[#11223f] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff5734]" />
              <span>{editingHash ? `Edit ${name}'s Portal` : 'Create New Birthday Portal'}</span>
            </h2>
            {editingHash && (
              <button onClick={resetForm} className="text-xs font-sans tracking-widest text-[#ff5734] uppercase underline">
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-2">
                  Recipient Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#ff5734] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#fef1ec] border border-[#11223f]/30 pl-10 pr-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#ff5734]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-2">
                  Birthday Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#ff5734] absolute left-3 top-3.5" />
                  <input
                    type="date"
                    required
                    value={birthdayDate}
                    onChange={(e) => setBirthdayDate(e.target.value)}
                    className="w-full bg-[#fef1ec] border border-[#11223f]/30 pl-10 pr-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#ff5734]"
                  />
                </div>
              </div>
            </div>

            {/* Custom Hash Route Input */}
            <div className="bg-[#fef1ec] p-5 border border-[#f6bba4]/60">
              <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-2">
                Secret Hash Route (e.g. gdadjgajdgajjhchcjh)
              </label>
              <div className="flex gap-3 items-center">
                <span className="text-xs font-sans text-[#11223f]/60 font-semibold hidden sm:inline">
                  /#/
                </span>
                <input
                  type="text"
                  placeholder="gdadjgajdgajjhchcjh"
                  value={customHash}
                  onChange={(e) => setCustomHash(e.target.value)}
                  className="flex-1 bg-white border border-[#11223f]/30 px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-[#ff5734]"
                />
                <button
                  type="button"
                  onClick={generateHash}
                  className="btn-pill-outlined text-xs py-2 px-3 !normal-case"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Spotify MP3 Song Upload & Storage in MongoDB */}
            <div className="bg-[#fef1ec] p-5 border border-[#1DB954]/40 rounded-sm">
              <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-2">
                Spotify Player MP3 Audio File (Uploads & Stores in MongoDB)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* File Upload Button */}
                <div className="bg-white p-4 border border-[#f6bba4] rounded-sm">
                  <label className="btn-pill-filled text-xs py-2.5 px-4 cursor-pointer flex items-center justify-center gap-2 !bg-[#1DB954] !border-[#1DB954] w-full text-center">
                    <Music className="w-4 h-4" />
                    <span>Choose MP3 File From Computer</span>
                    <input
                      type="file"
                      accept="audio/mp3,audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const sizeFormatted = (file.size >= 1024 * 1024)
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : `${(file.size / 1024).toFixed(1)} KB`;

                          if (file.size > 20 * 1024 * 1024) {
                            alert(`Selected file is ${sizeFormatted}. Please select an MP3 file under 20MB.`);
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setSongUrl(result);
                              alert(`✅ Loaded "${file.name}" (${sizeFormatted}) successfully!`);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] font-sans text-[#11223f]/60 mt-2 text-center">
                    Encodes & saves MP3 file to MongoDB & local disk.
                  </p>
                </div>

                {/* Direct MP3 / Drive URL Input */}
                <div className="bg-white p-4 border border-[#f6bba4] rounded-sm">
                  <label className="block text-[11px] font-sans tracking-widest uppercase font-medium text-[#11223f] mb-1">
                    Or Paste Direct MP3 / Google Drive URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/song.mp3 or Drive link..."
                    value={songUrl.startsWith('data:') ? '' : songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    className="w-full bg-[#fef1ec] border border-[#11223f]/30 px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#1DB954]"
                  />
                  <p className="text-[11px] font-sans text-[#11223f]/60 mt-1">Google Drive share links automatically convert to audio stream URLs.</p>
                </div>
              </div>

              {/* MP3 Audio Preview Player */}
              {songUrl && (
                <div className="mt-4 pt-3 border-t border-[#1DB954]/30 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-[#1DB954]">
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#1DB954]">
                    <Music className="w-4 h-4 animate-bounce" />
                    <span>{songUrl.startsWith('data:') ? '✅ MP3 File Ready to Save' : '✅ MP3 URL Connected'}</span>
                  </div>
                  <audio controls src={songUrl.startsWith('data:') ? songUrl : undefined} className="h-8 max-w-full" />
                  <button
                    type="button"
                    onClick={() => setSongUrl('')}
                    className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
                  >
                    Clear Audio
                  </button>
                </div>
              )}
            </div>

            {/* Custom Personal Message */}
            <div>
              <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-2">
                Custom Love Note / Highlight Message
              </label>
              <textarea
                rows={2}
                placeholder="Write a special highlight note..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#fef1ec] border border-[#11223f]/30 p-4 font-serif italic text-base focus:outline-none focus:border-[#ff5734]"
              />
            </div>

            {/* Wishes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f]">
                  3-4 Personal Wishes
                </label>
                <button type="button" onClick={handleAddWish} className="text-xs font-sans text-[#ff5734] font-medium uppercase tracking-widest flex items-center gap-1 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Wish
                </button>
              </div>
              <div className="space-y-3">
                {wishesList.map((wish, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-sans text-[#ff5734] font-bold w-6">0{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Wish #${idx + 1}`}
                      value={wish}
                      onChange={(e) => handleWishChange(idx, e.target.value)}
                      className="flex-1 bg-[#fef1ec] border border-[#11223f]/30 px-4 py-2 font-sans text-sm focus:outline-none focus:border-[#ff5734]"
                    />
                    {wishesList.length > 1 && (
                      <button type="button" onClick={() => handleRemoveWish(idx)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Words For You (Quotes) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f]">
                  Words For You (Quotes)
                </label>
                <button type="button" onClick={handleAddQuote} className="text-xs font-sans text-[#ff5734] font-medium uppercase tracking-widest flex items-center gap-1 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Quote
                </button>
              </div>
              <div className="space-y-3">
                {quotesList.map((quote, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-sans text-[#e5ba2b] font-bold w-6">Q{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Quote #${idx + 1}`}
                      value={quote}
                      onChange={(e) => handleQuoteChange(idx, e.target.value)}
                      className="flex-1 bg-[#fef1ec] border border-[#11223f]/30 px-4 py-2 font-serif italic text-sm focus:outline-none focus:border-[#ff5734]"
                    />
                    {quotesList.length > 1 && (
                      <button type="button" onClick={() => handleRemoveQuote(idx)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite Pictures */}
            <div>
              <label className="block text-xs font-sans tracking-[0.2em] uppercase font-medium text-[#11223f] mb-3">
                Infinite Memory Pictures (Gallery & Marquee URLs)
              </label>

              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="Paste Image URL..."
                  value={newPicUrl}
                  onChange={(e) => setNewPicUrl(e.target.value)}
                  className="flex-1 bg-[#fef1ec] border border-[#11223f]/30 px-4 py-2 font-sans text-sm focus:outline-none focus:border-[#ff5734]"
                />
                <button type="button" onClick={handleAddPictureUrl} className="btn-pill-outlined text-xs py-2 px-4">
                  <ImageIcon className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {picturesList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {picturesList.map((pic, idx) => (
                    <div key={idx} className="relative group aspect-square bg-[#fef1ec] border border-[#f6bba4] overflow-hidden">
                      <img src={pic} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePicture(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#f6bba4]/40">
              <button type="button" onClick={resetForm} className="btn-pill-outlined text-xs py-3 px-6">
                Reset
              </button>
              <button type="submit" disabled={submitting} className="btn-pill-filled text-xs py-3 px-8">
                {submitting ? 'Saving...' : editingHash ? 'Update Wish Portal' : 'Publish Wish Portal'}
              </button>
            </div>

          </form>
        </div>

        {/* Database Relatives List */}
        <div className="bg-white p-6 sm:p-10 border border-[#f6bba4]">
          <div className="flex items-center justify-between border-b border-[#f6bba4]/40 pb-4 mb-8">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-[#11223f]">
              Portals in Database ({wishes.length})
            </h2>
            <button onClick={fetchWishes} className="text-xs font-sans text-[#ff5734] font-medium tracking-widest uppercase flex items-center gap-1 hover:underline">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#11223f]/60 font-serif italic text-lg">
              Loading portals...
            </div>
          ) : wishes.length === 0 ? (
            <div className="py-12 text-center text-[#11223f]/60 font-serif italic text-lg">
              No wish portals found in database. Create one above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishes.map((w) => (
                <div key={w.hash} className="p-6 bg-[#fef1ec] border border-[#f6bba4] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-[#ff5734] font-semibold">
                        /#/{w.hash}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#11223f] mb-1">
                      {w.name}
                    </h3>

                    <p className="font-sans text-xs text-[#11223f]/70 uppercase tracking-widest mb-4">
                      Birthday: {w.birthdayDate}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f6bba4]/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyShareLink(w.hash)}
                      className="p-2 bg-white text-[#11223f] hover:text-[#ff5734] border border-[#f6bba4] text-xs flex items-center gap-1"
                    >
                      {copiedHash === w.hash ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHash === w.hash ? 'Copied' : 'Copy Hash'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(w)} className="p-2 bg-white text-[#11223f] border border-[#f6bba4]">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <Link href={`/wishes/${w.hash}`} className="p-2 bg-[#ff5734] text-white border border-[#ff5734]">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(w.hash, w.name)} className="p-2 bg-white text-red-600 border border-red-200">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

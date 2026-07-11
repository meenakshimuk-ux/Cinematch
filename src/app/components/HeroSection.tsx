'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { MOVIES } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const FEATURED_IDS = ['movie-001', 'movie-011', 'movie-009', 'movie-017'];

export default function HeroSection() {
  const { user, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [current, setCurrent] = useState(0);

  const featuredMovies = FEATURED_IDS.map(id => MOVIES.find(m => m.id === id)!).filter(Boolean);
  const movie = featuredMovies[current];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % featuredMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  function handleWatchlistToggle() {
    if (!user) {
      toast.error('Sign in to save movies to your watchlist');
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast.success(`Removed "${movie.title}" from watchlist`);
    } else {
      addToWatchlist(movie.id);
      toast.success(`Added "${movie.title}" to watchlist`);
    }
  }

  return (
    <div className="relative h-[60vh] min-h-[480px] max-h-[680px] overflow-hidden">
      {/* Backdrop */}
      <AppImage
        src={movie.backdrop}
        alt={`${movie.title} backdrop scene`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        fallbackSrc="/assets/images/no_image.png"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-32 hero-gradient-bottom" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-12">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 w-full">
          <div className="max-w-2xl">
            {/* MPAA + Year */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold border border-muted-foreground text-muted-foreground px-2 py-0.5 rounded">
                {movie.mpaaRating}
              </span>
              <span className="text-sm text-muted-foreground">{movie.year}</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock size={13} /> {movie.runtime}m
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-primary text-sm italic mb-3 font-medium">{movie.tagline}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star size={20} fill="#f5c518" className="text-primary" />
                <span className="text-xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {movie.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 10</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(movie.voteCount / 1000000).toFixed(1)}M votes
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres.slice(0, 4).map(genre => (
                <span key={`hero-genre-${genre}`} className="genre-chip text-sm px-3 py-1">
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 max-w-lg">
              {movie.overview}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href={`/movie-detail?id=${movie.id}`}
                className="flex items-center gap-2 btn-primary"
              >
                <Play size={16} fill="currentColor" />
                View Details
              </Link>
              <button
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-2 btn-outline ${inWatchlist ? 'border-primary text-primary' : ''}`}
              >
                {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute right-6 bottom-1/2 translate-y-1/2 flex flex-col gap-2 hidden md:flex">
        <button
          onClick={() => setCurrent(c => (c - 1 + featuredMovies.length) % featuredMovies.length)}
          className="p-2 rounded-full bg-background/50 text-foreground hover:bg-background/80 transition-all border border-border"
          aria-label="Previous featured movie"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrent(c => (c + 1) % featuredMovies.length)}
          className="p-2 rounded-full bg-background/50 text-foreground hover:bg-background/80 transition-all border border-border"
          aria-label="Next featured movie"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, i) => (
          <button
            key={`hero-dot-${i}`}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-muted-foreground/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
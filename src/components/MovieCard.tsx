'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Plus, Check, Eye, Clock } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { Movie } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import { useTmdbPoster } from '@/hooks/useTmdbPoster';
import { toast } from 'sonner';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({ movie, size = 'md' }: MovieCardProps) {
  const { user, isInWatchlist, isWatched, addToWatchlist, removeFromWatchlist } = useApp();
  const [hovered, setHovered] = useState(false);

  const { poster } = useTmdbPoster({
    imdbId: movie.imdbId,
    title: movie.title,
    year: movie.year,
    staticPoster: movie.poster,
    staticBackdrop: movie.backdrop,
  });

  const inWatchlist = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  function handleWatchlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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

  const posterHeight = size === 'sm' ? 'h-48' : size === 'lg' ? 'h-80' : 'h-64';

  return (
    <Link href={`/movie-detail?id=${movie.id}`} className="block group">
      <div
        className="relative overflow-hidden rounded-xl card-hover cursor-pointer movie-card-gradient-border"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ isolation: 'isolate' }}
      >
        {/* Poster */}
        <div className={`relative ${posterHeight} w-full overflow-hidden rounded-xl bg-card z-10`}>
          <AppImage
            src={poster}
            alt={`${movie.title} movie poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackSrc="/assets/images/no_image.png"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 movie-card-overlay" />

          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 rating-badge rounded-md px-2 py-0.5">
            <Star size={11} fill="currentColor" />
            <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {movie.rating.toFixed(1)}
            </span>
          </div>

          {/* Watched badge */}
          {watched && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600 text-white rounded-md px-2 py-0.5">
              <Eye size={11} />
              <span className="text-xs font-bold">Seen</span>
            </div>
          )}

          {/* Hover overlay */}
          {hovered && (
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
              <div className="flex gap-2">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                    inWatchlist
                      ? 'bg-primary/20 text-primary border border-primary/30' :'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {inWatchlist ? <Check size={12} /> : <Plus size={12} />}
                  {inWatchlist ? 'Saved' : 'Watchlist'}
                </button>
              </div>
            </div>
          )}

          {/* Runtime badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/70 text-muted-foreground rounded px-1.5 py-0.5">
            <Clock size={10} />
            <span className="text-xs">{movie.runtime}m</span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-2 pb-1">
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors leading-tight">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{movie.year}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {movie.genres.slice(0, 2).map(genre => (
              <span key={`chip-${movie.id}-${genre}`} className="genre-chip">{genre}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
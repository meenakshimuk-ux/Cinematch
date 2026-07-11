'use client';

import React from 'react';
import { Star, Clock, Calendar, Globe, Plus, Check, Eye, EyeOff } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { Movie } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import { useTmdbPoster } from '@/hooks/useTmdbPoster';
import { toast } from 'sonner';

interface Props {
  movie: Movie;
}

export default function MovieDetailHero({ movie }: Props) {
  const { user, isInWatchlist, isWatched, addToWatchlist, removeFromWatchlist, markAsWatched, markAsUnwatched } = useApp();

  const { poster, backdrop } = useTmdbPoster({
    imdbId: movie.imdbId,
    title: movie.title,
    year: movie.year,
    staticPoster: movie.poster,
    staticBackdrop: movie.backdrop,
  });

  const inWatchlist = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  function handleWatchlist() {
    if (!user) { toast.error('Sign in to manage your watchlist'); return; }
    if (inWatchlist) { removeFromWatchlist(movie.id); toast.success(`Removed from watchlist`); }
    else { addToWatchlist(movie.id); toast.success(`Added to watchlist`); }
  }

  function handleWatched() {
    if (!user) { toast.error('Sign in to track watched movies'); return; }
    if (watched) { markAsUnwatched(movie.id); toast.success(`Marked as unwatched`); }
    else { markAsWatched(movie.id); toast.success(`Marked as watched! 🎬`); }
  }

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[380px] max-h-[520px] overflow-hidden">
        <AppImage
          src={backdrop}
          alt={`${movie.title} backdrop scene`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          fallbackSrc="/assets/images/no_image.png"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1c1c1e] via-[rgba(28,28,30,0.6)] to-transparent" />
      </div>

      {/* Content below backdrop */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16">
        <div className="flex flex-col md:flex-row gap-8 -mt-24 relative z-10">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-40 md:w-52 h-60 md:h-80 rounded-2xl overflow-hidden border-2 border-border shadow-2xl gold-glow">
              <AppImage
                src={poster}
                alt={`${movie.title} movie poster`}
                width={208}
                height={320}
                className="object-cover w-full h-full"
                fallbackSrc="/assets/images/no_image.png"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-8 pb-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-1">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-primary italic text-sm font-medium mb-4">{movie.tagline}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {movie.releaseDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} />
                {movie.language}
              </span>
              <span className="border border-muted-foreground text-muted-foreground px-2 py-0.5 rounded text-xs font-semibold">
                {movie.mpaaRating}
              </span>
              {movie.imdbId && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-xs font-semibold hover:bg-yellow-500/30 transition-colors"
                >
                  IMDb ↗
                </a>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-6 mb-5">
              <div className="flex items-center gap-2">
                <Star size={28} fill="#f5c518" className="text-primary" />
                <div>
                  <p className="text-3xl font-black text-primary leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {movie.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">{(movie.voteCount / 1000).toFixed(0)}K votes</p>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm font-semibold text-foreground">{movie.director}</p>
                <p className="text-xs text-muted-foreground">Director</p>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(genre => (
                <span key={`detail-genre-${genre}`} className="genre-chip text-xs px-3 py-1.5">
                  {genre}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleWatchlist}
                className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 text-sm ${
                  inWatchlist
                    ? 'bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30' :'btn-primary'
                }`}
              >
                {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                onClick={handleWatched}
                className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl border transition-all active:scale-95 text-sm ${
                  watched
                    ? 'bg-green-600/20 text-green-400 border-green-600/40 hover:bg-green-600/30' :'btn-outline'
                }`}
              >
                {watched ? <Eye size={16} /> : <EyeOff size={16} />}
                {watched ? 'Watched' : 'Mark as Watched'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
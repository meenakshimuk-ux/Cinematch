'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Eye, Star, Clock, Trash2, CheckCircle, Film, ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { MOVIES, Movie } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

type Tab = 'watchlist' | 'watched';
type SortBy = 'dateAdded' | 'title' | 'rating' | 'year';

export default function WatchlistScreen() {
  const {
    user,
    watchlist,
    watched,
    ratings,
    removeFromWatchlist,
    markAsWatched,
    markAsUnwatched,
    getUserRating,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('watchlist');
  const [sortBy, setSortBy] = useState<SortBy>('dateAdded');

  const watchlistMovies = useMemo(() =>
    MOVIES.filter(m => watchlist.includes(m.id)), [watchlist]);

  const watchedMovies = useMemo(() =>
    MOVIES.filter(m => watched.includes(m.id)), [watched]);

  const avgRating = useMemo(() => {
    const rated = Object.values(ratings);
    if (rated.length === 0) return null;
    return (rated.reduce((a, b) => a + b, 0) / rated.length).toFixed(1);
  }, [ratings]);

  function sortMovies(movies: Movie[]): Movie[] {
    const sorted = [...movies];
    switch (sortBy) {
      case 'title': sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'year': sorted.sort((a, b) => b.year - a.year); break;
      default: break; // dateAdded = original order
    }
    return sorted;
  }

  function handleRemove(movieId: string, title: string) {
    removeFromWatchlist(movieId);
    toast.success(`Removed "${title}" from watchlist`);
  }

  function handleMarkWatched(movieId: string, title: string) {
    markAsWatched(movieId);
    removeFromWatchlist(movieId);
    toast.success(`"${title}" marked as watched! 🎬`);
  }

  function handleMarkUnwatched(movieId: string, title: string) {
    markAsUnwatched(movieId);
    toast.success(`"${title}" moved back to unwatched`);
  }

  if (!user) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Bookmark size={28} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Sign in to view your watchlist</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Create a free account to save movies, track what you&apos;ve watched, and get personalized recommendations.
          </p>
          <Link href="/sign-up-login" className="btn-primary inline-flex items-center gap-2">
            <ArrowRight size={16} />
            Sign In or Create Account
          </Link>
        </div>
      </div>
    );
  }

  const displayMovies = sortMovies(activeTab === 'watchlist' ? watchlistMovies : watchedMovies);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">My Watchlist</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user.name.split(' ')[0]}</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Bookmark,
            label: 'Want to Watch',
            value: watchlist.length,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            icon: Eye,
            label: 'Movies Watched',
            value: watched.length,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
          },
          {
            icon: Star,
            label: 'Movies Rated',
            value: Object.keys(ratings).length,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
          },
          {
            icon: Film,
            label: 'Avg. Rating Given',
            value: avgRating ? `${avgRating}/10` : '—',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
          },
        ].map(stat => (
          <div key={`stat-${stat.label}`} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-black text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Sort */}
      <div className="flex items-center justify-between mb-6 border-b border-border pb-0">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'watchlist' ? 'tab-active' : 'tab-inactive'
            }`}
          >
            <Bookmark size={15} />
            Want to Watch
            {watchlist.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'watchlist' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {watchlist.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('watched')}
            className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'watched' ? 'tab-active' : 'tab-inactive'
            }`}
          >
            <Eye size={15} />
            Watched
            {watched.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'watched' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {watched.length}
              </span>
            )}
          </button>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="input-field text-sm py-1.5 px-3 w-auto mb-3"
        >
          <option value="dateAdded">Date Added</option>
          <option value="title">Title A–Z</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Movie Cards */}
      {displayMovies.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {displayMovies.map(movie => {
            const userRating = getUserRating(movie.id);
            return (
              <div
                key={`wl-${activeTab}-${movie.id}`}
                className="flex gap-4 bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-all group"
              >
                {/* Poster */}
                <Link href={`/movie-detail?id=${movie.id}`} className="flex-shrink-0">
                  <div className="w-16 h-24 rounded-xl overflow-hidden bg-muted">
                    <AppImage
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      width={64}
                      height={96}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/movie-detail?id=${movie.id}`}>
                        <h3 className="font-bold text-foreground hover:text-primary transition-colors truncate">
                          {movie.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{movie.year}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />{movie.runtime}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={11} className="text-primary" />{movie.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* User's rating */}
                    {userRating && (
                      <div className="flex items-center gap-1 rating-badge rounded-lg px-2 py-1 flex-shrink-0">
                        <Star size={11} fill="currentColor" />
                        <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{userRating}/10</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {movie.genres.slice(0, 3).map(genre => (
                      <span key={`wl-genre-${movie.id}-${genre}`} className="genre-chip">{genre}</span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{movie.overview}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
                  {activeTab === 'watchlist' && (
                    <>
                      <button
                        onClick={() => handleMarkWatched(movie.id, movie.title)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600/15 text-green-400 border border-green-600/30 hover:bg-green-600/25 transition-all whitespace-nowrap"
                        title="Mark as watched"
                      >
                        <CheckCircle size={13} />
                        Watched
                      </button>
                      <button
                        onClick={() => handleRemove(movie.id, movie.title)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-all"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </>
                  )}
                  {activeTab === 'watched' && (
                    <button
                      onClick={() => handleMarkUnwatched(movie.id, movie.title)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-muted/40 text-muted-foreground border border-border hover:text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
                      title="Move back to watchlist"
                    >
                      <Bookmark size={13} />
                      Re-add
                    </button>
                  )}
                  <Link
                    href={`/movie-detail?id=${movie.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
                  >
                    <Film size={13} />
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          {activeTab === 'watchlist' ? (
            <>
              <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-xl font-bold text-foreground mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Browse movies and hit the bookmark icon to save them here for later.
              </p>
              <Link href="/browse-filter" className="btn-primary inline-flex items-center gap-2">
                <Film size={16} />
                Discover Movies
              </Link>
            </>
          ) : (
            <>
              <Eye size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-xl font-bold text-foreground mb-2">No watched movies yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Mark movies as watched from your watchlist or directly from any movie detail page.
              </p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <Film size={16} />
                Explore Trending Movies
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
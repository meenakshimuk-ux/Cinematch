'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOVIES, GENRES, DECADES, Movie } from '@/data/movies';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import AppImage from '@/components/ui/AppImage';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import Link from 'next/link';

type ViewMode = 'grid' | 'list';

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title', label: 'Title A–Z' },
];

const PAGE_SIZE = 16;

export default function BrowseScreen() {
  const searchParams = useSearchParams();
  const initGenre = searchParams.get('genre') || 'All';
  const initSort = searchParams.get('sort') || 'popularity';

  const [activeGenre, setActiveGenre] = useState(initGenre === 'All' ? 'All' : initGenre);
  const [activeDecade, setActiveDecade] = useState('All');
  const [ratingMin, setRatingMin] = useState(0);
  const [sort, setSort] = useState(initSort);
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  const { user, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();

  const filtered = useMemo(() => {
    let results = [...MOVIES];
    if (activeGenre !== 'All') results = results.filter(m => m.genres.includes(activeGenre));
    if (activeDecade !== 'All') results = results.filter(m => m.decade === activeDecade);
    if (ratingMin > 0) results = results.filter(m => m.rating >= ratingMin);
    switch (sort) {
      case 'popularity': results.sort((a, b) => b.popularity - a.popularity); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'newest': results.sort((a, b) => b.year - a.year); break;
      case 'title': results.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return results;
  }, [activeGenre, activeDecade, ratingMin, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleGenreChange(genre: string) {
    setActiveGenre(genre);
    setPage(1);
  }

  function handleDecadeChange(decade: string) {
    setActiveDecade(decade);
    setPage(1);
  }

  function handleWatchlist(movie: Movie, e: React.MouseEvent) {
    e.preventDefault();
    if (!user) { toast.error('Sign in to manage your watchlist'); return; }
    if (isInWatchlist(movie.id)) { removeFromWatchlist(movie.id); toast.success(`Removed from watchlist`); }
    else { addToWatchlist(movie.id); toast.success(`Added "${movie.title}" to watchlist`); }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-foreground mb-1">Browse Movies</h1>
        <p className="text-muted-foreground text-sm">Explore our full collection — filter by genre, decade, and rating</p>
      </div>

      {/* Genre Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['All', ...GENRES].map(genre => (
          <button
            key={`browse-genre-${genre}`}
            onClick={() => handleGenreChange(genre)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGenre === genre
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-border'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Decade + Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 py-4 border-y border-border">
        {/* Decade pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <span className="text-xs text-muted-foreground font-medium flex-shrink-0 mr-1">Decade:</span>
          {['All', ...DECADES].map(decade => (
            <button
              key={`decade-${decade}`}
              onClick={() => handleDecadeChange(decade)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                activeDecade === decade
                  ? 'bg-primary/20 text-primary border-primary/40' :'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {decade}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {/* Rating filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Min Rating:</span>
            <select
              value={ratingMin}
              onChange={e => { setRatingMin(Number(e.target.value)); setPage(1); }}
              className="input-field text-xs py-1.5 px-2 w-24"
            >
              <option value={0}>Any</option>
              <option value={6}>6.0+</option>
              <option value={7}>7.0+</option>
              <option value={7.5}>7.5+</option>
              <option value={8}>8.0+</option>
              <option value={8.5}>8.5+</option>
              <option value={9}>9.0+</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="input-field text-xs py-1.5 px-2 w-36"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={`browse-sort-${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 transition-all ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition-all ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-5">
        Showing <span className="font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{filtered.length}</span> movies
        {activeGenre !== 'All' && <span> in <span className="text-primary font-medium">{activeGenre}</span></span>}
        {activeDecade !== 'All' && <span> from the <span className="text-primary font-medium">{activeDecade}</span></span>}
      </p>

      {/* Grid View */}
      {view === 'grid' && (
        isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {Array.from({ length: 16 }).map((_, i) => <MovieCardSkeleton key={`browse-skel-${i + 1}`} />)}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {paginated.map(movie => (
              <MovieCard key={`browse-grid-${movie.id}`} movie={movie} size="sm" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SlidersHorizontal size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No movies match these filters</h3>
            <p className="text-muted-foreground text-sm">Try adjusting the genre, decade, or rating filter.</p>
          </div>
        )
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-3">
          {paginated.map(movie => (
            <Link
              key={`browse-list-${movie.id}`}
              href={`/movie-detail?id=${movie.id}`}
              className="flex gap-4 bg-card rounded-2xl border border-border p-4 hover:border-primary/40 transition-all group"
            >
              {/* Poster thumbnail */}
              <div className="flex-shrink-0 w-16 h-24 rounded-xl overflow-hidden bg-muted">
                <AppImage
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  width={64}
                  height={96}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{movie.year}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />{movie.runtime}m
                      </span>
                      <span>{movie.director}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rating-badge rounded-lg px-2 py-1 flex-shrink-0">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{movie.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {movie.genres.slice(0, 3).map(genre => (
                    <span key={`list-genre-${movie.id}-${genre}`} className="genre-chip">{genre}</span>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Watchlist button */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={e => handleWatchlist(movie, e)}
                  className={`p-2 rounded-lg border transition-all ${
                    isInWatchlist(movie.id)
                      ? 'border-primary/40 bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  }`}
                  aria-label={isInWatchlist(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWatchlist(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}

          {paginated.length === 0 && (
            <div className="text-center py-20">
              <SlidersHorizontal size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No movies match these filters</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={`browse-page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    pageNum === page ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
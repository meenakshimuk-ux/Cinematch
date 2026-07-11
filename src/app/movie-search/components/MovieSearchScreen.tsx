'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOVIES } from '@/data/movies';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import FilterSidebar from './FilterSidebar';

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A–Z' },
];

const PAGE_SIZE = 12;

export interface Filters {
  genres: string[];
  yearMin: number;
  yearMax: number;
  ratingMin: number;
  language: string;
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  genres: [],
  yearMin: 1950,
  yearMax: 2024,
  ratingMin: 0,
  language: '',
  sort: 'popularity',
};

export default function MovieSearchScreen() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sync query state when URL search param changes (e.g. navigating from header search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInputValue(q);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [query, filters]);

  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue.trim());
  }

  const filtered = useMemo(() => {
    let results = [...MOVIES];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some(c => c.name.toLowerCase().includes(q)) ||
        m.genres.some(g => g.toLowerCase().includes(q))
      );
    }

    if (filters.genres.length > 0) {
      results = results.filter(m => filters.genres.some(g => m.genres.includes(g)));
    }

    results = results.filter(m => m.year >= filters.yearMin && m.year <= filters.yearMax);
    results = results.filter(m => m.rating >= filters.ratingMin);

    if (filters.language) {
      results = results.filter(m => m.language.toLowerCase().includes(filters.language.toLowerCase()));
    }

    switch (filters.sort) {
      case 'popularity': results.sort((a, b) => b.popularity - a.popularity); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'newest': results.sort((a, b) => b.year - a.year); break;
      case 'oldest': results.sort((a, b) => a.year - b.year); break;
      case 'title': results.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return results;
  }, [query, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = filters.genres.length +
    (filters.yearMin !== 1950 || filters.yearMax !== 2024 ? 1 : 0) +
    (filters.ratingMin > 0 ? 1 : 0) +
    (filters.language ? 1 : 0);

  function removeGenreFilter(genre: string) {
    setFilters(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Search by title, director, actor, or genre..."
          className="input-field pl-12 pr-32 py-4 text-base rounded-2xl"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => { setInputValue(''); setQuery(''); }}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm">
          Search
        </button>
      </form>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.genres.map(genre => (
            <span key={`active-filter-${genre}`} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
              {genre}
              <button onClick={() => removeGenreFilter(genre)} aria-label={`Remove ${genre} filter`}>
                <X size={11} />
              </button>
            </span>
          ))}
          {(filters.yearMin !== 1950 || filters.yearMax !== 2024) && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
              {filters.yearMin}–{filters.yearMax}
              <button onClick={() => setFilters(prev => ({ ...prev, yearMin: 1950, yearMax: 2024 }))} aria-label="Remove year filter"><X size={11} /></button>
            </span>
          )}
          {filters.ratingMin > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
              Rating ≥ {filters.ratingMin}
              <button onClick={() => setFilters(prev => ({ ...prev, ratingMin: 0 }))} aria-label="Remove rating filter"><X size={11} /></button>
            </span>
          )}
          <button onClick={resetFilters} className="px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-semibold hover:bg-secondary/25 transition-all">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:block flex-shrink-0 w-64 xl:w-72">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  sidebarOpen ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{filtered.length}</span> movies found
                {query && <span> for &ldquo;<span className="text-primary">{query}</span>&rdquo;</span>}
              </p>
            </div>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="input-field w-auto text-sm py-1.5 px-3 cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={`sort-${opt.value}`} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={`search-skel-${i + 1}`} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {paginated.map(movie => (
                <MovieCard key={`search-result-${movie.id}`} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No movies found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {query
                  ? `No results for "${query}" with the current filters. Try broadening your search or adjusting filters.`
                  : 'Adjust your filters to discover more movies.'}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="mt-4 btn-outline text-sm px-6">
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pageNum === page
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
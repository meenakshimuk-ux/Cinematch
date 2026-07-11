'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { getMoviesByGenre } from '@/data/movies';

const GENRE_TABS = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror'];

export default function GenreTabsSection() {
  const [activeGenre, setActiveGenre] = useState('Action');
  const movies = getMoviesByGenre(activeGenre, 8);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Film size={20} className="text-primary" />
        <h2 className="section-header">Browse by Genre</h2>
      </div>
      {/* Genre Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {GENRE_TABS?.map(genre => (
          <button
            key={`genre-tab-${genre}`}
            onClick={() => setActiveGenre(genre)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGenre === genre
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {movies?.map(movie => (
          <MovieCard key={`genre-movie-${movie?.id}`} movie={movie} size="sm" />
        ))}
      </div>
      {movies?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Film size={40} className="mx-auto mb-3 opacity-40" />
          <p>No {activeGenre} movies found in the current collection.</p>
        </div>
      )}
      <div className="mt-4 text-center">
        <Link
          href={`/browse-filter?genre=${activeGenre}`}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          See all {activeGenre} movies →
        </Link>
      </div>
    </section>
  );
}
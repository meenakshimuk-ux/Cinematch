'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Movie } from '@/data/movies';
import MovieCard from '@/components/MovieCard';

interface Props {
  movies: Movie[];
  currentGenres: string[];
}

export default function SimilarMoviesRow({ movies, currentGenres }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  }

  if (movies.length === 0) return null;

  const primaryGenre = currentGenres[0];

  return (
    <section className="border-t border-border pt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <h2 className="section-header text-lg">
            Because you&apos;re watching <span className="text-primary">{primaryGenre}</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {movies.map(movie => (
          <div key={`similar-${movie.id}`} className="flex-shrink-0 w-40 md:w-44">
            <MovieCard movie={movie} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
}
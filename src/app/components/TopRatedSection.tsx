'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { getTopRatedMovies } from '@/data/movies';

const topRated = getTopRatedMovies(10);

export default function TopRatedSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-primary" />
          <h2 className="section-header">Top Rated</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
          <Link href="/browse-filter" className="text-sm text-primary hover:text-primary/80 font-medium ml-2 transition-colors">
            View All →
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {topRated.map((movie, i) => (
          <div key={`top-rated-${movie.id}`} className="flex-shrink-0 w-44 md:w-48 relative">
            <div className="absolute -top-1 -left-1 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black shadow-lg">
              {i + 1}
            </div>
            <MovieCard movie={movie} size="md" />
          </div>
        ))}
      </div>
    </section>
  );
}
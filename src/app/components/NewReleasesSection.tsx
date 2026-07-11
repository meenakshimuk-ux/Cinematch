'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { getNewReleases } from '@/data/movies';

const newReleases = getNewReleases(10);

export default function NewReleasesSection() {
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
          <Sparkles size={20} className="text-primary" />
          <h2 className="section-header">New Releases</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
          <Link href="/browse-filter?sort=newest" className="text-sm text-primary hover:text-primary/80 font-medium ml-2 transition-colors">
            View All →
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {newReleases.map(movie => (
          <div key={`new-release-${movie.id}`} className="flex-shrink-0 w-44 md:w-48">
            <MovieCard movie={movie} size="md" />
          </div>
        ))}
      </div>
    </section>
  );
}
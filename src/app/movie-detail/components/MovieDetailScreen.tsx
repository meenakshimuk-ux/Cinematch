'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOVIES, getSimilarMovies } from '@/data/movies';
import MovieDetailHero from './MovieDetailHero';
import MovieDetailTabs from './MovieDetailTabs';
import SimilarMoviesRow from './SimilarMoviesRow';

export default function MovieDetailScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get('id') || 'movie-001';
  const movie = MOVIES?.find(m => m?.id === id) || MOVIES?.[0];
  const similar = getSimilarMovies(movie, 8);

  return (
    <div>
      {/* key={movie.id} forces full remount of MovieDetailHero when movie changes,
          ensuring poster/backdrop state is always fresh for the new movie */}
      <MovieDetailHero key={movie?.id} movie={movie} />
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-10 space-y-12">
        <MovieDetailTabs movie={movie} />
        <SimilarMoviesRow movies={similar} currentGenres={movie?.genres} />
      </div>
    </div>
  );
}
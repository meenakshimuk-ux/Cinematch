'use client';

import { useState, useEffect } from 'react';
import { fetchPosterData, PosterResult } from '@/lib/tmdbPosterService';

interface UseTmdbPosterOptions {
  imdbId?: string;
  title?: string;
  year?: number;
  staticPoster: string;
  staticBackdrop: string;
}

/**
 * Hook that returns the best available poster/backdrop for a movie.
 * If NEXT_PUBLIC_TMDB_API_KEY is set, it fetches from TMDB using the IMDb ID.
 * Otherwise it falls back to the static URL already stored in the movie data.
 */
export function useTmdbPoster({
  imdbId,
  title,
  year,
  staticPoster,
  staticBackdrop,
}: UseTmdbPosterOptions) {
  const FALLBACK = '/assets/images/no_image.png';
  const safePoster = staticPoster || FALLBACK;
  const safeBackdrop = staticBackdrop || FALLBACK;

  // Always reset to the new movie's static values immediately when movie changes
  const [poster, setPoster] = useState(safePoster);
  const [backdrop, setBackdrop] = useState(safeBackdrop);
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset images synchronously when the static URLs change (new movie selected)
  useEffect(() => {
    setPoster(safePoster);
    setBackdrop(safeBackdrop);
    setTmdbId(null);
  }, [safePoster, safeBackdrop]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    // Only fetch dynamically if API key is configured AND the static poster
    // is NOT already a TMDB URL (meaning it's a placeholder or old URL)
    const needsDynamicFetch =
      apiKey &&
      apiKey !== 'YOUR_TMDB_API_KEY_HERE' && !safePoster.startsWith('https://image.tmdb.org');

    if (!needsDynamicFetch) return;

    let cancelled = false;
    setLoading(true);

    fetchPosterData(apiKey!, imdbId, title, year).then((result: PosterResult) => {
      if (cancelled) return;
      if (result.poster && result.poster !== FALLBACK) {
        setPoster(result.poster);
      }
      if (result.backdrop && result.backdrop !== FALLBACK) {
        setBackdrop(result.backdrop);
      }
      setTmdbId(result.tmdbId);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [imdbId, title, year, safePoster]);

  return { poster, backdrop, tmdbId, loading };
}

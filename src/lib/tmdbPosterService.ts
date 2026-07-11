'use client';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const PLACEHOLDER_POSTER = '/assets/images/no_image.png';

// In-memory cache for poster URLs
const posterCache = new Map<string, { poster: string; backdrop: string; tmdbId: number | null; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export interface PosterResult {
  poster: string;
  backdrop: string;
  tmdbId: number | null;
  fromCache: boolean;
}

function getCacheKey(imdbId?: string, title?: string, year?: number): string {
  return imdbId || `${title}-${year}`;
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Build TMDB image URL at desired width (w500 or w780 for posters, w1280 for backdrops)
 */
export function buildTmdbImageUrl(path: string | null | undefined, size: 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Fetch poster data from TMDB using IMDb ID (primary) or title+year (fallback)
 */
export async function fetchPosterData(
  apiKey: string,
  imdbId?: string,
  title?: string,
  year?: number
): Promise<PosterResult> {
  const cacheKey = getCacheKey(imdbId, title, year);
  const cached = posterCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return { ...cached, fromCache: true };
  }

  try {
    let tmdbId: number | null = null;
    let posterPath: string | null = null;
    let backdropPath: string | null = null;

    // Strategy 1: Look up by IMDb ID
    if (imdbId) {
      const findRes = await fetch(
        `${TMDB_API_BASE}/find/${imdbId}?api_key=${apiKey}&external_source=imdb_id`
      );
      if (findRes.ok) {
        const findData = await findRes.json();
        const movieResult = findData.movie_results?.[0];
        if (movieResult) {
          tmdbId = movieResult.id;
          posterPath = movieResult.poster_path;
          backdropPath = movieResult.backdrop_path;
        }
      }
    }

    // Strategy 2: Search by title + year if IMDb lookup failed
    if (!posterPath && title) {
      const searchParams = new URLSearchParams({
        api_key: apiKey,
        query: title,
        ...(year ? { year: String(year) } : {}),
      });
      const searchRes = await fetch(`${TMDB_API_BASE}/search/movie?${searchParams}`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results: Array<{ id: number; poster_path: string | null; backdrop_path: string | null; release_date?: string; title?: string }> = searchData.results || [];
        // Find best match: prefer exact year match
        const match = results.find(r => {
          const releaseYear = r.release_date ? parseInt(r.release_date.slice(0, 4)) : null;
          return releaseYear === year;
        }) || results[0];
        if (match) {
          tmdbId = match.id;
          posterPath = match.poster_path;
          backdropPath = match.backdrop_path;
        }
      }
    }

    const poster = buildTmdbImageUrl(posterPath, 'w500');
    const backdrop = buildTmdbImageUrl(backdropPath, 'w1280');

    const result = { poster, backdrop, tmdbId, timestamp: Date.now() };
    posterCache.set(cacheKey, result);

    if (!posterPath) {
      console.warn(`[CineMatch] Poster not found for: ${imdbId || title} (${year})`);
    }

    return { ...result, fromCache: false };
  } catch (err) {
    console.error(`[CineMatch] Failed to fetch poster for ${imdbId || title}:`, err);
    return {
      poster: PLACEHOLDER_POSTER,
      backdrop: PLACEHOLDER_POSTER,
      tmdbId: null,
      fromCache: false,
    };
  }
}

/**
 * Validate that a poster URL is accessible (basic check)
 */
export function isValidPosterUrl(url: string): boolean {
  return url.startsWith('https://image.tmdb.org') || url.startsWith('/assets/images/');
}

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Star, Heart, Zap, Film, Lock } from 'lucide-react';
import { MOVIES, getTopRatedMovies, getTrendingMovies, getSimilarMovies, Movie } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import MovieCard from '@/components/MovieCard';

// ─── Section component ────────────────────────────────────────────────────────
interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  movies: Movie[];
  accentColor?: string;
}

function RecommendationSection({ icon, title, subtitle, movies, accentColor = 'text-primary' }: SectionProps) {
  if (movies.length === 0) return null;
  return (
    <section>
      <div className="flex items-start gap-3 mb-5">
        <div className={`mt-0.5 ${accentColor}`}>{icon}</div>
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.slice(0, 6).map(movie => (
          <MovieCard key={`rec-${title}-${movie.id}`} movie={movie} size="sm" />
        ))}
      </div>
    </section>
  );
}

// ─── Taste profile pill ───────────────────────────────────────────────────────
function TastePill({ label, count }: { label: string; count: number }) {
  return (
    <Link
      href={`/browse-filter?genre=${encodeURIComponent(label)}`}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</span>
      <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">{count}</span>
    </Link>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function RecommendationsScreen() {
  const { user, watchlist, watched, ratings } = useApp();

  // Derive user taste from watchlist + watched + ratings
  const tasteProfile = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    const interactedIds = new Set([...watchlist, ...watched, ...Object.keys(ratings)]);

    interactedIds.forEach(id => {
      const movie = MOVIES.find(m => m.id === id);
      if (movie) {
        movie.genres.forEach(g => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [watchlist, watched, ratings]);

  const topGenres = tasteProfile.map(([g]) => g);

  // Personalized: movies matching user's top genres, not yet watched
  const personalizedPicks = useMemo(() => {
    if (topGenres.length === 0) return [];
    return MOVIES
      .filter(m => !watched.includes(m.id))
      .map(m => ({
        movie: m,
        score: m.genres.filter(g => topGenres.includes(g)).length * 2 + m.rating / 10,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.movie);
  }, [topGenres, watched]);

  // Because you watched X — based on most recently watched
  const becauseYouWatched = useMemo(() => {
    if (watched.length === 0) return { seed: null, movies: [] };
    const seedId = watched[watched.length - 1];
    const seed = MOVIES.find(m => m.id === seedId);
    if (!seed) return { seed: null, movies: [] };
    const similar = getSimilarMovies(seed, 7).filter(m => !watched.includes(m.id));
    return { seed, movies: similar.slice(0, 6) };
  }, [watched]);

  // Hidden gems: high rating, lower popularity, not watched
  const hiddenGems = useMemo(() => {
    return MOVIES
      .filter(m => m.rating >= 8.0 && m.popularity < 85 && !watched.includes(m.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [watched]);

  // Trending picks not yet watched
  const trendingPicks = useMemo(() => {
    return getTrendingMovies(12).filter(m => !watched.includes(m.id)).slice(0, 6);
  }, [watched]);

  // Top rated not yet watched
  const topRatedPicks = useMemo(() => {
    return getTopRatedMovies(12).filter(m => !watched.includes(m.id)).slice(0, 6);
  }, [watched]);

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16">

        {/* ── Page header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isLoggedIn ? `Your Recommendations, ${user.name.split(' ')[0]}` : 'Recommendations Hub'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isLoggedIn
                  ? 'Curated picks based on your taste and watch history' :'Sign in to unlock personalized recommendations'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Taste profile (logged in only) ── */}
        {isLoggedIn && tasteProfile.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Heart size={16} className="text-secondary" />
              <h2 className="text-sm font-semibold text-foreground">Your Taste Profile</h2>
              <span className="text-xs text-muted-foreground ml-1">— based on your activity</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tasteProfile.map(([genre, count]) => (
                <TastePill key={`taste-${genre}`} label={genre} count={count} />
              ))}
            </div>
          </div>
        )}

        {/* ── Sign-in prompt (logged out) ── */}
        {!isLoggedIn && (
          <div className="mb-10 p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lock size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Unlock Personalized Picks</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to get recommendations tailored to your genre preferences, watch history, and ratings.
              </p>
            </div>
            <Link href="/sign-up-login" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
              Sign In
            </Link>
          </div>
        )}

        <div className="space-y-14">

          {/* ── Personalized picks (logged in + has taste) ── */}
          {isLoggedIn && personalizedPicks.length > 0 && (
            <RecommendationSection
              icon={<Sparkles size={20} />}
              title="Picked For You"
              subtitle={`Based on your love of ${topGenres.slice(0, 3).join(', ')}`}
              movies={personalizedPicks}
              accentColor="text-primary"
            />
          )}

          {/* ── Because you watched ── */}
          {isLoggedIn && becauseYouWatched.seed && becauseYouWatched.movies.length > 0 && (
            <RecommendationSection
              icon={<Film size={20} />}
              title={`Because You Watched "${becauseYouWatched.seed.title}"`}
              subtitle="Movies with a similar feel and genre mix"
              movies={becauseYouWatched.movies}
              accentColor="text-blue-400"
            />
          )}

          {/* ── Hidden gems ── */}
          {hiddenGems.length > 0 && (
            <RecommendationSection
              icon={<Zap size={20} />}
              title="Hidden Gems"
              subtitle="Critically acclaimed films that deserve more attention"
              movies={hiddenGems}
              accentColor="text-amber-400"
            />
          )}

          {/* ── Trending ── */}
          {trendingPicks.length > 0 && (
            <RecommendationSection
              icon={<TrendingUp size={20} />}
              title="Trending Right Now"
              subtitle="What everyone is watching this week"
              movies={trendingPicks}
              accentColor="text-secondary"
            />
          )}

          {/* ── Top rated ── */}
          {topRatedPicks.length > 0 && (
            <RecommendationSection
              icon={<Star size={20} />}
              title="All-Time Greats"
              subtitle="The highest rated films in our collection"
              movies={topRatedPicks}
              accentColor="text-yellow-400"
            />
          )}

        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { DollarSign, Globe, Flag, Film } from 'lucide-react';
import { Movie } from '@/data/movies';
import StarRating from './StarRating';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

interface Props {
  movie: Movie;
}

function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export default function OverviewTab({ movie }: Props) {
  const { user, getUserRating, rateMovie } = useApp();
  const userRating = getUserRating(movie.id);

  function handleRate(rating: number) {
    if (!user) { toast.error('Sign in to rate movies'); return; }
    rateMovie(movie.id, rating);
    toast.success(`You rated "${movie.title}" ${rating}/10`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Overview */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">Plot Overview</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{movie.overview}</p>
        </div>

        {/* Your Rating */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Your Rating</h4>
          {user ? (
            <div>
              <StarRating
                value={userRating || 0}
                max={10}
                interactive
                onRate={handleRate}
              />
              {userRating && (
                <p className="text-xs text-muted-foreground mt-2">
                  You rated this <span className="text-primary font-bold">{userRating}/10</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              <a href="/sign-up-login" className="text-primary hover:underline">Sign in</a> to rate this movie
            </p>
          )}
        </div>

        {/* Writers */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Written by</h4>
          <div className="flex flex-wrap gap-2">
            {movie.writers.map(writer => (
              <span key={`writer-${writer}`} className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground">
                {writer}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Technical Details */}
      <div className="space-y-4">
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Movie Details</h3>

          {[
            { icon: Film, label: 'Status', value: movie.status },
            { icon: Globe, label: 'Language', value: movie.language },
            { icon: Flag, label: 'Country', value: movie.country },
          ].map(item => (
            <div key={`detail-${item.label}`} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          ))}

          {movie.budget > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-medium text-foreground">{formatMoney(movie.budget)}</p>
              </div>
            </div>
          )}

          {movie.revenue > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <DollarSign size={15} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Box Office</p>
                <p className="text-sm font-medium text-green-400">{formatMoney(movie.revenue)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Popularity */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popularity Score</h4>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-black text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {movie.popularity.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground mb-1">/ 100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${movie.popularity}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
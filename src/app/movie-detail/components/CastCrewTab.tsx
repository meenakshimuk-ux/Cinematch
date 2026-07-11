'use client';

import React from 'react';
import { Movie } from '@/data/movies';
import AppImage from '@/components/ui/AppImage';
import { User } from 'lucide-react';

interface Props {
  movie: Movie;
}

export default function CastCrewTab({ movie }: Props) {
  return (
    <div className="space-y-8">
      {/* Cast */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Cast</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {movie.cast.map(member => (
            <div key={member.id} className="flex-shrink-0 w-28 text-center group cursor-pointer">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-border mb-2 bg-card group-hover:border-primary/50 transition-all">
                <AppImage
                  src={member.photo}
                  alt={`${member.name} portrait`}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{member.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crew */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Crew</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Director */}
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Director</p>
              <p className="text-sm font-semibold text-foreground">{movie.director}</p>
            </div>
          </div>

          {/* Writers */}
          {movie.writers.map((writer, i) => (
            <div key={`crew-writer-${i}`} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {i === 0 ? 'Writer' : 'Co-Writer'}
                </p>
                <p className="text-sm font-semibold text-foreground">{writer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
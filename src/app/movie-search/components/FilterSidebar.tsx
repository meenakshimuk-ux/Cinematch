'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GENRES } from '@/data/movies';
import { Filters } from './MovieSearchScreen';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const LANGUAGES = ['English', 'Korean', 'Japanese', 'French', 'Spanish', 'German', 'Italian'];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3 hover:text-primary transition-colors"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange }: Props) {
  function toggleGenre(genre: string) {
    onChange({
      ...filters,
      genres: filters.genres.includes(genre)
        ? filters.genres.filter(g => g !== genre)
        : [...filters.genres, genre],
    });
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground">Filters</h3>
        <button
          onClick={() => onChange({ genres: [], yearMin: 1950, yearMax: 2024, ratingMin: 0, language: '', sort: filters.sort })}
          className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
        >
          Reset all
        </button>
      </div>

      {/* Genre */}
      <Section title="Genre">
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {GENRES.map(genre => (
            <label key={`filter-genre-${genre}`} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.genres.includes(genre)}
                onChange={() => toggleGenre(genre)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Year Range */}
      <Section title="Release Year">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{filters.yearMin}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{filters.yearMax}</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <input
                type="range"
                min={1950}
                max={2024}
                value={filters.yearMin}
                onChange={e => onChange({ ...filters, yearMin: Math.min(Number(e.target.value), filters.yearMax) })}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <input
                type="range"
                min={1950}
                max={2024}
                value={filters.yearMax}
                onChange={e => onChange({ ...filters, yearMax: Math.max(Number(e.target.value), filters.yearMin) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Min Rating */}
      <Section title="Minimum Rating">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Any</span>
            <span className="text-primary font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {filters.ratingMin > 0 ? `${filters.ratingMin}+` : 'All ratings'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={9}
            step={0.5}
            value={filters.ratingMin}
            onChange={e => onChange({ ...filters, ratingMin: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>9.0</span>
          </div>
        </div>
      </Section>

      {/* Language */}
      <Section title="Language" defaultOpen={false}>
        <select
          value={filters.language}
          onChange={e => onChange({ ...filters, language: e.target.value })}
          className="input-field text-sm py-2"
        >
          <option value="">All languages</option>
          {LANGUAGES.map(lang => (
            <option key={`lang-${lang}`} value={lang}>{lang}</option>
          ))}
        </select>
      </Section>
    </div>
  );
}
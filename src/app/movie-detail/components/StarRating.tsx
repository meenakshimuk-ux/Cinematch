'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  max?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ value, max = 10, interactive = false, onRate, size = 22 }: Props) {
  const [hovered, setHovered] = useState(0);

  const display = hovered > 0 ? hovered : value;
  const stars = Math.min(max, 10);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: stars }).map((_, i) => {
        const starVal = i + 1;
        const filled = starVal <= display;
        return (
          <button
            key={`star-${i + 1}`}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starVal)}
            onMouseEnter={() => interactive && setHovered(starVal)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}`}
            aria-label={`Rate ${starVal} out of ${max}`}
          >
            <Star
              size={size}
              fill={filled ? '#f5c518' : 'transparent'}
              className={filled ? 'text-primary' : 'text-muted'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}/{max}
        </span>
      )}
    </div>
  );
}
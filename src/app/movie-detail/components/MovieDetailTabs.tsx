'use client';

import React, { useState } from 'react';
import { Movie } from '@/data/movies';
import OverviewTab from './OverviewTab';
import CastCrewTab from './CastCrewTab';
import ReviewsTab from './ReviewsTab';

interface Props {
  movie: Movie;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'cast', label: 'Cast & Crew' },
  { id: 'reviews', label: 'Reviews' },
];

export default function MovieDetailTabs({ movie }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex border-b border-border mb-7 gap-6 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={`detail-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-semibold flex-shrink-0 transition-all ${
              activeTab === tab.id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab movie={movie} />}
      {activeTab === 'cast' && <CastCrewTab movie={movie} />}
      {activeTab === 'reviews' && <ReviewsTab movie={movie} />}
    </div>
  );
}
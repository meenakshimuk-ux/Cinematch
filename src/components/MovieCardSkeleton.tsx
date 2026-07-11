import React from 'react';

interface MovieCardSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function MovieCardSkeleton({ size = 'md' }: MovieCardSkeletonProps) {
  const posterHeight = size === 'sm' ? 'h-48' : size === 'lg' ? 'h-80' : 'h-64';
  return (
    <div className="rounded-xl overflow-hidden">
      <div className={`${posterHeight} w-full skeleton-pulse rounded-xl`} />
      <div className="pt-2 space-y-2">
        <div className="h-4 skeleton-pulse rounded w-3/4" />
        <div className="h-3 skeleton-pulse rounded w-1/4" />
        <div className="flex gap-1">
          <div className="h-4 w-14 skeleton-pulse rounded-full" />
          <div className="h-4 w-14 skeleton-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
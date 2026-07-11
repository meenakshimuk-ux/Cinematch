'use client';

import dynamic from 'next/dynamic';

const RecommendationsScreen = dynamic(
  () => import('./components/RecommendationsScreen'),
  { ssr: false }
);

export default function RecommendationsPage() {
  return <RecommendationsScreen />;
}

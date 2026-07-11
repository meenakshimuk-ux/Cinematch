import React, { Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import MovieDetailScreen from './components/MovieDetailScreen';

export default function MovieDetailPage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
            <MovieDetailScreen />
          </Suspense>
        </main>
      </div>
    </AppProvider>
  );
}
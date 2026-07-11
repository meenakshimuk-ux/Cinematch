import React, { Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import MovieSearchScreen from './components/MovieSearchScreen';

export default function MovieSearchPage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
            <MovieSearchScreen />
          </Suspense>
        </main>
      </div>
    </AppProvider>
  );
}
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import WatchlistScreen from './components/WatchlistScreen';

export default function WatchlistPage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <WatchlistScreen />
        </main>
      </div>
    </AppProvider>
  );
}
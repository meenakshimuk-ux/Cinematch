import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import TrendingSection from './components/TrendingSection';
import TopRatedSection from './components/TopRatedSection';
import GenreTabsSection from './components/GenreTabsSection';
import NewReleasesSection from './components/NewReleasesSection';

export default function HomePage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <HeroSection />
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 space-y-14 pb-20">
            <TrendingSection />
            <TopRatedSection />
            <GenreTabsSection />
            <NewReleasesSection />
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
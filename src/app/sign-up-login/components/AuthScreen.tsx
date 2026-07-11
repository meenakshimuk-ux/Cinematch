'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AppLogo from '@/components/ui/AppLogo';
import { Film, Star, Bookmark, TrendingUp } from 'lucide-react';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 40%, #0f0f1a 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-primary" />
          <div className="absolute top-40 left-40 w-48 h-48 rounded-full border border-primary" />
          <div className="absolute bottom-32 right-24 w-80 h-80 rounded-full border-2 border-primary" />
          <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full border border-primary" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <AppLogo size={44} />
          <span className="font-bold text-2xl tracking-tight text-foreground">
            Cine<span className="text-gold">Match</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
              Your personal<br />
              <span className="text-gold">movie guide</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              Discover films tailored to your taste. Track what you&apos;ve seen, save what you want to watch, and get recommendations that actually match your vibe.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: 'Personalized recommendations based on your ratings' },
              { icon: Bookmark, text: 'Build and manage your watchlist across devices' },
              { icon: Star, text: 'Rate and review movies with your own voice' },
              { icon: Film, text: 'Browse 930K+ movies with powerful filters' },
            ]?.map((item, i) => (
              <div key={`feature-${i}`} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon size={17} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item?.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex gap-8 relative z-10">
          {[
            { value: '930K+', label: 'Movies' },
            { value: '50K+', label: 'Reviews' },
            { value: '2M+', label: 'Ratings' },
          ]?.map(stat => (
            <div key={`stat-${stat?.label}`}>
              <p className="text-xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <AppLogo size={36} />
          <span className="font-bold text-xl text-foreground">
            Cine<span className="text-gold">Match</span>
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="w-full max-w-md">
          <div className="flex rounded-xl overflow-hidden border border-border mb-8 bg-card">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
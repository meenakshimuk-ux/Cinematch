'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bookmark, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import AppLogo from '@/components/ui/AppLogo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse-filter', label: 'Browse' },
  { href: '/recommendations', label: 'For You' },
  { href: '/movie-search', label: 'Search' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, watchlist } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movie-search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-nav" style={{ backgroundColor: 'rgba(28,28,30,0.95)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <AppLogo size={32} />
              <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
                Cine<span className="text-gold">Match</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <Link
                  key={`nav-${link.href}`}
                  href={link.href}
                  className={`nav-link transition-colors ${
                    pathname === link.href ? 'nav-link-active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>

              {/* Watchlist */}
              {user && (
                <Link
                  href="/watchlist"
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                  aria-label="Watchlist"
                >
                  <Bookmark size={18} />
                  {watchlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                      {watchlist.length > 9 ? '9+' : watchlist.length}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted/40 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.avatar}
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:block max-w-24 truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-2xl py-1 z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-600 text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/watchlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Bookmark size={15} />
                        My Watchlist
                        {watchlist.length > 0 && (
                          <span className="ml-auto text-xs bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
                            {watchlist.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-up-login"
                  className="hidden sm:flex items-center gap-1.5 btn-primary text-sm py-1.5 px-4"
                >
                  <User size={14} />
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Expand */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search movies, directors, actors..."
                  className="input-field pl-9 pr-4"
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card/95">
            <nav className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={`mobile-nav-${link.href}`}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/sign-up-login"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={15} />
                  Sign In / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
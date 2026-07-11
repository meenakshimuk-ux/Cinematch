'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  favoriteGenres: string[];
  memberSince: string;
  avatar: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

interface AppState {
  user: User | null;
  watchlist: string[];
  watched: string[];
  ratings: Record<string, number>;
  reviews: Review[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, genres: string[]) => void;
  addToWatchlist: (movieId: string) => void;
  removeFromWatchlist: (movieId: string) => void;
  markAsWatched: (movieId: string) => void;
  markAsUnwatched: (movieId: string) => void;
  rateMovie: (movieId: string, rating: number) => void;
  addReview: (movieId: string, rating: number, text: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  isWatched: (movieId: string) => boolean;
  getUserRating: (movieId: string) => number | null;
}

const AppContext = createContext<AppContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'alex.chen@cinematch.io': {
    password: 'Cine2024!',
    user: {
      id: 'user-001',
      name: 'Alex Chen',
      email: 'alex.chen@cinematch.io',
      favoriteGenres: ['Sci-Fi', 'Thriller', 'Drama'],
      memberSince: 'January 2024',
      avatar: 'AC',
    },
  },
  'sofia.reyes@cinematch.io': {
    password: 'Movies99#',
    user: {
      id: 'user-002',
      name: 'Sofia Reyes',
      email: 'sofia.reyes@cinematch.io',
      favoriteGenres: ['Romance', 'Comedy', 'Drama'],
      memberSince: 'March 2024',
      avatar: 'SR',
    },
  },
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-001',
    movieId: 'movie-001',
    userId: 'user-001',
    userName: 'Alex Chen',
    rating: 10,
    text: 'Heath Ledger\'s performance as the Joker is the most captivating villain I\'ve ever seen on screen. The film redefined what a superhero movie could be.',
    date: 'March 15, 2024',
    helpful: 42,
  },
  {
    id: 'review-002',
    movieId: 'movie-001',
    userId: 'user-003',
    userName: 'Marcus Webb',
    rating: 9,
    text: 'A masterclass in tension and storytelling. Nolan at his absolute best. The practical effects and IMAX sequences are breathtaking.',
    date: 'February 28, 2024',
    helpful: 31,
  },
  {
    id: 'review-003',
    movieId: 'movie-001',
    userId: 'user-004',
    userName: 'Priya Nair',
    rating: 9,
    text: 'I\'ve seen this film at least six times and it never gets old. The ferry scene alone is worth the price of admission. Nolan understands chaos better than any filmmaker alive.',
    date: 'January 10, 2024',
    helpful: 19,
  },
  {
    id: 'review-004',
    movieId: 'movie-002',
    userId: 'user-002',
    userName: 'Sofia Reyes',
    rating: 9,
    text: 'Mind-bending in the best possible way. I\'ve watched it four times and still discover something new each viewing.',
    date: 'April 2, 2024',
    helpful: 28,
  },
  {
    id: 'review-005',
    movieId: 'movie-002',
    userId: 'user-005',
    userName: 'Jordan Blake',
    rating: 8,
    text: 'The concept is brilliant and the execution is mostly flawless. DiCaprio carries the emotional weight of the film effortlessly. The ending is still debated in my friend group years later.',
    date: 'March 22, 2024',
    helpful: 24,
  },
  {
    id: 'review-006',
    movieId: 'movie-002',
    userId: 'user-006',
    userName: 'Tomás Herrera',
    rating: 10,
    text: 'One of the most ambitious blockbusters ever made. Hans Zimmer\'s score is iconic and the rotating hallway fight scene is pure cinema magic.',
    date: 'February 14, 2024',
    helpful: 37,
  },
  {
    id: 'review-007',
    movieId: 'movie-003',
    userId: 'user-001',
    userName: 'Alex Chen',
    rating: 10,
    text: 'The Shawshank Redemption is the rare film that genuinely earns its reputation. Every scene feels purposeful and the friendship between Andy and Red is one of cinema\'s greatest.',
    date: 'April 5, 2024',
    helpful: 55,
  },
  {
    id: 'review-008',
    movieId: 'movie-003',
    userId: 'user-007',
    userName: 'Diane Kowalski',
    rating: 10,
    text: 'I cry every single time. Morgan Freeman\'s narration is poetry. This film reminds you why movies exist — to make you feel something real.',
    date: 'March 30, 2024',
    helpful: 48,
  },
  {
    id: 'review-009',
    movieId: 'movie-003',
    userId: 'user-008',
    userName: 'Ravi Shankar',
    rating: 9,
    text: 'Timeless. The themes of hope and perseverance hit differently depending on where you are in life. Watched it at 20 and again at 35 — completely different experience both times.',
    date: 'January 18, 2024',
    helpful: 33,
  },
  {
    id: 'review-010',
    movieId: 'movie-004',
    userId: 'user-003',
    userName: 'Marcus Webb',
    rating: 10,
    text: 'The Godfather is not just a great film — it\'s a complete world. Coppola built something that feels lived-in and real. Brando\'s performance is untouchable.',
    date: 'February 20, 2024',
    helpful: 61,
  },
  {
    id: 'review-011',
    movieId: 'movie-004',
    userId: 'user-009',
    userName: 'Natalie Osei',
    rating: 9,
    text: 'Al Pacino\'s transformation from reluctant outsider to ruthless don is one of the most compelling character arcs in film history. The baptism sequence is pure genius.',
    date: 'March 5, 2024',
    helpful: 44,
  },
  {
    id: 'review-012',
    movieId: 'movie-005',
    userId: 'user-002',
    userName: 'Sofia Reyes',
    rating: 8,
    text: 'Pulp Fiction is endlessly rewatchable. Tarantino\'s dialogue crackles with energy and the non-linear structure keeps you engaged from start to finish.',
    date: 'April 12, 2024',
    helpful: 29,
  },
  {
    id: 'review-013',
    movieId: 'movie-005',
    userId: 'user-006',
    userName: 'Tomás Herrera',
    rating: 9,
    text: 'Every scene is a masterclass in screenwriting. The diner scene at the beginning and end is one of the most satisfying structural choices in modern cinema.',
    date: 'March 8, 2024',
    helpful: 36,
  },
  {
    id: 'review-014',
    movieId: 'movie-006',
    userId: 'user-004',
    userName: 'Priya Nair',
    rating: 10,
    text: 'Schindler\'s List is devastating and necessary. Spielberg handles the subject with extraordinary care. The use of black and white makes the rare moments of color hit like a punch.',
    date: 'January 27, 2024',
    helpful: 52,
  },
  {
    id: 'review-015',
    movieId: 'movie-006',
    userId: 'user-007',
    userName: 'Diane Kowalski',
    rating: 10,
    text: 'I had to pause this film multiple times just to collect myself. Liam Neeson gives the performance of his career. A film that should be required viewing.',
    date: 'February 3, 2024',
    helpful: 47,
  },
  {
    id: 'review-016',
    movieId: 'movie-007',
    userId: 'user-005',
    userName: 'Jordan Blake',
    rating: 9,
    text: 'Interstellar is the most emotionally ambitious sci-fi film since 2001. The docking scene had me holding my breath and the father-daughter relationship is genuinely moving.',
    date: 'April 18, 2024',
    helpful: 38,
  },
  {
    id: 'review-017',
    movieId: 'movie-007',
    userId: 'user-008',
    userName: 'Ravi Shankar',
    rating: 8,
    text: 'Visually stunning and emotionally resonant. The third act is divisive but I found it bold and satisfying. Hans Zimmer\'s organ-driven score is unlike anything else.',
    date: 'March 14, 2024',
    helpful: 22,
  },
  {
    id: 'review-018',
    movieId: 'movie-008',
    userId: 'user-001',
    userName: 'Alex Chen',
    rating: 9,
    text: 'Fight Club is one of those films that genuinely changes how you see the world. Fincher\'s direction is razor-sharp and the twist still lands even when you know it\'s coming.',
    date: 'February 25, 2024',
    helpful: 41,
  },
  {
    id: 'review-019',
    movieId: 'movie-008',
    userId: 'user-009',
    userName: 'Natalie Osei',
    rating: 8,
    text: 'Brad Pitt and Edward Norton have incredible chemistry. The social commentary feels as relevant today as it did in 1999. Definitely not a film for everyone, but it\'s unforgettable.',
    date: 'January 31, 2024',
    helpful: 27,
  },
  {
    id: 'review-020',
    movieId: 'movie-009',
    userId: 'user-003',
    userName: 'Marcus Webb',
    rating: 10,
    text: 'The Matrix is one of the most influential films ever made. The bullet-time sequences were revolutionary and the philosophical underpinnings give it real depth beyond the action.',
    date: 'March 19, 2024',
    helpful: 45,
  },
  {
    id: 'review-021',
    movieId: 'movie-009',
    userId: 'user-006',
    userName: 'Tomás Herrera',
    rating: 9,
    text: 'Keanu Reeves was born to play Neo. The Wachowskis created a universe that spawned countless imitators but none have matched the original\'s perfect blend of action and ideas.',
    date: 'April 7, 2024',
    helpful: 33,
  },
  {
    id: 'review-022',
    movieId: 'movie-010',
    userId: 'user-002',
    userName: 'Sofia Reyes',
    rating: 8,
    text: 'Goodfellas is Scorsese at his most kinetic. The voiceover narration pulls you into Henry Hill\'s world and makes you complicit in his crimes. Absolutely riveting.',
    date: 'February 11, 2024',
    helpful: 30,
  },
  {
    id: 'review-023',
    movieId: 'movie-010',
    userId: 'user-004',
    userName: 'Priya Nair',
    rating: 9,
    text: 'Joe Pesci\'s "funny how?" scene is one of the most tense moments in cinema. The film never lets you get comfortable and that\'s exactly the point.',
    date: 'March 26, 2024',
    helpful: 39,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    watchlist: [],
    watched: [],
    ratings: {},
    reviews: INITIAL_REVIEWS,
    isLoading: false,
  });

  useEffect(() => {
    // Backend integration: load persisted state from localStorage
    const saved = localStorage.getItem('cinematch-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    // Backend integration: persist state changes
    const toSave = {
      user: state.user,
      watchlist: state.watchlist,
      watched: state.watched,
      ratings: state.ratings,
    };
    localStorage.setItem('cinematch-state', JSON.stringify(toSave));
  }, [state.user, state.watchlist, state.watched, state.ratings]);

  const login = useCallback((email: string, password: string): boolean => {
    // Backend integration: replace with POST /api/auth/login
    const record = MOCK_USERS[email.toLowerCase()];
    if (record && record.password === password) {
      setState(prev => ({ ...prev, user: record.user }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null, watchlist: [], watched: [], ratings: {} }));
    localStorage.removeItem('cinematch-state');
  }, []);

  const register = useCallback((name: string, email: string, _password: string, genres: string[]) => {
    // Backend integration: replace with POST /api/auth/register
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      favoriteGenres: genres,
      memberSince: 'July 2026',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };
    setState(prev => ({ ...prev, user: newUser }));
  }, []);

  const addToWatchlist = useCallback((movieId: string) => {
    setState(prev => ({
      ...prev,
      watchlist: prev.watchlist.includes(movieId) ? prev.watchlist : [...prev.watchlist, movieId],
    }));
  }, []);

  const removeFromWatchlist = useCallback((movieId: string) => {
    setState(prev => ({
      ...prev,
      watchlist: prev.watchlist.filter(id => id !== movieId),
    }));
  }, []);

  const markAsWatched = useCallback((movieId: string) => {
    setState(prev => ({
      ...prev,
      watched: prev.watched.includes(movieId) ? prev.watched : [...prev.watched, movieId],
    }));
  }, []);

  const markAsUnwatched = useCallback((movieId: string) => {
    setState(prev => ({
      ...prev,
      watched: prev.watched.filter(id => id !== movieId),
    }));
  }, []);

  const rateMovie = useCallback((movieId: string, rating: number) => {
    setState(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [movieId]: rating },
    }));
  }, []);

  const addReview = useCallback((movieId: string, rating: number, text: string) => {
    if (!state.user) return;
    const newReview: Review = {
      id: `review-${Date.now()}`,
      movieId,
      userId: state.user.id,
      userName: state.user.name,
      rating,
      text,
      date: 'July 8, 2026',
      helpful: 0,
    };
    setState(prev => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
    }));
  }, [state.user]);

  const isInWatchlist = useCallback((movieId: string) => state.watchlist.includes(movieId), [state.watchlist]);
  const isWatched = useCallback((movieId: string) => state.watched.includes(movieId), [state.watched]);
  const getUserRating = useCallback((movieId: string) => state.ratings[movieId] ?? null, [state.ratings]);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      addToWatchlist,
      removeFromWatchlist,
      markAsWatched,
      markAsUnwatched,
      rateMovie,
      addReview,
      isInWatchlist,
      isWatched,
      getUserRating,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
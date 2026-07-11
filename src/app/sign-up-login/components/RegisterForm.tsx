'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { GENRES } from '@/data/movies';
import { toast } from 'sonner';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: Props) {
  const router = useRouter();
  const { register: registerUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreError, setGenreError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>();

  const password = watch('password');

  function toggleGenre(genre: string) {
    setGenreError('');
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  }

  async function onSubmit(data: RegisterValues) {
    if (selectedGenres.length < 3) {
      setGenreError('Please select at least 3 favorite genres');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    // Backend integration: replace with POST /api/auth/register
    registerUser(data.name, data.email, data.password, selectedGenres);
    setIsLoading(false);
    toast.success(`Welcome to CineMatch, ${data.name.split(' ')[0]}!`);
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start discovering movies tailored to you</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="reg-name">
          Full name
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-name"
            type="text"
            placeholder="Your full name"
            className={`input-field pl-9 ${errors.name ? 'border-secondary' : ''}`}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
          />
        </div>
        {errors.name && <p className="text-secondary text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="reg-email">
          Email address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            className={`input-field pl-9 ${errors.email ? 'border-secondary' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && <p className="text-secondary text-xs mt-1.5">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="reg-password">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            className={`input-field pl-9 pr-10 ${errors.password ? 'border-secondary' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-secondary text-xs mt-1.5">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="reg-confirm">
          Confirm password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            className={`input-field pl-9 ${errors.confirmPassword ? 'border-secondary' : ''}`}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: val => val === password || 'Passwords do not match',
            })}
          />
        </div>
        {errors.confirmPassword && <p className="text-secondary text-xs mt-1.5">{errors.confirmPassword.message}</p>}
      </div>

      {/* Genre Picker */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Favorite genres
          <span className="text-muted-foreground font-normal ml-1">(pick 3 or more)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">We&apos;ll use these to personalize your recommendations</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <button
              key={`reg-genre-${genre}`}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedGenres.includes(genre)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {genre}
              {selectedGenres.includes(genre) && ' ✓'}
            </button>
          ))}
        </div>
        {genreError && <p className="text-secondary text-xs mt-1.5">{genreError}</p>}
        <p className="text-xs text-muted-foreground mt-1.5">
          {selectedGenres.length} selected{selectedGenres.length < 3 ? ` (need ${3 - selectedGenres.length} more)` : ' ✓'}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ minHeight: '48px' }}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to our{' '}
        <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
        {' '}and{' '}
        <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
}
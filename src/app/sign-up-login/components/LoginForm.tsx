'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Copy, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

const DEMO_ACCOUNTS = [
  { role: 'Sci-Fi Fan', email: 'alex.chen@cinematch.io', password: 'Cine2024!' },
  { role: 'Romance Fan', email: 'sofia.reyes@cinematch.io', password: 'Movies99#' },
];

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: Props) {
  const router = useRouter();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({ defaultValues: { remember: false } });

  async function onSubmit(data: LoginValues) {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // Backend integration: replace with POST /api/auth/login
    const success = login(data.email, data.password);
    setIsLoading(false);
    if (success) {
      toast.success('Welcome back! Redirecting...');
      router.push('/');
    } else {
      setError('email', { message: 'Invalid credentials — use the demo accounts below to sign in' });
    }
  }

  function autofill(email: string, password: string) {
    setValue('email', email);
    setValue('password', password);
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your CineMatch account</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="login-email">
          Email address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            className={`input-field pl-9 ${errors.email ? 'border-secondary' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-secondary text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="login-password">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`input-field pl-9 pr-10 ${errors.password ? 'border-secondary' : ''}`}
            {...register('password', { required: 'Password is required' })}
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
        {errors.password && (
          <p className="text-secondary text-xs mt-1.5">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border accent-primary"
            {...register('remember')}
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Forgot password?
        </button>
      </div>

      {/* Submit */}
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
          'Sign In'
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-primary hover:text-primary/80 font-medium transition-colors">
          Create one free
        </button>
      </p>

      {/* Demo Credentials */}
      <div className="mt-6 rounded-xl border border-border bg-card/60 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Demo Accounts</p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map(account => (
            <div key={`demo-${account.role}`} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/50">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary">{account.role}</p>
                <p className="text-xs text-muted-foreground truncate">{account.email}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(account.password, `${account.role}-pw`)}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                  aria-label="Copy password"
                >
                  {copiedField === `${account.role}-pw` ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => autofill(account.email, account.password)}
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/15 text-primary hover:bg-primary/25 transition-all border border-primary/20"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
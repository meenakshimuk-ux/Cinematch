'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ThumbsUp, Star, MessageSquarePlus } from 'lucide-react';
import { Movie } from '@/data/movies';
import { useApp } from '@/context/AppContext';
import StarRating from './StarRating';
import { toast } from 'sonner';

interface Props {
  movie: Movie;
}

interface ReviewFormValues {
  text: string;
}

export default function ReviewsTab({ movie }: Props) {
  const { user, reviews, addReview, getUserRating, rateMovie } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  const userRating = getUserRating(movie.id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>();

  async function onSubmitReview(data: ReviewFormValues) {
    if (reviewRating === 0) { setRatingError('Please select a rating'); return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    // Backend integration: replace with POST /api/reviews
    rateMovie(movie.id, reviewRating);
    addReview(movie.id, reviewRating, data.text);
    setIsSubmitting(false);
    setShowForm(false);
    reset();
    setReviewRating(0);
    toast.success('Your review was published!');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          Reviews
          <span className="ml-2 text-sm font-normal text-muted-foreground">({movieReviews.length})</span>
        </h3>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 btn-outline text-sm px-4 py-2"
          >
            <MessageSquarePlus size={15} />
            Write a Review
          </button>
        )}
        {!user && (
          <a href="/sign-up-login" className="text-sm text-primary hover:underline font-medium">
            Sign in to review
          </a>
        )}
      </div>

      {/* Write Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit(onSubmitReview)} className="bg-card rounded-2xl border border-primary/30 p-5 space-y-4">
          <h4 className="font-semibold text-foreground">Your Review</h4>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
            <StarRating
              value={reviewRating}
              max={10}
              interactive
              onRate={r => { setReviewRating(r); setRatingError(''); }}
              size={24}
            />
            {ratingError && <p className="text-secondary text-xs mt-1">{ratingError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="review-text">
              Your thoughts
            </label>
            <textarea
              id="review-text"
              rows={4}
              placeholder={`What did you think of ${movie.title}?`}
              className={`input-field resize-none ${errors.text ? 'border-secondary' : ''}`}
              {...register('text', {
                required: 'Please write your review',
                minLength: { value: 20, message: 'Review must be at least 20 characters' },
              })}
            />
            {errors.text && <p className="text-secondary text-xs mt-1">{errors.text.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : 'Publish Review'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); reset(); setReviewRating(0); }}
              className="btn-outline text-sm px-5 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {movieReviews.length > 0 ? (
        <div className="space-y-4">
          {movieReviews.map(review => (
            <div key={review.id} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {review.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rating-badge rounded-lg px-2 py-1">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{review.rating}/10</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={13} />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <MessageSquarePlus size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
          <h4 className="font-semibold text-foreground mb-1">No reviews yet</h4>
          <p className="text-sm text-muted-foreground">Be the first to share your thoughts on {movie.title}.</p>
          {user && (
            <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm px-5 py-2">
              Write the First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
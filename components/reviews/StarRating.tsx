'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (star: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star)
    }
  }

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star)
    }
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          className={cn(
            'focus:outline-none transition-colors',
            !readonly && 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

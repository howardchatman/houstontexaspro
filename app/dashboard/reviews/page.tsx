'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/reviews/StarRating'

interface Review {
  id: string
  rating: number
  title: string | null
  content: string
  project_type: string | null
  contractor_response: string | null
  response_date: string | null
  created_at: string
  profiles: { full_name: string | null } | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!contractor) return

    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('contractor_id', contractor.id)
      .order('created_at', { ascending: false })

    setReviews(data || [])
    setLoading(false)
  }

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return

    setSubmitting(true)
    const { error } = await supabase
      .from('reviews')
      .update({
        contractor_response: responseText,
        response_date: new Date().toISOString(),
      })
      .eq('id', reviewId)

    if (!error) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                contractor_response: responseText,
                response_date: new Date().toISOString(),
              }
            : review
        )
      )
      setRespondingTo(null)
      setResponseText('')
    }
    setSubmitting(false)
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Manage customer reviews and respond to feedback</p>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">
                {avgRating > 0 ? avgRating.toFixed(1) : '-'}
              </div>
              <StarRating rating={avgRating} readonly size="lg" />
              <p className="text-sm text-gray-500 mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold">
                        {review.profiles?.full_name || 'Anonymous'}
                      </p>
                      {review.project_type && (
                        <Badge variant="secondary">{review.project_type}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!review.contractor_response && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRespondingTo(review.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>

                {review.title && (
                  <h4 className="font-medium mb-2">{review.title}</h4>
                )}
                <p className="text-gray-600">{review.content}</p>

                {/* Contractor Response */}
                {review.contractor_response && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded-r">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-blue-900">
                        Your Response
                      </p>
                      <span className="text-xs text-gray-500">
                        {review.response_date &&
                          new Date(review.response_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {review.contractor_response}
                    </p>
                  </div>
                )}

                {/* Response Form */}
                {respondingTo === review.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Textarea
                      placeholder="Write your response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      className="mb-3"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRespondingTo(null)
                          setResponseText('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRespond(review.id)}
                        disabled={submitting || !responseText.trim()}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {submitting ? 'Sending...' : 'Send Response'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-500">
              Reviews from your customers will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

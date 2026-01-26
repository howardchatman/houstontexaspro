'use client'

import { useState } from 'react'
import { Send, CheckCircle, ArrowRight, ArrowLeft, Clock, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface LeadFormProps {
  contractorId: string
  contractorName: string
  responseTime?: string // e.g. "Usually responds within 2 hours"
}

type FormStep = 'urgency' | 'details' | 'contact'
type Urgency = 'emergency' | 'today' | 'this-week' | 'flexible'

export function LeadForm({ contractorId, contractorName, responseTime }: LeadFormProps) {
  const [step, setStep] = useState<FormStep>('urgency')
  const [urgency, setUrgency] = useState<Urgency | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase.from('leads').insert({
        contractor_id: contractorId,
        name,
        email: email || null,
        phone: phone || null,
        message: `[${urgency?.toUpperCase()}] ${jobDescription}`,
        source: 'form',
      })

      if (submitError) {
        setError('Something went wrong. Please try again.')
        console.error(submitError)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUrgencySelect = (selected: Urgency) => {
    setUrgency(selected)
    setStep('details')
  }

  const goBack = () => {
    if (step === 'details') setStep('urgency')
    if (step === 'contact') setStep('details')
  }

  const goToContact = () => {
    if (jobDescription.trim()) {
      setStep('contact')
    }
  }

  // Success State
  if (success) {
    return (
      <Card className="border-green-200">
        <CardContent className="py-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Request Sent
          </h3>
          <p className="text-slate-600 mb-4">
            {contractorName} will reach out{urgency === 'emergency' ? ' as soon as possible' : ' shortly'}.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>{responseTime || 'Usually responds within a few hours'}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Request Service</CardTitle>
            <CardDescription className="text-sm">
              from {contractorName}
            </CardDescription>
          </div>
          {/* Progress indicator */}
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${step === 'urgency' ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'details' ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'contact' ? 'bg-blue-600' : 'bg-slate-200'}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Step 1: Urgency */}
        {step === 'urgency' && (
          <div className="space-y-4">
            <p className="text-slate-700 font-medium">When do you need help?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUrgencySelect('emergency')}
                className="p-4 border-2 rounded-lg text-left hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-slate-900">Emergency</span>
                </div>
                <span className="text-sm text-slate-500">I need help now</span>
              </button>

              <button
                type="button"
                onClick={() => handleUrgencySelect('today')}
                className="p-4 border-2 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 block mb-1">Today</span>
                <span className="text-sm text-slate-500">As soon as possible</span>
              </button>

              <button
                type="button"
                onClick={() => handleUrgencySelect('this-week')}
                className="p-4 border-2 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 block mb-1">This Week</span>
                <span className="text-sm text-slate-500">Within a few days</span>
              </button>

              <button
                type="button"
                onClick={() => handleUrgencySelect('flexible')}
                className="p-4 border-2 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 block mb-1">Flexible</span>
                <span className="text-sm text-slate-500">I can schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ArrowLeft className="h-4 w-4 text-slate-500" />
              </button>
              <p className="text-slate-700 font-medium">What do you need done?</p>
            </div>

            {urgency && (
              <Badge variant="outline" className={urgency === 'emergency' ? 'border-red-200 text-red-700' : ''}>
                {urgency === 'emergency' && '🚨 '}
                {urgency.charAt(0).toUpperCase() + urgency.slice(1).replace('-', ' ')}
              </Badge>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Describe the job... The more detail, the better the estimate."
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="resize-none"
              />
              <p className="text-xs text-slate-500">
                Example: &quot;Leaking pipe under kitchen sink. Water is dripping slowly.&quot;
              </p>
            </div>

            <Button
              type="button"
              onClick={goToContact}
              disabled={!jobDescription.trim()}
              className="w-full"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 'contact' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ArrowLeft className="h-4 w-4 text-slate-500" />
              </button>
              <p className="text-slate-700 font-medium">How should they reach you?</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm">Your Name</Label>
                <Input
                  id="name"
                  placeholder="First and last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(713) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">Best way to reach you quickly</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !name || !phone}>
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="h-3 w-3" />
              <span>Your info goes only to {contractorName}</span>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

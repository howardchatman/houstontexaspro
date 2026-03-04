'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ClaimFormProps {
  contractorName: string
  contractorSlug: string
  listingUrl: string
}

interface FormState {
  fullName: string
  roleTitle: string
  email: string
  phone: string
  proofOrNotes: string
  honeypot: string
}

const EMPTY: FormState = {
  fullName: '',
  roleTitle: '',
  email: '',
  phone: '',
  proofOrNotes: '',
  honeypot: '',
}

export function ClaimForm({ contractorName, contractorSlug, listingUrl }: ClaimFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim() || !form.email.trim() || !form.proofOrNotes.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/claim-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          roleTitle: form.roleTitle.trim() || null,
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          proofOrNotes: form.proofOrNotes.trim(),
          contractorName,
          contractorSlug,
          listingUrl,
          honeypot: form.honeypot,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || 'Unable to submit. Please try again.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Unable to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#0B0B0B]">Claim Received</h2>
        <p className="text-[#6B7280]">
          We&apos;ll review your request and reply within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          placeholder="Jane Smith"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="roleTitle">Role / Title (optional)</Label>
        <Input
          id="roleTitle"
          value={form.roleTitle}
          onChange={(e) => set('roleTitle', e.target.value)}
          placeholder="Owner, Manager, etc."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="(713) 555-0100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="proofOrNotes">Proof of Ownership *</Label>
        <Textarea
          id="proofOrNotes"
          rows={5}
          value={form.proofOrNotes}
          onChange={(e) => set('proofOrNotes', e.target.value)}
          placeholder="Share your company email domain, website ownership, business phone, or any info that confirms you own this listing."
          required
        />
      </div>

      {/* Honeypot — hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <Input
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(e) => set('honeypot', e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Claim'}
      </Button>

      <p className="text-xs text-center text-[#9CA3AF]">
        We review every claim and respond within 1 business day.
      </p>
    </form>
  )
}

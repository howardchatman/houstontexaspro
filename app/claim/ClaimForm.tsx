'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ClaimFormProps {
  companySlug: string
  companyName: string
}

interface FormState {
  name: string
  company: string
  email: string
  phone: string
  website: string
  message: string
}

export function ClaimForm({ companySlug, companyName }: ClaimFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    company: companyName,
    email: '',
    phone: '',
    website: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log('Claim submission:', {
      ...form,
      companySlug,
      submittedAt: new Date().toISOString(),
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#0B0B0B]">Claim Submitted</h2>
        <p className="text-[#6B7280] text-sm">
          Thanks! We&apos;ll review your request and get back to you within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Jane Smith"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={form.company}
          onChange={(e) => set('company', e.target.value)}
          placeholder="Acme Plumbing LLC"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="(713) 555-0100"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          placeholder="https://yourcompany.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us how we can verify you own this listing."
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Claim
      </Button>
    </form>
  )
}

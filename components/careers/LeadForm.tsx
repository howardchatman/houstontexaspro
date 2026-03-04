'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitCareerLead } from '@/app/actions/submitCareerLead'

const TIMEFRAMES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_3_months', label: 'Within 1–3 months' },
  { value: '3_6_months', label: 'Within 3–6 months' },
  { value: 'just_exploring', label: 'Just exploring' },
]

interface LeadFormProps {
  careerId?: string
  schoolId?: string
  sourceUrl?: string
  heading?: string
  subheading?: string
}

export function LeadForm({
  careerId,
  schoolId,
  sourceUrl,
  heading = 'Get Program Info',
  subheading = 'We\'ll connect you with schools offering this program in Houston.',
}: LeadFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!timeframe) {
      setError('Please select a start timeframe.')
      return
    }
    setPending(true)
    setError(null)

    const fd = new FormData(formRef.current!)
    fd.set('start_timeframe', timeframe)
    if (careerId) fd.set('career_id', careerId)
    if (schoolId) fd.set('school_id', schoolId)
    if (sourceUrl) fd.set('source_url', sourceUrl)

    const result = await submitCareerLead(fd)
    setPending(false)

    if (result.success) {
      router.push('/careers/lead-success')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#0B0B0B] mb-1">{heading}</h3>
      <p className="text-sm text-[#6B7280] mb-6">{subheading}</p>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" name="full_name" placeholder="Jane Smith" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(713) 555-0100"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-1">
          <Label>When do you want to start?</Label>
          <Select onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select a timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Sending...' : 'Get Free Info'}
        </Button>

        <p className="text-xs text-center text-[#9CA3AF]">
          No spam. We'll only share your info with matching schools.
        </p>
      </form>
    </div>
  )
}

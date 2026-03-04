'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ClaimThisListingDialogProps {
  contractorName: string
  contractorSlug: string
  listingUrl: string
}

interface ClaimFormState {
  fullName: string
  roleTitle: string
  email: string
  phone: string
  proofOrNotes: string
  honeypot: string
}

const INITIAL_FORM: ClaimFormState = {
  fullName: '',
  roleTitle: '',
  email: '',
  phone: '',
  proofOrNotes: '',
  honeypot: '',
}

export function ClaimThisListingDialog({
  contractorName,
  contractorSlug,
  listingUrl,
}: ClaimThisListingDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ClaimFormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function updateForm<K extends keyof ClaimFormState>(key: K, value: ClaimFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setError('')
    setSuccess(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!form.fullName.trim() || !form.email.trim() || !form.proofOrNotes.trim()) {
      setError('Please complete all required fields.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/claim-listing', {
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

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setError(payload?.error || 'Unable to submit claim. Please try again.')
        return
      }

      setSuccess(true)
      setForm(INITIAL_FORM)
    } catch {
      setError('Unable to submit claim. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>Claim This Listing</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle>Claim This Listing</DialogTitle>
              <DialogDescription>
                Submit your details and proof of ownership for {contractorName}. We review every request.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claim-fullName">Full Name</Label>
                <Input
                  id="claim-fullName"
                  value={form.fullName}
                  onChange={(event) => updateForm('fullName', event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claim-roleTitle">Role / Title (optional)</Label>
                <Input
                  id="claim-roleTitle"
                  value={form.roleTitle}
                  onChange={(event) => updateForm('roleTitle', event.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="claim-email">Email</Label>
                  <Input
                    id="claim-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm('email', event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claim-phone">Phone (optional)</Label>
                  <Input
                    id="claim-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateForm('phone', event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="claim-proof">Proof or Notes</Label>
                <Textarea
                  id="claim-proof"
                  rows={5}
                  value={form.proofOrNotes}
                  onChange={(event) => updateForm('proofOrNotes', event.target.value)}
                  placeholder="Share your company email domain, website ownership details, business phone, or any info that confirms ownership."
                  required
                />
              </div>

              <input type="hidden" name="contractorName" value={contractorName} readOnly />
              <input type="hidden" name="contractorSlug" value={contractorSlug} readOnly />
              <input type="hidden" name="listingUrl" value={listingUrl} readOnly />

              <div className="hidden">
                <Label htmlFor="claim-companyWebsite">Company website</Label>
                <Input
                  id="claim-companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(event) => updateForm('honeypot', event.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-3 py-2">
            <DialogHeader>
              <DialogTitle>Claim Received</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#374151]">
              Thanks — we received your claim. We&apos;ll reply within 1 business day.
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

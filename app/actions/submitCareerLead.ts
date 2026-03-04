'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  start_timeframe: z.string().min(1, 'Please select a timeframe'),
  career_id: z.string().uuid().optional().nullable(),
  school_id: z.string().uuid().optional().nullable(),
  source_url: z.string().optional(),
  notes: z.string().optional(),
})

export type CareerLeadResult =
  | { success: true }
  | { success: false; error: string }

export async function submitCareerLead(
  formData: FormData
): Promise<CareerLeadResult> {
  const raw = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    start_timeframe: formData.get('start_timeframe'),
    career_id: formData.get('career_id') || null,
    school_id: formData.get('school_id') || null,
    source_url: formData.get('source_url') || null,
    notes: formData.get('notes') || null,
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    return { success: false, error: first.message }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('leads').insert({
    name: parsed.data.full_name,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    start_timeframe: parsed.data.start_timeframe,
    career_id: parsed.data.career_id,
    school_id: parsed.data.school_id,
    source_url: parsed.data.source_url,
    notes: parsed.data.notes,
    status: 'new',
  })

  if (error) {
    console.error('Career lead insert error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}

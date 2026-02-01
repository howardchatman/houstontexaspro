import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const FROM_EMAIL = 'Houston Texas Pro <noreply@houstontexaspro.com>'
export const SUPPORT_EMAIL = 'support@houstontexaspro.com'

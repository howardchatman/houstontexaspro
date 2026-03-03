'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, HardHat, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'

type AccountType = 'seeker' | 'contractor'

export default function RegisterPage() {
  const router = useRouter()

  const [accountType, setAccountType] = useState<AccountType>('seeker')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Contractor selection redirects — no signup here
    if (accountType === 'contractor') {
      router.push('/register/contractor')
      return
    }

    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'seeker' },
          captchaToken,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F5F5F5]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-600">
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[#374151] mb-4">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-[#6B7280]">
              Click the link in the email to activate your account, then you can sign in.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">Go to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F5F5F5]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-[#0B0B0B] text-white font-bold px-4 py-2 rounded text-xl">
              HTP
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            How will you use Houston Texas Pro?
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('seeker')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  accountType === 'seeker'
                    ? 'border-[#1F3C58] bg-[#1F3C58]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Search className={`h-6 w-6 ${accountType === 'seeker' ? 'text-[#1F3C58]' : 'text-[#9CA3AF]'}`} />
                <span className={`text-sm font-medium text-center leading-tight ${accountType === 'seeker' ? 'text-[#1F3C58]' : 'text-[#374151]'}`}>
                  I&apos;m looking for a contractor
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('contractor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  accountType === 'contractor'
                    ? 'border-[#1F3C58] bg-[#1F3C58]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <HardHat className={`h-6 w-6 ${accountType === 'contractor' ? 'text-[#1F3C58]' : 'text-[#9CA3AF]'}`} />
                <span className={`text-sm font-medium text-center leading-tight ${accountType === 'contractor' ? 'text-[#1F3C58]' : 'text-[#374151]'}`}>
                  I&apos;m a contractor
                </span>
              </button>
            </div>

            {/* Contractor shortcut */}
            {accountType === 'contractor' && (
              <div className="p-4 bg-[#1F3C58]/5 border border-[#1F3C58]/20 rounded-lg text-center">
                <p className="text-sm text-[#374151] mb-3">
                  Contractors have a dedicated registration with business details and service setup.
                </p>
                <Button type="submit" className="w-full">
                  Go to Contractor Registration →
                </Button>
              </div>
            )}

            {/* Seeker form fields */}
            {accountType === 'seeker' && (
              <>
                {error && (
                  <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#6B7280]">Must be at least 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={setCaptchaToken}
                  onExpire={() => setCaptchaToken('')}
                  onError={() => setCaptchaToken('')}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {accountType === 'seeker' && (
              <>
                <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-xs text-[#6B7280] text-center">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-[#1F3C58] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#1F3C58] hover:underline">Privacy Policy</Link>
                </p>

                <div className="text-center text-sm text-[#374151]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#1F3C58] hover:underline">Sign in</Link>
                </div>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

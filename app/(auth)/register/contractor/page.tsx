'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'

type Step = 'account' | 'business' | 'categories'

export default function ContractorRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const claimCompany = searchParams.get('company') ?? ''
  const isClaiming = !!searchParams.get('claim')

  const [step, setStep] = useState<Step>('account')

  // Account info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Business info
  const [businessName, setBusinessName] = useState(claimCompany)
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('Houston')
  const [zipCode, setZipCode] = useState('')
  const [serviceAreas, setServiceAreas] = useState<string[]>(['Houston'])
  const [licenseNumber, setLicenseNumber] = useState('')
  const [yearsInBusiness, setYearsInBusiness] = useState('')

  // Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')

  const supabase = createClient()

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    )
  }

  const toggleServiceArea = (area: string) => {
    setServiceAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    )
  }

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setStep('business')
  }

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStep('categories')
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategories.length === 0) {
      setError('Please select at least one category')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'contractor' },
          captchaToken,
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create account')
        setLoading(false)
        return
      }

      // Update profile to contractor role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'contractor', phone: businessPhone })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // Create contractor record
      const { data: contractor, error: contractorError } = await supabase
        .from('contractors')
        .insert({
          user_id: authData.user.id,
          business_name: businessName,
          description,
          phone: businessPhone,
          email: businessEmail || email,
          city,
          zip_code: zipCode,
          service_area: serviceAreas,
          license_number: licenseNumber || null,
          years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
        })
        .select()
        .single()

      if (contractorError) {
        setError('Failed to create contractor profile: ' + contractorError.message)
        setLoading(false)
        return
      }

      // Add contractor categories
      if (contractor) {
        // Get category IDs from slugs
        const { data: categories } = await supabase
          .from('categories')
          .select('id, slug')
          .in('slug', selectedCategories)

        if (categories && categories.length > 0) {
          const categoryInserts = categories.map((cat) => ({
            contractor_id: contractor.id,
            category_id: cat.id,
          }))

          await supabase.from('contractor_categories').insert(categoryInserts)
        }
      }

      // Send welcome email (non-blocking)
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, businessName }),
      }).catch(() => {})

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F5F5F5]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-green-600">
              Registration Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[#374151] mb-4">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-[#6B7280] mb-4">
              Click the link in the email to activate your account. Once verified,
              you can sign in and complete your profile.
            </p>
            <div className="bg-[#F5F5F5] p-4 rounded-lg text-sm text-[#1F3C58]">
              <strong>Next steps:</strong>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Verify your email</li>
                <li>Sign in and choose your plan</li>
                <li>Complete your profile</li>
                <li>Start responding to requests</li>
              </ul>
            </div>
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
    <div className="min-h-screen py-12 bg-[#F5F5F5] relative overflow-hidden">
      {/* Houston Downtown Skyline */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
        <svg
          viewBox="0 0 1440 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F3C58" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1F3C58" stopOpacity="0.32" />
            </linearGradient>
          </defs>
          {/* Skyline silhouette path — left to right */}
          <path
            d="
              M0,220
              L0,185 L40,185 L40,195 L55,195 L55,180 L80,180 L80,175 L95,175
              L95,165 L115,165 L115,175 L130,175 L130,165 L150,165 L150,190
              L170,190 L170,158 L185,158 L185,148 L200,148 L200,155 L215,155
              L215,145 L235,145 L235,190 L250,190 L250,142 L268,142 L268,130
              L285,130 L285,125 L300,125 L300,138 L318,138 L318,128 L335,128
              L335,120 L352,120 L352,135 L370,135 L370,115 L390,115 L390,108
              L412,108 L412,118 L428,118 L428,100 L448,100 L448,110 L465,110
              L465,95 L485,95 L485,88 L505,88 L505,82 L520,82
              L520,78 L538,78 L538,85 L550,85 L550,75 L568,75
              L568,70 L582,70 L582,60 L596,60
              L596,55 L608,55
              L608,42
              L620,42
              L620,30
              L630,30
              L636,18
              L642,30
              L652,30
              L652,42
              L665,42
              L665,55 L678,55
              L678,60 L692,60
              L692,68 L706,68 L706,60 L720,60
              L720,65 L735,65 L735,55 L752,55
              L752,62 L768,62 L768,52 L785,52
              L785,60 L800,60 L800,68 L815,68
              L815,58 L832,58 L832,70 L848,70
              L848,78 L862,78 L862,68 L878,68
              L878,80 L895,80 L895,88 L912,88
              L912,82 L928,82 L928,92 L945,92
              L945,100 L960,100 L960,108 L978,108
              L978,115 L995,115 L995,108 L1012,108
              L1012,118 L1028,118 L1028,125 L1045,125
              L1045,132 L1062,132 L1062,138 L1080,138
              L1080,145 L1098,145 L1098,152 L1115,152
              L1115,160 L1132,160 L1132,168 L1150,168
              L1150,175 L1168,175 L1168,182 L1185,182
              L1185,188 L1205,188 L1205,192 L1225,192
              L1225,198 L1250,198 L1250,202 L1275,202
              L1275,205 L1310,205 L1310,208 L1360,208
              L1360,212 L1440,212
              L1440,220
              Z
            "
            fill="url(#skylineGrad)"
          />
          {/* JPMorgan Chase Tower triangular crown detail */}
          <polygon points="620,30 636,8 652,30" fill="#1F3C58" fillOpacity="0.22" />
          {/* Windows — scattered lit windows on tallest buildings */}
          {[
            [596,62],[604,62],[596,70],[604,70],
            [568,74],[576,74],[568,82],[576,82],
            [550,80],[558,80],[550,88],
            [630,35],[638,35],[630,43],[638,43],[630,51],[638,51],
            [654,35],[662,35],[654,43],[662,43],
            [706,64],[714,64],[706,72],[714,72],
            [720,66],[728,66],[720,74],[728,74],
            [752,58],[760,58],[752,66],[760,66],
            [768,56],[776,56],[768,64],[776,64],
            [785,55],[793,55],[785,63],[793,63],
            [800,63],[808,63],[800,71],
            [832,62],[840,62],[832,70],[840,70],
          ].map(([cx, cy], i) => (
            <rect
              key={i}
              x={cx}
              y={cy}
              width="5"
              height="4"
              fill="#C8A951"
              fillOpacity="0.55"
              rx="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'account'
                    ? 'bg-[#0B0B0B] text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {step === 'account' ? '1' : <CheckCircle className="h-5 w-5" />}
              </div>
              <div
                className={`w-16 h-1 ${
                  step !== 'account' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'business'
                    ? 'bg-[#0B0B0B] text-white'
                    : step === 'categories'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-[#374151]'
                }`}
              >
                {step === 'categories' ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <div
                className={`w-16 h-1 ${
                  step === 'categories' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'categories'
                    ? 'bg-[#0B0B0B] text-white'
                    : 'bg-gray-300 text-[#374151]'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {isClaiming && claimCompany && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <span className="font-semibold">Claiming:</span> {claimCompany} — your listing is free to claim. Choose a plan after registration.
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {step === 'account' && (isClaiming ? 'Claim Your Listing' : 'Create Your Account')}
                {step === 'business' && 'Business Information'}
                {step === 'categories' && 'Select Your Services'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'account' && (isClaiming ? 'Create your free account to get started' : 'Start by creating your login credentials')}
                {step === 'business' && 'Tell us about your business'}
                {step === 'categories' && 'Choose the categories that match your services'}
              </CardDescription>
            </CardHeader>

            {/* Step 1: Account */}
            {step === 'account' && (
              <form onSubmit={handleAccountSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <Input
                        id="fullName"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-[#6B7280]">Minimum 6 characters</p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                  <p className="text-sm text-[#374151] text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#1F3C58] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            )}

            {/* Step 2: Business Info */}
            {step === 'business' && (
              <form onSubmit={handleBusinessSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <Input
                        id="businessName"
                        placeholder="Your Business Name"
                        className="pl-10"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Phone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                        <Input
                          id="businessPhone"
                          placeholder="(713) 555-0123"
                          className="pl-10"
                          value={businessPhone}
                          onChange={(e) => setBusinessPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="contact@business.com"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell potential customers about your services, experience, and what makes you stand out..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                        <Input
                          id="city"
                          placeholder="Houston"
                          className="pl-10"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="77001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="Optional"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        placeholder="e.g., 10"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Service Areas (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                      {HOUSTON_AREAS.map((area) => (
                        <Badge
                          key={area}
                          variant={serviceAreas.includes(area) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleServiceArea(area)}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('account')}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continue
                  </Button>
                </CardFooter>
              </form>
            )}

            {/* Step 3: Categories */}
            {step === 'categories' && (
              <form onSubmit={handleFinalSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <p className="text-sm text-[#374151]">
                    Select all categories that apply to your business. This helps
                    customers find you when searching.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
                    {CONTRACTOR_CATEGORIES.map((category) => (
                      <div
                        key={category.slug}
                        onClick={() => toggleCategory(category.slug)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedCategories.includes(category.slug)
                            ? 'border-[#1F3C58] bg-[#F5F5F5]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedCategories.includes(category.slug)
                                ? 'bg-[#1F3C58] border-[#1F3C58]'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedCategories.includes(category.slug) && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedCategories.length > 0 && (
                    <div className="bg-[#F5F5F5] p-3 rounded">
                      <p className="text-sm font-medium mb-2">
                        Selected ({selectedCategories.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.map((slug) => {
                          const cat = CONTRACTOR_CATEGORIES.find(
                            (c) => c.slug === slug
                          )
                          return (
                            <Badge key={slug} variant="secondary">
                              {cat?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={setCaptchaToken}
                    onExpire={() => setCaptchaToken('')}
                    onError={() => setCaptchaToken('')}
                  />
                </CardContent>

                <CardFooter className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('business')}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || selectedCategories.length === 0 || !captchaToken}
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}


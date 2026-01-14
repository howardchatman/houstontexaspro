'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { createClient } from '@/lib/supabase/client'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'

type Step = 'account' | 'business' | 'categories'

export default function ContractorRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('account')

  // Account info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Business info
  const [businessName, setBusinessName] = useState('')
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
          data: {
            full_name: fullName,
          },
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
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
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
            <p className="text-gray-600 mb-4">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Click the link in the email to activate your account. Once verified,
              you can sign in and complete your profile.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <strong>Next steps:</strong>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Verify your email</li>
                <li>Sign in to your dashboard</li>
                <li>Add photos to your gallery</li>
                <li>Start receiving leads!</li>
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
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'account'
                    ? 'bg-blue-900 text-white'
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
                    ? 'bg-blue-900 text-white'
                    : step === 'categories'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
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
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {step === 'account' && 'Create Your Account'}
                {step === 'business' && 'Business Information'}
                {step === 'categories' && 'Select Your Services'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'account' && 'Start by creating your login credentials'}
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
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Minimum 6 characters</p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
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
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

                  <p className="text-sm text-gray-600">
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
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedCategories.includes(category.slug)
                                ? 'bg-blue-500 border-blue-500'
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
                    <div className="bg-gray-50 p-3 rounded">
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
                    disabled={loading || selectedCategories.length === 0}
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

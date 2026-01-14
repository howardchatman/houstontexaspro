'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [licenseNumber, setLicenseNumber] = useState('')
  const [yearsInBusiness, setYearsInBusiness] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [contractorId, setContractorId] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: contractor } = await supabase
      .from('contractors')
      .select(`
        *,
        contractor_categories (
          categories (slug)
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (contractor) {
      setContractorId(contractor.id)
      setBusinessName(contractor.business_name || '')
      setDescription(contractor.description || '')
      setPhone(contractor.phone || '')
      setEmail(contractor.email || '')
      setWebsite(contractor.website || '')
      setAddress(contractor.address || '')
      setCity(contractor.city || '')
      setZipCode(contractor.zip_code || '')
      setServiceAreas(contractor.service_area || [])
      setLicenseNumber(contractor.license_number || '')
      setYearsInBusiness(contractor.years_in_business?.toString() || '')
      setSelectedCategories(
        contractor.contractor_categories?.map(
          (cc: { categories: { slug: string } }) => cc.categories.slug
        ) || []
      )
    }

    setLoading(false)
  }

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Update contractor profile
      const { error: updateError } = await supabase
        .from('contractors')
        .update({
          business_name: businessName,
          description,
          phone,
          email,
          website,
          address,
          city,
          zip_code: zipCode,
          service_area: serviceAreas,
          license_number: licenseNumber || null,
          years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
        })
        .eq('id', contractorId)

      if (updateError) throw updateError

      // Update categories
      // First, delete existing
      await supabase
        .from('contractor_categories')
        .delete()
        .eq('contractor_id', contractorId)

      // Then, add new categories
      if (selectedCategories.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, slug')
          .in('slug', selectedCategories)

        if (categories && categories.length > 0) {
          const categoryInserts = categories.map((cat) => ({
            contractor_id: contractorId,
            category_id: cat.id,
          }))

          await supabase.from('contractor_categories').insert(categoryInserts)
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500">Manage your business information</p>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700">
          Profile saved successfully!
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This information will be displayed on your public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe your services, experience, and what makes you stand out..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="e.g., TECL12345"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How customers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="(713) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://www.yourbusiness.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
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
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Service Areas</CardTitle>
            <CardDescription>
              Select the areas you serve in Houston
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
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
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>
              Select the services you offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

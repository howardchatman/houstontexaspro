'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import {
  Contractor,
  ContractorTemplate,
  TradeTemplate,
  TemplateStyle,
  HeroLayout,
  FontFamily,
  TEMPLATE_STYLES,
  HERO_LAYOUTS,
  FONT_OPTIONS,
  TRADE_THEME_DEFAULTS,
} from '@/types'
import { Check, Palette, Layout, Type, Eye, Settings2, Loader2 } from 'lucide-react'

interface TemplateSettingsFormProps {
  contractor: Contractor
  template: ContractorTemplate | null
  primaryCategory?: string
  tradeTemplates: TradeTemplate[]
  isPremium: boolean
}

const defaultTemplate: Partial<ContractorTemplate> = {
  template_style: 'modern',
  primary_color: '#1e40af',
  secondary_color: '#3b82f6',
  accent_color: '#f59e0b',
  font_family: 'Inter',
  hero_layout: 'full-width',
  show_testimonials: true,
  show_service_areas: true,
  show_credentials: true,
  custom_tagline: '',
  custom_cta_text: 'Get a Free Quote',
}

export function TemplateSettingsForm({
  contractor,
  template,
  primaryCategory,
  tradeTemplates,
  isPremium,
}: TemplateSettingsFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Get trade defaults
  const tradeDefaults = primaryCategory ? TRADE_THEME_DEFAULTS[primaryCategory] : null

  // Merge template with defaults
  const [settings, setSettings] = useState<Partial<ContractorTemplate>>({
    ...defaultTemplate,
    ...(tradeDefaults && {
      primary_color: tradeDefaults.primary,
      secondary_color: tradeDefaults.secondary,
      accent_color: tradeDefaults.accent,
    }),
    ...template,
  })

  const updateSetting = <K extends keyof ContractorTemplate>(key: K, value: ContractorTemplate[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const applyTradeDefaults = () => {
    if (tradeDefaults) {
      setSettings(prev => ({
        ...prev,
        primary_color: tradeDefaults.primary,
        secondary_color: tradeDefaults.secondary,
        accent_color: tradeDefaults.accent,
      }))
    }
  }

  const handleSave = async () => {
    if (!isPremium) {
      setMessage({ type: 'error', text: 'Upgrade to Premium to save template settings' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()

      if (template?.id) {
        // Update existing template
        const { error } = await supabase
          .from('contractor_templates')
          .update({
            template_style: settings.template_style,
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            accent_color: settings.accent_color,
            font_family: settings.font_family,
            hero_layout: settings.hero_layout,
            show_testimonials: settings.show_testimonials,
            show_service_areas: settings.show_service_areas,
            show_credentials: settings.show_credentials,
            custom_tagline: settings.custom_tagline || null,
            custom_cta_text: settings.custom_cta_text,
          })
          .eq('id', template.id)

        if (error) throw error
      } else {
        // Create new template
        const { error } = await supabase.from('contractor_templates').insert({
          contractor_id: contractor.id,
          template_style: settings.template_style,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          font_family: settings.font_family,
          hero_layout: settings.hero_layout,
          show_testimonials: settings.show_testimonials,
          show_service_areas: settings.show_service_areas,
          show_credentials: settings.show_credentials,
          custom_tagline: settings.custom_tagline || null,
          custom_cta_text: settings.custom_cta_text,
        })

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Template settings saved successfully!' })
      router.refresh()
    } catch (error) {
      console.error('Error saving template:', error)
      setMessage({ type: 'error', text: 'Failed to save template settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Typography</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Sections</span>
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Customize the colors of your mini-website to match your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tradeDefaults && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Apply Trade Defaults</p>
                    <p className="text-sm text-gray-500">
                      Use recommended colors for {tradeDefaults.name}
                    </p>
                  </div>
                  <Button variant="outline" onClick={applyTradeDefaults} disabled={!isPremium}>
                    Apply
                  </Button>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primary_color"
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      disabled={!isPremium}
                      className="w-12 h-12 rounded-lg border cursor-pointer disabled:opacity-50"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      disabled={!isPremium}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used for headers and buttons</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="secondary_color"
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      disabled={!isPremium}
                      className="w-12 h-12 rounded-lg border cursor-pointer disabled:opacity-50"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      disabled={!isPremium}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used for gradients and hover states</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="accent_color"
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      disabled={!isPremium}
                      className="w-12 h-12 rounded-lg border cursor-pointer disabled:opacity-50"
                    />
                    <Input
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      disabled={!isPremium}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used for highlights and badges</p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6 p-6 rounded-xl" style={{
                background: `linear-gradient(135deg, ${settings.primary_color} 0%, ${settings.secondary_color} 100%)`
              }}>
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Preview Header</h3>
                  <p className="text-white/80 mb-4">This is how your header gradient will look</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: settings.accent_color }}
                  >
                    Accent Badge
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Hero Layout</CardTitle>
              <CardDescription>
                Choose how the top section of your profile page looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {HERO_LAYOUTS.map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => isPremium && updateSetting('hero_layout', layout.value)}
                    disabled={!isPremium}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      settings.hero_layout === layout.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {settings.hero_layout === layout.value && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Layout Preview */}
                    <div className="mb-3 h-20 rounded-lg overflow-hidden bg-gray-100">
                      {layout.value === 'full-width' && (
                        <div className="h-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-end p-2">
                          <div className="w-8 h-8 bg-white rounded" />
                        </div>
                      )}
                      {layout.value === 'split' && (
                        <div className="h-full flex">
                          <div className="w-1/2 p-2 flex flex-col justify-center">
                            <div className="w-3/4 h-2 bg-gray-300 rounded mb-1" />
                            <div className="w-1/2 h-2 bg-gray-300 rounded" />
                          </div>
                          <div className="w-1/2 bg-gray-300" />
                        </div>
                      )}
                      {layout.value === 'minimal' && (
                        <div className="h-full bg-white border-b flex items-center p-2 gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded" />
                          <div>
                            <div className="w-16 h-2 bg-gray-300 rounded mb-1" />
                            <div className="w-12 h-2 bg-gray-200 rounded" />
                          </div>
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-900">{layout.label}</h4>
                    <p className="text-sm text-gray-500">{layout.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <Label>Template Style</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {TEMPLATE_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => isPremium && updateSetting('template_style', style.value)}
                      disabled={!isPremium}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        settings.template_style === style.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Choose fonts and text settings for your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Font Family</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => isPremium && updateSetting('font_family', font.value)}
                      disabled={!isPremium}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        settings.font_family === font.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-lg font-semibold">{font.label}</span>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: font.value }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_tagline">Custom Tagline</Label>
                  <Input
                    id="custom_tagline"
                    placeholder="e.g., Houston's Most Trusted Electrician Since 1995"
                    value={settings.custom_tagline || ''}
                    onChange={(e) => updateSetting('custom_tagline', e.target.value)}
                    disabled={!isPremium}
                  />
                  <p className="text-xs text-gray-500">
                    Displays below your business name on the profile
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_cta_text">Call-to-Action Button Text</Label>
                  <Input
                    id="custom_cta_text"
                    placeholder="Get a Free Quote"
                    value={settings.custom_cta_text}
                    onChange={(e) => updateSetting('custom_cta_text', e.target.value)}
                    disabled={!isPremium}
                  />
                  <p className="text-xs text-gray-500">
                    Text shown on your main contact button
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Section Visibility</CardTitle>
              <CardDescription>
                Choose which sections to display on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="show_testimonials" className="font-medium">
                    Show Reviews/Testimonials
                  </Label>
                  <p className="text-sm text-gray-500">Display customer reviews on your profile</p>
                </div>
                <Switch
                  id="show_testimonials"
                  checked={settings.show_testimonials}
                  onCheckedChange={(checked) => updateSetting('show_testimonials', checked)}
                  disabled={!isPremium}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="show_service_areas" className="font-medium">
                    Show Service Areas
                  </Label>
                  <p className="text-sm text-gray-500">Display the areas you serve</p>
                </div>
                <Switch
                  id="show_service_areas"
                  checked={settings.show_service_areas}
                  onCheckedChange={(checked) => updateSetting('show_service_areas', checked)}
                  disabled={!isPremium}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="show_credentials" className="font-medium">
                    Show Credentials
                  </Label>
                  <p className="text-sm text-gray-500">
                    Display license number, insurance status, years in business
                  </p>
                </div>
                <Switch
                  id="show_credentials"
                  checked={settings.show_credentials}
                  onCheckedChange={(checked) => updateSetting('show_credentials', checked)}
                  disabled={!isPremium}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button and Messages */}
      <div className="flex items-center justify-between">
        <div>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(`/contractors/${contractor.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
          <Button onClick={handleSave} disabled={saving || !isPremium}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isPremium ? 'Save Changes' : 'Upgrade to Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

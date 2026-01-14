import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TemplateSettingsForm } from './TemplateSettingsForm'

export default async function TemplateSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/template')
  }

  // Get contractor with template settings
  const { data: contractor } = await supabase
    .from('contractors')
    .select(`
      *,
      contractor_templates (*),
      contractor_categories (
        category:categories (slug, name)
      )
    `)
    .eq('user_id', user.id)
    .single()

  if (!contractor) {
    redirect('/register/contractor')
  }

  // Get trade templates for defaults
  const { data: tradeTemplates } = await supabase
    .from('trade_templates')
    .select('*')

  // Get the primary category for default theme
  const primaryCategory = contractor.contractor_categories?.[0]?.category?.slug

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Template</h1>
        <p className="text-gray-600 mt-2">
          Customize how your contractor profile looks to customers
        </p>
      </div>

      {contractor.tier === 'free' ? (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="text-white/90 mb-6 max-w-2xl">
            Get full customization of your mini-website with custom colors, multiple hero layouts,
            font choices, and trade-specific templates that help you stand out from the competition.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Custom Colors</h3>
              <p className="text-sm text-white/80">Match your brand identity</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Hero Layouts</h3>
              <p className="text-sm text-white/80">3 professional designs</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Font Choices</h3>
              <p className="text-sm text-white/80">5 premium font families</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Trade Templates</h3>
              <p className="text-sm text-white/80">Industry-specific designs</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Custom Tagline</h3>
              <p className="text-sm text-white/80">Your unique message</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Section Controls</h3>
              <p className="text-sm text-white/80">Show/hide sections</p>
            </div>
          </div>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Upgrade Now - $29/month
          </button>
        </div>
      ) : null}

      <TemplateSettingsForm
        contractor={contractor}
        template={contractor.contractor_templates}
        primaryCategory={primaryCategory}
        tradeTemplates={tradeTemplates || []}
        isPremium={contractor.tier === 'premium'}
      />
    </div>
  )
}

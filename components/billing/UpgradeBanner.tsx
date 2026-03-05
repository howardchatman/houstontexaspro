'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContractorTier } from '@/types'

interface UpgradeBannerProps {
  currentTier: ContractorTier
  feature: string
  targetTier?: 'pro' | 'elite'
}

export function UpgradeBanner({ currentTier, feature, targetTier = 'pro' }: UpgradeBannerProps) {
  const [loading, setLoading] = useState(false)

  if (currentTier === 'elite') return null
  if (currentTier === 'pro' && targetTier === 'pro') return null

  const tierName = targetTier === 'elite' ? 'Elite' : 'Pro'
  const price = targetTier === 'elite' ? '$299' : '$149'

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#0B0B0B] to-[#1F3C58] rounded-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">
        Upgrade to {tierName}
      </h3>
      <p className="text-white/80 text-sm mb-4">
        {feature}
      </p>
      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-white text-[#0B0B0B] hover:bg-white/90"
      >
        {loading ? 'Please wait...' : (
          <>
            Upgrade — {price}/mo
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}

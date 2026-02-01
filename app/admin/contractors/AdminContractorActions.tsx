'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AdminContractorActionsProps {
  contractorId: string
  isVerified: boolean
  isFeatured: boolean
}

export default function AdminContractorActions({
  contractorId,
  isVerified,
  isFeatured,
}: AdminContractorActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle(field: 'is_verified' | 'is_featured', currentValue: boolean) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant={isVerified ? 'default' : 'outline'}
        className="text-xs h-7 px-2"
        disabled={loading}
        onClick={() => handleToggle('is_verified', isVerified)}
      >
        {isVerified ? 'Unverify' : 'Verify'}
      </Button>
      <Button
        size="sm"
        variant={isFeatured ? 'default' : 'outline'}
        className="text-xs h-7 px-2"
        disabled={loading}
        onClick={() => handleToggle('is_featured', isFeatured)}
      >
        {isFeatured ? 'Unfeature' : 'Feature'}
      </Button>
    </div>
  )
}

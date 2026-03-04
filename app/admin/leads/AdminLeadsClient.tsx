'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TABS = ['all', 'new', 'contacted', 'converted', 'closed'] as const
const TYPE_TABS = ['all', 'contractor', 'career'] as const

interface Lead {
  id: string
  name: string
  full_name: string | null
  email: string
  phone: string
  message: string | null
  status: string
  start_timeframe: string | null
  created_at: string
  contractors?: { business_name: string } | null
  careers?: { title: string; slug: string } | null
  schools?: { name: string } | null
}

export default function AdminLeadsClient({ leads }: { leads: Lead[] }) {
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [activeType, setActiveType] = useState<string>('all')

  let filtered = activeStatus === 'all' ? leads : leads.filter((l) => l.status === activeStatus)

  if (activeType === 'contractor') {
    filtered = filtered.filter((l) => l.contractors)
  } else if (activeType === 'career') {
    filtered = filtered.filter((l) => l.careers || l.schools)
  }

  return (
    <div>
      {/* Type filter */}
      <div className="flex gap-2 mb-4">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveType(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeType === tab
                ? 'bg-[#1F3C58] text-white'
                : 'bg-gray-100 text-[#374151] hover:bg-gray-200'
            }`}
          >
            {tab === 'contractor' ? 'Contractor Leads' : tab === 'career' ? 'Career Leads' : 'All Types'}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => {
          const count = tab === 'all' ? leads.length : leads.filter((l) => l.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveStatus(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-[#374151] hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
            </button>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F5F5F5]">
                  <th className="text-left p-4 font-medium text-[#6B7280]">Name</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Email</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Phone</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Routed To</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Timeframe</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Status</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0 hover:bg-[#F5F5F5]">
                      <td className="p-4 font-medium text-[#0B0B0B]">
                        {lead.full_name || lead.name}
                      </td>
                      <td className="p-4 text-[#374151]">{lead.email}</td>
                      <td className="p-4 text-[#374151]">{lead.phone || '—'}</td>
                      <td className="p-4 text-[#374151]">
                        {lead.contractors?.business_name ? (
                          <span>{lead.contractors.business_name}</span>
                        ) : lead.careers ? (
                          <span className="text-[#1F3C58] font-medium">
                            {lead.careers.title}
                            {lead.schools && (
                              <span className="text-[#6B7280] font-normal"> · {lead.schools.name}</span>
                            )}
                          </span>
                        ) : lead.schools ? (
                          <span className="text-[#1F3C58]">{lead.schools.name}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-[#374151]">
                        {lead.start_timeframe
                          ? lead.start_timeframe.replace(/_/g, ' ')
                          : '—'}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={lead.status === 'new' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#6B7280] text-xs">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

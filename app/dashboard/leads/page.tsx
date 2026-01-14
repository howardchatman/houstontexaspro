'use client'

import { useState, useEffect } from 'react'
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Lead, LeadStatus } from '@/types'

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  converted: 'bg-green-500',
  closed: 'bg-gray-500',
}

const statusIcons: Record<LeadStatus, typeof Clock> = {
  new: Clock,
  contacted: Phone,
  converted: CheckCircle,
  closed: XCircle,
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<LeadStatus | 'all'>('all')
  const supabase = createClient()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!contractor) return

    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('contractor_id', contractor.id)
      .order('created_at', { ascending: false })

    setLeads(data || [])
    setLoading(false)
  }

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)

    if (!error) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status } : lead
        )
      )
    }
  }

  const filteredLeads =
    activeTab === 'all'
      ? leads
      : leads.filter((lead) => lead.status === activeTab)

  const getLeadCount = (status: LeadStatus | 'all') => {
    if (status === 'all') return leads.length
    return leads.filter((lead) => lead.status === status).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500">Manage your customer inquiries</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LeadStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({getLeadCount('all')})
          </TabsTrigger>
          <TabsTrigger value="new">
            New ({getLeadCount('new')})
          </TabsTrigger>
          <TabsTrigger value="contacted">
            Contacted ({getLeadCount('contacted')})
          </TabsTrigger>
          <TabsTrigger value="converted">
            Converted ({getLeadCount('converted')})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({getLeadCount('closed')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredLeads.length > 0 ? (
            <div className="space-y-4">
              {filteredLeads.map((lead) => {
                const StatusIcon = statusIcons[lead.status]
                return (
                  <Card key={lead.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{lead.name}</h3>
                            <Badge className={statusColors[lead.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </Badge>
                            {lead.source === 'aiva' && (
                              <Badge variant="outline">AIVA Call</Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1 hover:text-blue-600"
                              >
                                <Phone className="h-4 w-4" />
                                {lead.phone}
                              </a>
                            )}
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex items-center gap-1 hover:text-blue-600"
                              >
                                <Mail className="h-4 w-4" />
                                {lead.email}
                              </a>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(lead.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {lead.message && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm text-gray-700">{lead.message}</p>
                            </div>
                          )}

                          {lead.call_transcript && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-3">
                              <p className="text-xs font-medium text-blue-800 mb-1">
                                Call Transcript
                              </p>
                              <p className="text-sm text-blue-700">
                                {lead.call_transcript}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {lead.status === 'new' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateLeadStatus(lead.id, 'contacted')}
                              >
                                Mark Contacted
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLeadStatus(lead.id, 'closed')}
                              >
                                Close
                              </Button>
                            </>
                          )}
                          {lead.status === 'contacted' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateLeadStatus(lead.id, 'converted')}
                              >
                                Mark Converted
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLeadStatus(lead.id, 'closed')}
                              >
                                Close
                              </Button>
                            </>
                          )}
                          {(lead.status === 'converted' || lead.status === 'closed') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateLeadStatus(lead.id, 'new')}
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No {activeTab !== 'all' ? activeTab : ''} leads
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'all'
                    ? 'Leads will appear here when customers contact you'
                    : `No leads with "${activeTab}" status`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

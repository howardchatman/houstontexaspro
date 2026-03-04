'use client'

import { useState, useMemo, useCallback } from 'react'
import { ImportModal } from './components/ImportModal'
import { FiltersBar } from './components/FiltersBar'
import { ProspectsTable } from './components/ProspectsTable'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export interface Prospect {
  id: string
  created_at: string
  source: string
  city: string | null
  trade: string | null
  company_name: string
  phone: string | null
  website: string | null
  address: string | null
  rating: number | null
  google_profile_url: string | null
  review_1: string | null
  review_keyword: string | null
  review_2: string | null
  combined_review: string | null
  communication_issue: boolean
  priority_score: number
  contacted: boolean
  contacted_at: string | null
  status: string
  notes: string | null
}

interface Props {
  initialProspects: Prospect[]
  trades: string[]
}

export function ProspectsClient({ initialProspects, trades }: Props) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [showImport, setShowImport] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [filterTrade, setFilterTrade] = useState('')
  const [filterComm, setFilterComm] = useState<'' | 'yes' | 'no'>('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState<'' | '1' | '2' | '3'>('')

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (search && !p.company_name.toLowerCase().includes(search.toLowerCase())) return false
      if (filterTrade && p.trade !== filterTrade) return false
      if (filterComm === 'yes' && !p.communication_issue) return false
      if (filterComm === 'no' && p.communication_issue) return false
      if (filterStatus && p.status !== filterStatus) return false
      if (filterPriority && String(p.priority_score) !== filterPriority) return false
      return true
    })
  }, [prospects, search, filterTrade, filterComm, filterStatus, filterPriority])

  function updateProspect(id: string, patch: Partial<Prospect>) {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch('/api/admin/prospects/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) updateProspect(id, { status })
    else showToast('Failed to update status', 'error')
  }

  async function handleContactedToggle(id: string, contacted: boolean) {
    const res = await fetch('/api/admin/prospects/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, contacted }),
    })
    if (res.ok) updateProspect(id, { contacted, contacted_at: contacted ? new Date().toISOString() : null })
    else showToast('Failed to update', 'error')
  }

  async function handleNotesSave(id: string, notes: string) {
    const res = await fetch('/api/admin/prospects/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, notes }),
    })
    if (res.ok) updateProspect(id, { notes })
    else showToast('Failed to save notes', 'error')
  }

  async function handleBulkContacted() {
    if (selected.size === 0) return
    const res = await fetch('/api/admin/prospects/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selected], contacted: true }),
    })
    if (res.ok) {
      selected.forEach((id) => updateProspect(id, { contacted: true, contacted_at: new Date().toISOString() }))
      setSelected(new Set())
      showToast(`Marked ${selected.size} as contacted`)
    } else {
      showToast('Bulk update failed', 'error')
    }
  }

  async function handleBulkStatus(status: string) {
    if (selected.size === 0) return
    const res = await fetch('/api/admin/prospects/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selected], status }),
    })
    if (res.ok) {
      selected.forEach((id) => updateProspect(id, { status }))
      setSelected(new Set())
      showToast(`Updated ${selected.size} leads to "${status}"`)
    } else {
      showToast('Bulk update failed', 'error')
    }
  }

  function exportCSV() {
    const headers = [
      'Company', 'Trade', 'Rating', 'Priority', 'Comm Issue',
      'Status', 'Contacted', 'Phone', 'Website', 'Address', 'Notes',
    ]
    const rows = filtered.map((p) => [
      p.company_name,
      p.trade ?? '',
      p.rating ?? '',
      p.priority_score,
      p.communication_issue ? 'YES' : 'NO',
      p.status,
      p.contacted ? 'YES' : 'NO',
      p.phone ?? '',
      p.website ?? '',
      p.address ?? '',
      (p.notes ?? '').replace(/,/g, ';'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prospects-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FiltersBar
          trades={trades}
          search={search} setSearch={setSearch}
          filterTrade={filterTrade} setFilterTrade={setFilterTrade}
          filterComm={filterComm} setFilterComm={setFilterComm}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
        />
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-1.5" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-[#1F3C58] text-white px-4 py-2 rounded-lg text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <button
            onClick={handleBulkContacted}
            className="underline hover:no-underline"
          >
            Mark Contacted
          </button>
          <button
            onClick={() => handleBulkStatus('contacted')}
            className="underline hover:no-underline"
          >
            Set → Contacted
          </button>
          <button
            onClick={() => handleBulkStatus('won')}
            className="underline hover:no-underline"
          >
            Set → Won
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-white/70 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      <p className="text-xs text-[#6B7280]">
        Showing {filtered.length} of {prospects.length} prospects
      </p>

      <ProspectsTable
        prospects={filtered}
        selected={selected}
        setSelected={setSelected}
        onStatusChange={handleStatusChange}
        onContactedToggle={handleContactedToggle}
        onNotesSave={handleNotesSave}
      />

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onSuccess={(result) => {
            setShowImport(false)
            showToast(`Imported ${result.inserted} new, updated ${result.updated}`)
            // Reload page data
            window.location.reload()
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#0B0B0B] text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}

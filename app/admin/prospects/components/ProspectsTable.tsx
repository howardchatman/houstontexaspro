'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Prospect } from '../ProspectsClient'

const STATUSES = ['new', 'contacted', 'replied', 'demo', 'won', 'lost']

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  replied: 'bg-purple-50 text-purple-700',
  demo: 'bg-orange-50 text-orange-700',
  won: 'bg-green-50 text-green-700',
  lost: 'bg-gray-100 text-gray-500',
}

const PRIORITY_COLORS: Record<number, string> = {
  3: 'bg-red-100 text-red-700',
  2: 'bg-amber-100 text-amber-700',
  1: 'bg-gray-100 text-gray-500',
}

interface Props {
  prospects: Prospect[]
  selected: Set<string>
  setSelected: (s: Set<string>) => void
  onStatusChange: (id: string, status: string) => void
  onContactedToggle: (id: string, contacted: boolean) => void
  onNotesSave: (id: string, notes: string) => void
}

export function ProspectsTable({
  prospects,
  selected,
  setSelected,
  onStatusChange,
  onContactedToggle,
  onNotesSave,
}: Props) {
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState('')

  const allSelected = prospects.length > 0 && prospects.every((p) => selected.has(p.id))

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(prospects.map((p) => p.id)))
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function startEditNotes(p: Prospect) {
    setEditingNotes(p.id)
    setNotesDraft(p.notes ?? '')
  }

  function saveNotes(id: string) {
    onNotesSave(id, notesDraft)
    setEditingNotes(null)
  }

  if (prospects.length === 0) {
    return (
      <div className="text-center py-16 text-[#6B7280] bg-white rounded-xl border border-[#E5E7EB]">
        No prospects match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
            <th className="px-3 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="rounded"
              />
            </th>
            <th className="px-3 py-3">Company</th>
            <th className="px-3 py-3">Trade</th>
            <th className="px-3 py-3 text-center">Rating</th>
            <th className="px-3 py-3 text-center">Priority</th>
            <th className="px-3 py-3 text-center">Comm</th>
            <th className="px-3 py-3">Phone</th>
            <th className="px-3 py-3">Website</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3 text-center">Contacted</th>
            <th className="px-3 py-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F3F4F6]">
          {prospects.map((p) => (
            <tr
              key={p.id}
              className={`hover:bg-[#F9FAFB] transition-colors ${selected.has(p.id) ? 'bg-blue-50' : ''}`}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleOne(p.id)}
                  className="rounded"
                />
              </td>

              <td className="px-3 py-2 font-medium text-[#0B0B0B] whitespace-nowrap max-w-[200px] truncate">
                <div className="flex items-center gap-1.5">
                  {p.google_profile_url ? (
                    <a
                      href={p.google_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Google Profile"
                      className="shrink-0 text-[#9CA3AF] hover:text-[#1F3C58]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <span title={p.company_name}>{p.company_name}</span>
                </div>
                {p.address && (
                  <p className="text-xs text-[#9CA3AF] truncate max-w-[180px]">{p.address}</p>
                )}
              </td>

              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">
                {p.trade ?? <span className="text-[#D1D5DB]">—</span>}
              </td>

              <td className="px-3 py-2 text-center font-medium text-[#374151]">
                {p.rating != null ? (
                  <span className={p.rating < 4.5 ? 'text-amber-600' : ''}>{p.rating}</span>
                ) : (
                  <span className="text-[#D1D5DB]">—</span>
                )}
              </td>

              <td className="px-3 py-2 text-center">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[p.priority_score] ?? 'bg-gray-100 text-gray-500'}`}>
                  P{p.priority_score}
                </span>
              </td>

              <td className="px-3 py-2 text-center">
                {p.communication_issue ? (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">YES</span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-400">NO</span>
                )}
              </td>

              <td className="px-3 py-2 whitespace-nowrap">
                {p.phone ? (
                  <a href={`tel:${p.phone}`} className="text-[#1F3C58] hover:underline text-xs">{p.phone}</a>
                ) : (
                  <span className="text-[#D1D5DB]">—</span>
                )}
              </td>

              <td className="px-3 py-2 whitespace-nowrap max-w-[140px] truncate">
                {p.website ? (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1F3C58] hover:underline text-xs truncate block"
                    title={p.website}
                  >
                    {p.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                ) : (
                  <span className="text-[#D1D5DB]">—</span>
                )}
              </td>

              <td className="px-3 py-2">
                <select
                  value={p.status}
                  onChange={(e) => onStatusChange(p.id, e.target.value)}
                  className={`text-xs border-0 rounded-full px-2.5 py-0.5 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F3C58] ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>

              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={p.contacted}
                  onChange={(e) => onContactedToggle(p.id, e.target.checked)}
                  className="rounded"
                />
              </td>

              <td className="px-3 py-2 min-w-[160px]">
                {editingNotes === p.id ? (
                  <div className="flex gap-1">
                    <textarea
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      rows={2}
                      className="text-xs border border-[#E5E7EB] rounded p-1 flex-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#1F3C58]"
                      autoFocus
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => saveNotes(p.id)}
                        className="text-xs text-white bg-[#0B0B0B] rounded px-2 py-0.5 hover:bg-[#374151]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="text-xs text-[#6B7280] hover:text-[#0B0B0B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditNotes(p)}
                    className="text-left text-xs text-[#6B7280] hover:text-[#0B0B0B] w-full truncate"
                    title={p.notes ?? 'Click to add notes'}
                  >
                    {p.notes ? (
                      <span className="text-[#374151]">{p.notes}</span>
                    ) : (
                      <span className="italic text-[#D1D5DB]">Add note…</span>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

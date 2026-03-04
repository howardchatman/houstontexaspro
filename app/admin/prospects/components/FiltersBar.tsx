'use client'

import { Search } from 'lucide-react'

const STATUSES = ['new', 'contacted', 'replied', 'demo', 'won', 'lost']

interface Props {
  trades: string[]
  search: string
  setSearch: (v: string) => void
  filterTrade: string
  setFilterTrade: (v: string) => void
  filterComm: '' | 'yes' | 'no'
  setFilterComm: (v: '' | 'yes' | 'no') => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  filterPriority: '' | '1' | '2' | '3'
  setFilterPriority: (v: '' | '1' | '2' | '3') => void
}

export function FiltersBar({
  trades,
  search, setSearch,
  filterTrade, setFilterTrade,
  filterComm, setFilterComm,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
}: Props) {
  const selectCls = 'text-sm border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1F3C58]'

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm pl-8 pr-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-[#374151] w-52 focus:outline-none focus:ring-2 focus:ring-[#1F3C58]"
        />
      </div>

      {trades.length > 0 && (
        <select
          value={filterTrade}
          onChange={(e) => setFilterTrade(e.target.value)}
          className={selectCls}
        >
          <option value="">All Trades</option>
          {trades.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      )}

      <select
        value={filterComm}
        onChange={(e) => setFilterComm(e.target.value as '' | 'yes' | 'no')}
        className={selectCls}
      >
        <option value="">Comm Issue: All</option>
        <option value="yes">Comm Issue: YES</option>
        <option value="no">Comm Issue: NO</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className={selectCls}
      >
        <option value="">All Status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value as '' | '1' | '2' | '3')}
        className={selectCls}
      >
        <option value="">All Priority</option>
        <option value="3">P3 — Comm Issue</option>
        <option value="2">P2 — Low Rating</option>
        <option value="1">P1 — Standard</option>
      </select>
    </div>
  )
}

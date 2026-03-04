'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Papa from 'papaparse'

interface ImportResult {
  inserted: number
  updated: number
  errors: string[]
}

interface Props {
  onClose: () => void
  onSuccess: (result: ImportResult) => void
  onError: (msg: string) => void
}

const HEADER_MAP: Record<string, string> = {
  'google profile': 'google_profile_url',
  'company name': 'company_name',
  rating: 'rating',
  trade: 'trade',
  address: 'address',
  'address 2': 'address2',
  phone: 'phone',
  website: 'website',
  reviews_1: 'review_1',
  'review 1': 'review_1',
  'review keyword': 'review_keyword',
  reviews_2: 'review_2',
  'review 2': 'review_2',
  'combined reviews': 'combined_review',
  city: 'city',
}

export function ImportModal({ onClose, onSuccess, onError }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function parsePreview(f: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const result = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true, preview: 11 })
      if (result.data.length < 2) return
      const [rawHeaders, ...dataRows] = result.data
      const headers = (rawHeaders as string[]).map((h) => {
        const mapped = HEADER_MAP[h.toLowerCase().trim()]
        return mapped ? `${mapped} ← ${h}` : h
      })
      setPreview({ headers, rows: dataRows as string[][] })
    }
    reader.readAsText(f)
  }

  function handleFileSelect(f: File) {
    if (!f.name.endsWith('.csv')) {
      onError('Please upload a .csv file')
      return
    }
    setFile(f)
    parsePreview(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }, [])

  async function handleImport() {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/prospects/import', { method: 'POST', body: fd })
      const data: ImportResult & { error?: string } = await res.json()
      if (!res.ok) {
        onError(data.error ?? 'Import failed')
      } else {
        onSuccess(data)
      }
    } catch {
      onError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#0B0B0B]">Import Prospects CSV</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-[#1F3C58] bg-blue-50' : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-[#374151]">
                <FileText className="h-5 w-5 text-[#1F3C58]" />
                <span className="font-medium">{file.name}</span>
                <span className="text-[#9CA3AF] text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <div className="text-[#6B7280]">
                <Upload className="h-8 w-8 mx-auto mb-2 text-[#9CA3AF]" />
                <p className="font-medium">Drop a CSV file here or click to browse</p>
                <p className="text-xs mt-1">Expected columns: Company Name, Rating, Trade, Address, Phone, Website, Google Profile, Reviews_1, Review Keyword, Reviews_2</p>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Preview (first 10 rows)
              </p>
              <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] text-xs">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      {preview.headers.map((h, i) => (
                        <th key={i} className="px-2 py-1.5 text-left font-medium text-[#6B7280] whitespace-nowrap border-b border-[#E5E7EB]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {preview.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1 text-[#374151] max-w-[120px] truncate" title={cell}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-[#F9FAFB] rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? 'Importing…' : `Import${file ? ` "${file.name}"` : ''}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

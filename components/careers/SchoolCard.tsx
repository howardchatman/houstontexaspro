import Link from 'next/link'
import { MapPin, Phone, Globe, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SchoolWithPrograms } from '@/lib/careers'

export function SchoolCard({ school }: { school: SchoolWithPrograms }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-[#0B0B0B]">{school.name}</CardTitle>
          {school.is_featured && (
            <Badge className="bg-[#1F3C58] text-white shrink-0">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </Badge>
          )}
        </div>
        {(school.city || school.state) && (
          <p className="flex items-center gap-1 text-sm text-[#6B7280]">
            <MapPin className="h-3 w-3" />
            {[school.city, school.state].filter(Boolean).join(', ')}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {school.description && (
          <p className="text-sm text-[#374151] line-clamp-3">{school.description}</p>
        )}

        {school.programs && school.programs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
              Programs
            </p>
            <div className="flex flex-wrap gap-1">
              {school.programs.slice(0, 4).map((p) => (
                <Badge key={p.id} variant="secondary" className="text-xs">
                  {p.program_name}
                </Badge>
              ))}
              {school.programs.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{school.programs.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 text-sm text-[#374151]">
          {school.phone && (
            <a
              href={`tel:${school.phone}`}
              className="flex items-center gap-2 hover:text-[#1F3C58]"
            >
              <Phone className="h-4 w-4" />
              {school.phone}
            </a>
          )}
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#1F3C58] truncate"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">{school.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        <Button asChild className="w-full">
          <Link href={`/schools/${school.id}`}>View School</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

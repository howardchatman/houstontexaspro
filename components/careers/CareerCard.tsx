import Link from 'next/link'
import type { Career } from '@/lib/careers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CareerCard({ career }: { career: Career }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl text-[#0B0B0B]">{career.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#4B5563]">
          {career.short_description || `Explore training and school options for ${career.title} in Houston.`}
        </p>
        <Button asChild>
          <Link href={`/careers/${career.slug}`}>View Career Path</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

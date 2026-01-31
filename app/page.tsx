import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryGrid } from '@/components/contractors/CategoryGrid'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section - Full Viewport */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1609722891908-b5b39a30b41d?w=1920&q=80')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8">
            Houston Contractors
            <br />
            <span className="text-white/80">Who Answer.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-12 leading-relaxed">
            Burst pipe at 2 AM or a kitchen remodel next month.
            Reach a contractor who actually picks up.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 text-base px-8 py-6 rounded-full"
              asChild
            >
              <Link href="/contractors">
                Find a Contractor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 text-base px-8 py-6 rounded-full"
              asChild
            >
              <Link href="/register/contractor">Get Listed</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              What do you
              <br />
              need done?
            </h2>
            <p className="text-lg text-slate-500">
              Residential. Commercial. Emergency or scheduled.
            </p>
          </div>

          <CategoryGrid limit={8} />

          <div className="mt-12">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base"
              asChild
            >
              <Link href="/categories">
                Browse All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 text-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Stop chasing
              <br />
              voicemails.
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
              Submit your request and we&apos;ll route it to contractors
              who are ready to respond.
            </p>
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 text-base px-8 py-6 rounded-full"
              asChild
            >
              <Link href="/contractors">
                Find a Contractor Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

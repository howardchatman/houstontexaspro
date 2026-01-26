import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'
import { Button } from '@/components/ui/button'

export function Footer() {
  const topCategories = CONTRACTOR_CATEGORIES.slice(0, 8)
  const topAreas = HOUSTON_AREAS.slice(0, 6)

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* CTA Strip */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Need a contractor?</h3>
              <p className="text-slate-400 text-sm">Submit a request. We&apos;ll route it to pros who respond.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/contractors">
                  Find a Contractor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
                <Link href="/register/contractor">
                  Get Listed
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-slate-900 font-bold px-3 py-1.5 rounded">
                HTP
              </div>
              <div className="text-white font-bold text-lg">Houston Texas Pro</div>
            </div>
            <p className="text-sm mb-2 text-white font-medium">
              Houston&apos;s Contractor Command Center
            </p>
            <p className="text-sm mb-6">
              Fast connections. Real follow-through. No runaround.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:support@houstontexaspro.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                support@houstontexaspro.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Serving Greater Houston 24/7
              </div>
            </div>
          </div>

          {/* For Homeowners */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Homeowners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contractors" className="hover:text-white transition-colors">
                  Find a Contractor
                </Link>
              </li>
              <li>
                <Link href="/contractors?emergency=true" className="hover:text-white transition-colors">
                  Emergency Services
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold mt-6 mb-3">Popular Services</h4>
            <ul className="space-y-2 text-sm">
              {topCategories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Contractors */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Contractors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register/contractor" className="hover:text-white transition-colors">
                  Get Listed — Free
                </Link>
              </li>
              <li>
                <Link href="/for-contractors" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Contractor Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold mt-6 mb-3">Service Areas</h4>
            <ul className="space-y-2 text-sm">
              {topAreas.map((area) => (
                <li key={area}>
                  <Link
                    href={`/search?area=${encodeURIComponent(area)}`}
                    className="hover:text-white transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

            {/* Trust indicators */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Every contractor is:</p>
              <ul className="text-xs space-y-1">
                <li className="text-slate-400">✓ Licensed & verified</li>
                <li className="text-slate-400">✓ Insurance confirmed</li>
                <li className="text-slate-400">✓ Background checked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} HoustonTexasPro. All rights reserved.</p>
            <p className="mt-2 md:mt-0 text-slate-500">
              Houston-owned. Contractor-focused. No runaround.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

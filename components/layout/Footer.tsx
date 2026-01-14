import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'

export function Footer() {
  const topCategories = CONTRACTOR_CATEGORIES.slice(0, 10)
  const topAreas = HOUSTON_AREAS.slice(0, 8)

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-blue-900 font-bold px-3 py-1 rounded">
                HTP
              </div>
              <div className="text-white font-bold text-lg">Houston Texas Pro</div>
            </div>
            <p className="text-sm mb-4">
              Houston&apos;s premier directory for finding trusted, verified contractors
              for all your residential and commercial needs.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" />
                1-800-123-4567
              </a>
              <a href="mailto:info@houstontexaspro.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" />
                info@houstontexaspro.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Houston, Texas
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              {topCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className="text-blue-400 hover:text-blue-300">
                  View All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4">Service Areas</h3>
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
              <li>
                <Link href="/areas" className="text-blue-400 hover:text-blue-300">
                  View All Areas
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contractors" className="hover:text-white transition-colors">
                  Browse Contractors
                </Link>
              </li>
              <li>
                <Link href="/register/contractor" className="hover:text-white transition-colors">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
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

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} Houston Texas Pro. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Connecting Houston with trusted contractors since 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

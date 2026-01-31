// Database types for Houston Texas Pro

export type UserRole = 'customer' | 'contractor' | 'admin'
export type LeadSource = 'form' | 'call' | 'aiva'
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed'
export type ServiceType = 'residential' | 'commercial' | 'both'

// Premium template types
export type ContractorTier = 'free' | 'premium'
export type TemplateStyle = 'modern' | 'classic' | 'bold' | 'minimal'
export type HeroLayout = 'full-width' | 'split' | 'minimal'
export type FontFamily = 'Inter' | 'Roboto' | 'Poppins' | 'Playfair Display' | 'Montserrat'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  parent_id: string | null
  service_type: ServiceType
}

export interface Contractor {
  id: string
  user_id: string
  business_name: string
  slug: string
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string
  zip_code: string | null
  service_area: string[]
  license_number: string | null
  insurance_verified: boolean
  years_in_business: number | null
  logo_url: string | null
  cover_image_url: string | null
  is_featured: boolean
  is_verified: boolean
  avg_rating: number
  review_count: number
  tier: ContractorTier
  created_at: string
  updated_at: string
  // Joined data
  categories?: Category[]
  profile?: Profile
  contractor_templates?: ContractorTemplate | null
}

// Template customization interface
export interface ContractorTemplate {
  id: string
  contractor_id: string
  template_style: TemplateStyle
  primary_color: string
  secondary_color: string
  accent_color: string
  font_family: FontFamily
  hero_layout: HeroLayout
  show_testimonials: boolean
  show_service_areas: boolean
  show_credentials: boolean
  custom_tagline: string | null
  custom_cta_text: string
  created_at: string
  updated_at: string
}

// Trade-specific default templates
export interface TradeTemplate {
  id: string
  category_slug: string
  template_name: string
  default_primary_color: string
  default_secondary_color: string
  default_accent_color: string
  hero_image_url: string | null
  icon_set: string | null
  created_at: string
}

export interface ContractorCategory {
  contractor_id: string
  category_id: string
}

export interface GalleryImage {
  id: string
  contractor_id: string
  image_url: string
  caption: string | null
  project_type: string | null
  display_order: number
  created_at: string
}

export interface Review {
  id: string
  contractor_id: string
  user_id: string
  rating: number
  title: string | null
  content: string
  project_type: string | null
  is_verified: boolean
  helpful_count: number
  contractor_response: string | null
  response_date: string | null
  created_at: string
  updated_at: string
  // Joined data
  profile?: Profile
}

export interface Lead {
  id: string
  contractor_id: string
  name: string
  email: string | null
  phone: string | null
  message: string | null
  source: LeadSource
  status: LeadStatus
  call_recording_url: string | null
  call_transcript: string | null
  created_at: string
}

// Search and filter types
export interface ContractorSearchParams {
  query?: string
  category?: string
  rating?: number
  verified?: boolean
  city?: string
  sortBy?: 'rating' | 'reviews' | 'newest'
}

// Form types
export interface ContractorFormData {
  business_name: string
  description: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  zip_code: string
  service_area: string[]
  license_number: string
  years_in_business: number
  categories: string[]
}

export interface LeadFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface ReviewFormData {
  rating: number
  title: string
  content: string
  project_type: string
}

// Category constants
export const CONTRACTOR_CATEGORIES = [
  { name: 'General Contractors', slug: 'general-contractors', icon: 'Hammer' },
  { name: 'Electrical', slug: 'electrical', icon: 'Zap' },
  { name: 'Plumbing', slug: 'plumbing', icon: 'Droplets' },
  { name: 'HVAC', slug: 'hvac', icon: 'Wind' },
  { name: 'Roofing', slug: 'roofing', icon: 'Home' },
  { name: 'Painting', slug: 'painting', icon: 'Paintbrush' },
  { name: 'Flooring', slug: 'flooring', icon: 'LayoutGrid' },
  { name: 'Landscaping', slug: 'landscaping', icon: 'TreeDeciduous' },
  { name: 'Concrete & Masonry', slug: 'concrete-masonry', icon: 'Layers' },
  { name: 'Fencing', slug: 'fencing', icon: 'Fence' },
  { name: 'Windows & Doors', slug: 'windows-doors', icon: 'DoorOpen' },
  { name: 'Kitchen Remodeling', slug: 'kitchen-remodeling', icon: 'ChefHat' },
  { name: 'Bathroom Remodeling', slug: 'bathroom-remodeling', icon: 'Bath' },
  { name: 'Pool Contractors', slug: 'pool-contractors', icon: 'Waves' },
  { name: 'Foundation Repair', slug: 'foundation-repair', icon: 'Building' },
  { name: 'Pest Control', slug: 'pest-control', icon: 'Bug' },
  { name: 'Home Security', slug: 'home-security', icon: 'Shield' },
  { name: 'Solar Installation', slug: 'solar-installation', icon: 'Sun' },
  { name: 'Garage Doors', slug: 'garage-doors', icon: 'Warehouse' },
  { name: 'Drywall', slug: 'drywall', icon: 'Square' },
  { name: 'Insulation', slug: 'insulation', icon: 'ThermometerSnowflake' },
  { name: 'Siding', slug: 'siding', icon: 'PanelLeft' },
  { name: 'Moving Services', slug: 'moving-services', icon: 'Truck' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'Refrigerator' },
  { name: 'Locksmith Services', slug: 'locksmith-services', icon: 'KeyRound' },
  { name: 'Pressure Washing', slug: 'pressure-washing', icon: 'Droplets' },
  { name: 'Tree Services', slug: 'tree-services', icon: 'TreePine' },
  { name: 'Demolition', slug: 'demolition', icon: 'Trash2' },
  { name: 'Handyman Services', slug: 'handyman-services', icon: 'Wrench' },
  { name: 'Cleaning Services', slug: 'cleaning-services', icon: 'Sparkles' },
  { name: 'Real Estate Services', slug: 'real-estate-services', icon: 'HomeIcon' },
  { name: 'Insurance Services', slug: 'insurance-services', icon: 'ShieldCheck' },
] as const

export const HOUSTON_AREAS = [
  'Downtown Houston',
  'Midtown',
  'Montrose',
  'The Heights',
  'River Oaks',
  'Galleria',
  'Memorial',
  'Katy',
  'Sugar Land',
  'The Woodlands',
  'Pearland',
  'Clear Lake',
  'Pasadena',
  'Baytown',
  'Humble',
  'Kingwood',
  'Cypress',
  'Spring',
  'Tomball',
  'Conroe',
] as const

// Default trade colors by category slug
export const TRADE_THEME_DEFAULTS: Record<string, { primary: string; secondary: string; accent: string; name: string }> = {
  'general-contractors': { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6', name: 'General Pro' },
  'electrical': { primary: '#eab308', secondary: '#ca8a04', accent: '#1e3a8a', name: 'Electrician Pro' },
  'plumbing': { primary: '#2563eb', secondary: '#1d4ed8', accent: '#60a5fa', name: 'Plumber Pro' },
  'hvac': { primary: '#0891b2', secondary: '#0e7490', accent: '#67e8f9', name: 'HVAC Pro' },
  'roofing': { primary: '#dc2626', secondary: '#b91c1c', accent: '#fca5a5', name: 'Roofer Pro' },
  'painting': { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#c4b5fd', name: 'Painter Pro' },
  'flooring': { primary: '#92400e', secondary: '#78350f', accent: '#fbbf24', name: 'Flooring Pro' },
  'landscaping': { primary: '#16a34a', secondary: '#15803d', accent: '#86efac', name: 'Landscaper Pro' },
  'concrete-masonry': { primary: '#64748b', secondary: '#475569', accent: '#94a3b8', name: 'Concrete Pro' },
  'fencing': { primary: '#854d0e', secondary: '#713f12', accent: '#fcd34d', name: 'Fence Pro' },
  'windows-doors': { primary: '#0369a1', secondary: '#075985', accent: '#38bdf8', name: 'Windows Pro' },
  'kitchen-remodeling': { primary: '#be185d', secondary: '#9d174d', accent: '#f9a8d4', name: 'Kitchen Pro' },
  'bathroom-remodeling': { primary: '#0d9488', secondary: '#0f766e', accent: '#5eead4', name: 'Bathroom Pro' },
  'pool-contractors': { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', name: 'Pool Pro' },
  'foundation-repair': { primary: '#78716c', secondary: '#57534e', accent: '#a8a29e', name: 'Foundation Pro' },
  'pest-control': { primary: '#65a30d', secondary: '#4d7c0f', accent: '#bef264', name: 'Pest Pro' },
  'home-security': { primary: '#1e293b', secondary: '#0f172a', accent: '#64748b', name: 'Security Pro' },
  'solar-installation': { primary: '#f97316', secondary: '#ea580c', accent: '#fdba74', name: 'Solar Pro' },
  'garage-doors': { primary: '#525252', secondary: '#404040', accent: '#a3a3a3', name: 'Garage Pro' },
  'drywall': { primary: '#78716c', secondary: '#57534e', accent: '#d6d3d1', name: 'Drywall Pro' },
  'insulation': { primary: '#ec4899', secondary: '#db2777', accent: '#f9a8d4', name: 'Insulation Pro' },
  'siding': { primary: '#059669', secondary: '#047857', accent: '#6ee7b7', name: 'Siding Pro' },
  'moving-services': { primary: '#c2410c', secondary: '#9a3412', accent: '#fb923c', name: 'Moving Pro' },
  'appliance-repair': { primary: '#475569', secondary: '#334155', accent: '#94a3b8', name: 'Appliance Pro' },
  'locksmith-services': { primary: '#b45309', secondary: '#92400e', accent: '#fbbf24', name: 'Locksmith Pro' },
  'pressure-washing': { primary: '#0284c7', secondary: '#0369a1', accent: '#38bdf8', name: 'Pressure Wash Pro' },
  'tree-services': { primary: '#166534', secondary: '#14532d', accent: '#4ade80', name: 'Tree Pro' },
  'demolition': { primary: '#ef4444', secondary: '#dc2626', accent: '#fca5a5', name: 'Demo Pro' },
  'handyman-services': { primary: '#d97706', secondary: '#b45309', accent: '#fcd34d', name: 'Handyman Pro' },
  'cleaning-services': { primary: '#06b6d4', secondary: '#0891b2', accent: '#67e8f9', name: 'Cleaning Pro' },
  'real-estate-services': { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa', name: 'Real Estate Pro' },
  'insurance-services': { primary: '#0f766e', secondary: '#115e59', accent: '#5eead4', name: 'Insurance Pro' },
} as const

// Template style options for UI
export const TEMPLATE_STYLES: { value: TemplateStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'Clean lines, plenty of white space, contemporary feel' },
  { value: 'classic', label: 'Classic', description: 'Traditional layout with elegant typography' },
  { value: 'bold', label: 'Bold', description: 'High contrast, large typography, impactful design' },
  { value: 'minimal', label: 'Minimal', description: 'Simple, content-focused, distraction-free' },
]

// Hero layout options for UI
export const HERO_LAYOUTS: { value: HeroLayout; label: string; description: string }[] = [
  { value: 'full-width', label: 'Full Width', description: 'Large hero image spanning the full width' },
  { value: 'split', label: 'Split', description: 'Side-by-side image and business info' },
  { value: 'minimal', label: 'Minimal', description: 'Clean text-focused header without large image' },
]

// Font family options for UI
export const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Poppins', label: 'Poppins (Friendly)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'Montserrat', label: 'Montserrat (Professional)' },
]

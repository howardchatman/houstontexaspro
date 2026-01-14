-- Premium Templates Migration for Houston Texas Pro
-- Run this after 003_seed_categories.sql

-- Add tier column to contractors table
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium'));

-- Create contractor_templates table for storing customization settings
CREATE TABLE IF NOT EXISTS contractor_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    template_style TEXT NOT NULL DEFAULT 'modern' CHECK (template_style IN ('modern', 'classic', 'bold', 'minimal')),
    primary_color TEXT DEFAULT '#1e40af',
    secondary_color TEXT DEFAULT '#3b82f6',
    accent_color TEXT DEFAULT '#f59e0b',
    font_family TEXT DEFAULT 'Inter' CHECK (font_family IN ('Inter', 'Roboto', 'Poppins', 'Playfair Display', 'Montserrat')),
    hero_layout TEXT DEFAULT 'full-width' CHECK (hero_layout IN ('full-width', 'split', 'minimal')),
    show_testimonials BOOLEAN DEFAULT TRUE,
    show_service_areas BOOLEAN DEFAULT TRUE,
    show_credentials BOOLEAN DEFAULT TRUE,
    custom_tagline TEXT,
    custom_cta_text TEXT DEFAULT 'Get a Free Quote',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(contractor_id)
);

-- Create trade_templates table for predefined templates per trade category
CREATE TABLE IF NOT EXISTS trade_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_slug TEXT NOT NULL UNIQUE,
    template_name TEXT NOT NULL,
    default_primary_color TEXT NOT NULL,
    default_secondary_color TEXT NOT NULL,
    default_accent_color TEXT NOT NULL,
    hero_image_url TEXT,
    icon_set TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE contractor_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contractor_templates
CREATE POLICY "Contractors can view own template"
    ON contractor_templates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = contractor_templates.contractor_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Contractors can insert own template"
    ON contractor_templates FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = contractor_templates.contractor_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Contractors can update own template"
    ON contractor_templates FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = contractor_templates.contractor_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Contractors can delete own template"
    ON contractor_templates FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = contractor_templates.contractor_id
            AND user_id = auth.uid()
        )
    );

-- Public can view contractor templates (for displaying mini-sites)
CREATE POLICY "Public can view contractor templates"
    ON contractor_templates FOR SELECT
    USING (true);

-- RLS Policies for trade_templates (public read only)
CREATE POLICY "Trade templates are viewable by everyone"
    ON trade_templates FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify trade templates"
    ON trade_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger to update updated_at on contractor_templates
CREATE TRIGGER update_contractor_templates_updated_at
    BEFORE UPDATE ON contractor_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed trade templates with default colors for all 25 categories
INSERT INTO trade_templates (category_slug, template_name, default_primary_color, default_secondary_color, default_accent_color) VALUES
    ('general-contractors', 'General Pro', '#1e40af', '#1e3a8a', '#3b82f6'),
    ('electrical', 'Electrician Pro', '#eab308', '#ca8a04', '#1e3a8a'),
    ('plumbing', 'Plumber Pro', '#2563eb', '#1d4ed8', '#60a5fa'),
    ('hvac', 'HVAC Pro', '#0891b2', '#0e7490', '#67e8f9'),
    ('roofing', 'Roofer Pro', '#dc2626', '#b91c1c', '#fca5a5'),
    ('painting', 'Painter Pro', '#8b5cf6', '#7c3aed', '#c4b5fd'),
    ('flooring', 'Flooring Pro', '#92400e', '#78350f', '#fbbf24'),
    ('landscaping', 'Landscaper Pro', '#16a34a', '#15803d', '#86efac'),
    ('concrete-masonry', 'Concrete Pro', '#64748b', '#475569', '#94a3b8'),
    ('fencing', 'Fence Pro', '#854d0e', '#713f12', '#fcd34d'),
    ('windows-doors', 'Windows Pro', '#0369a1', '#075985', '#38bdf8'),
    ('kitchen-remodeling', 'Kitchen Pro', '#be185d', '#9d174d', '#f9a8d4'),
    ('bathroom-remodeling', 'Bathroom Pro', '#0d9488', '#0f766e', '#5eead4'),
    ('pool-contractors', 'Pool Pro', '#0ea5e9', '#0284c7', '#38bdf8'),
    ('foundation-repair', 'Foundation Pro', '#78716c', '#57534e', '#a8a29e'),
    ('pest-control', 'Pest Pro', '#65a30d', '#4d7c0f', '#bef264'),
    ('home-security', 'Security Pro', '#1e293b', '#0f172a', '#64748b'),
    ('solar-installation', 'Solar Pro', '#f97316', '#ea580c', '#fdba74'),
    ('garage-doors', 'Garage Pro', '#525252', '#404040', '#a3a3a3'),
    ('drywall', 'Drywall Pro', '#f5f5f4', '#e7e5e4', '#78716c'),
    ('insulation', 'Insulation Pro', '#ec4899', '#db2777', '#f9a8d4'),
    ('siding', 'Siding Pro', '#059669', '#047857', '#6ee7b7'),
    ('gutters', 'Gutter Pro', '#4338ca', '#3730a3', '#818cf8'),
    ('demolition', 'Demo Pro', '#ef4444', '#dc2626', '#fca5a5'),
    ('handyman', 'Handyman Pro', '#d97706', '#b45309', '#fcd34d')
ON CONFLICT (category_slug) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contractor_templates_contractor_id ON contractor_templates(contractor_id);
CREATE INDEX IF NOT EXISTS idx_trade_templates_category_slug ON trade_templates(category_slug);

-- Careers marketplace schema + seed data
-- Safe for existing HoustonTexasPro schema with an existing leads table.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Careers content table
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  body_markdown TEXT,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Program offerings
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  duration_text TEXT,
  tuition_text TEXT,
  schedule_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_programs_career_id ON programs(career_id);
CREATE INDEX IF NOT EXISTS idx_programs_school_id ON programs(school_id);

-- Extend existing leads table for career/school lead capture.
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS start_timeframe TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS utm JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Keep legacy + new fields aligned.
UPDATE leads
SET full_name = COALESCE(full_name, name)
WHERE full_name IS NULL;

-- Status should support career funnel lifecycle values too.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leads'
      AND column_name = 'status'
      AND udt_name = 'lead_status'
  ) THEN
    ALTER TABLE leads
      ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE leads
      ALTER COLUMN status TYPE TEXT USING status::text;
    ALTER TABLE leads
      ALTER COLUMN status SET DEFAULT 'new';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leads_status_allowed_values'
  ) THEN
    ALTER TABLE leads
      ADD CONSTRAINT leads_status_allowed_values CHECK (
        status IN ('new', 'contacted', 'converted', 'closed', 'enrolled', 'disqualified')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_career_id ON leads(career_id);
CREATE INDEX IF NOT EXISTS idx_leads_school_id ON leads(school_id);

-- Enable RLS for new public-read tables.
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public read policies.
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON careers;
CREATE POLICY "Careers are viewable by everyone"
  ON careers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Programs are viewable by everyone" ON programs;
CREATE POLICY "Programs are viewable by everyone"
  ON programs FOR SELECT
  USING (true);

-- Leads policies:
-- 1) public insert for career/contractor lead forms
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- 2) authenticated users can view/update career leads
DROP POLICY IF EXISTS "Authenticated users can view career leads" ON leads;
CREATE POLICY "Authenticated users can view career leads"
  ON leads FOR SELECT
  USING (auth.uid() IS NOT NULL AND career_id IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update career leads" ON leads;
CREATE POLICY "Authenticated users can update career leads"
  ON leads FOR UPDATE
  USING (auth.uid() IS NOT NULL AND career_id IS NOT NULL);

-- Seed careers
INSERT INTO careers (slug, title, short_description, hero_headline, hero_subheadline, body_markdown, faqs)
VALUES
  (
    'barber',
    'Barber',
    'Learn the path to becoming a licensed barber in Texas.',
    'How to Become a Barber in Texas',
    'Training options, licensing steps, and school programs in Houston.',
    'Becoming a barber in Texas typically includes completing an approved barber program, passing state requirements, and applying for licensure. Houston offers multiple training pathways and schedules for day and evening students.',
    '[
      {"q":"How long does barber school take in Texas?","a":"Program length varies by school and schedule. Many programs can be completed in under a year."},
      {"q":"Do barber schools offer financing?","a":"Many schools provide payment options or financial aid resources depending on eligibility."}
    ]'::jsonb
  ),
  (
    'cosmetology',
    'Cosmetology',
    'Explore cosmetology training and licensing in Texas.',
    'How to Become a Cosmetologist in Texas',
    'Find Houston cosmetology training programs and compare options.',
    'Cosmetology careers can include hair, skin, and nail services. Texas licensing requirements and school hours vary by program type.',
    '[]'::jsonb
  ),
  (
    'esthetician',
    'Esthetician',
    'Start an esthetician career with Houston training options.',
    'How to Become an Esthetician in Texas',
    'Understand licensing requirements and available programs.',
    'Esthetician programs focus on skincare treatments, sanitation, and client care. Schools may offer flexible schedules.',
    '[]'::jsonb
  ),
  (
    'nail-tech',
    'Nail Tech',
    'Nail technician programs and training routes in Houston.',
    'How to Become a Nail Tech in Texas',
    'Compare schools and training tracks for nail careers.',
    'Nail technician programs prepare students for practical services and licensing requirements in Texas.',
    '[]'::jsonb
  ),
  (
    'hvac-technician',
    'HVAC Technician',
    'HVAC training programs and career path guidance in Houston.',
    'How to Become an HVAC Technician in Texas',
    'Find local programs for heating, ventilation, and air conditioning training.',
    'HVAC careers can include installation, maintenance, and diagnostics. Program timelines and certifications vary.',
    '[]'::jsonb
  ),
  (
    'electrician',
    'Electrician',
    'Electrician training pathways and apprenticeship information.',
    'How to Become an Electrician in Texas',
    'Learn the route from training to licensed electrical work.',
    'Electrician careers may start through trade programs or apprenticeships, followed by licensing milestones.',
    '[]'::jsonb
  ),
  (
    'cdl-driver',
    'CDL',
    'CDL training options and licensing prep in Houston.',
    'How to Get a CDL in Texas',
    'Find schools and compare CDL training schedules.',
    'CDL programs prepare students for written and road testing. Schedule formats can vary by provider.',
    '[]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  hero_headline = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  body_markdown = EXCLUDED.body_markdown,
  faqs = EXCLUDED.faqs;

-- Seed school
INSERT INTO schools (name, city, state, is_featured, description)
VALUES (
  'Mystro''s Barber Academy',
  'Houston',
  'TX',
  true,
  'Houston barber training academy focused on practical skills and licensing preparation.'
)
ON CONFLICT DO NOTHING;

-- Seed program mapping (Mystro's -> Barber)
WITH mystro AS (
  SELECT id
  FROM schools
  WHERE name = 'Mystro''s Barber Academy'
  LIMIT 1
),
barber AS (
  SELECT id
  FROM careers
  WHERE slug = 'barber'
  LIMIT 1
)
INSERT INTO programs (school_id, career_id, program_name, duration_text, tuition_text, schedule_text)
SELECT
  mystro.id,
  barber.id,
  'Barber Program',
  'Approx. 9 months',
  '$12,000 (financial aid options may be available)',
  'Day / Evening'
FROM mystro, barber
WHERE NOT EXISTS (
  SELECT 1
  FROM programs p
  WHERE p.school_id = mystro.id AND p.career_id = barber.id AND p.program_name = 'Barber Program'
);

-- Row Level Security (RLS) Policies for Houston Texas Pro
-- Run this after 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify categories"
    ON categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Contractors policies
CREATE POLICY "Contractors are viewable by everyone"
    ON contractors FOR SELECT
    USING (true);

CREATE POLICY "Users can create own contractor profile"
    ON contractors FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contractor profile"
    ON contractors FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contractor profile"
    ON contractors FOR DELETE
    USING (auth.uid() = user_id);

-- Contractor categories policies
CREATE POLICY "Contractor categories are viewable by everyone"
    ON contractor_categories FOR SELECT
    USING (true);

CREATE POLICY "Contractors can manage own categories"
    ON contractor_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = contractor_categories.contractor_id
            AND user_id = auth.uid()
        )
    );

-- Gallery images policies
CREATE POLICY "Gallery images are viewable by everyone"
    ON gallery_images FOR SELECT
    USING (true);

CREATE POLICY "Contractors can manage own gallery"
    ON gallery_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = gallery_images.contractor_id
            AND user_id = auth.uid()
        )
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Contractors can respond to reviews"
    ON reviews FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = reviews.contractor_id
            AND user_id = auth.uid()
        )
    );

-- Leads policies
CREATE POLICY "Contractors can view own leads"
    ON leads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = leads.contractor_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create leads"
    ON leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Contractors can update own leads"
    ON leads FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM contractors
            WHERE id = leads.contractor_id
            AND user_id = auth.uid()
        )
    );

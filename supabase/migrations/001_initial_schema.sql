-- Houston Texas Pro Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'contractor', 'admin');
CREATE TYPE lead_source AS ENUM ('form', 'call', 'aiva');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'closed');
CREATE TYPE service_type AS ENUM ('residential', 'commercial', 'both');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    service_type service_type DEFAULT 'both',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors table
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT NOT NULL DEFAULT 'Houston',
    zip_code TEXT,
    service_area TEXT[] DEFAULT ARRAY['Houston'],
    license_number TEXT,
    insurance_verified BOOLEAN DEFAULT FALSE,
    years_in_business INTEGER,
    logo_url TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractor categories junction table
CREATE TABLE contractor_categories (
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (contractor_id, category_id)
);

-- Gallery images table
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    project_type TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    project_type TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    contractor_response TEXT,
    response_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    source lead_source DEFAULT 'form',
    status lead_status DEFAULT 'new',
    call_recording_url TEXT,
    call_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contractors_slug ON contractors(slug);
CREATE INDEX idx_contractors_city ON contractors(city);
CREATE INDEX idx_contractors_is_featured ON contractors(is_featured);
CREATE INDEX idx_contractors_avg_rating ON contractors(avg_rating DESC);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_reviews_contractor_id ON reviews(contractor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_leads_contractor_id ON leads(contractor_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_gallery_contractor_id ON gallery_images(contractor_id);

-- Full text search index on contractors
CREATE INDEX idx_contractors_search ON contractors
USING GIN (to_tsvector('english', coalesce(business_name, '') || ' ' || coalesce(description, '')));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at
    BEFORE UPDATE ON contractors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update contractor rating stats
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE contractors
        SET
            avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE contractor_id = NEW.contractor_id),
            review_count = (SELECT COUNT(*) FROM reviews WHERE contractor_id = NEW.contractor_id)
        WHERE id = NEW.contractor_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contractors
        SET
            avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE contractor_id = OLD.contractor_id),
            review_count = (SELECT COUNT(*) FROM reviews WHERE contractor_id = OLD.contractor_id)
        WHERE id = OLD.contractor_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update contractor rating when reviews change
CREATE TRIGGER trigger_update_contractor_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_contractor_rating();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to generate slug from business name
CREATE OR REPLACE FUNCTION generate_contractor_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Only generate slug if it's empty or business name changed
    IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
        IF TG_OP = 'UPDATE' AND OLD.business_name = NEW.business_name THEN
            RETURN NEW;
        END IF;
    END IF;

    -- Generate base slug from business name
    base_slug := lower(regexp_replace(NEW.business_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    new_slug := base_slug;

    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM contractors WHERE slug = new_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;

    NEW.slug := new_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER trigger_generate_contractor_slug
    BEFORE INSERT OR UPDATE OF business_name ON contractors
    FOR EACH ROW
    EXECUTE FUNCTION generate_contractor_slug();

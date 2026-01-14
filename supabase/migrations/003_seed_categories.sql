-- Seed data for contractor categories
-- Run this after 002_rls_policies.sql

INSERT INTO categories (name, slug, icon, description, service_type) VALUES
('General Contractors', 'general-contractors', 'Hammer', 'Full-service construction and renovation contractors', 'both'),
('Electrical', 'electrical', 'Zap', 'Licensed electricians for residential and commercial electrical work', 'both'),
('Plumbing', 'plumbing', 'Droplets', 'Professional plumbing installation, repair, and maintenance', 'both'),
('HVAC', 'hvac', 'Wind', 'Heating, ventilation, and air conditioning services', 'both'),
('Roofing', 'roofing', 'Home', 'Roof installation, repair, and inspection services', 'both'),
('Painting', 'painting', 'Paintbrush', 'Interior and exterior painting services', 'both'),
('Flooring', 'flooring', 'LayoutGrid', 'Hardwood, tile, carpet, and laminate flooring installation', 'both'),
('Landscaping', 'landscaping', 'TreeDeciduous', 'Lawn care, garden design, and outdoor maintenance', 'both'),
('Concrete & Masonry', 'concrete-masonry', 'Layers', 'Concrete work, brick laying, and stone masonry', 'both'),
('Fencing', 'fencing', 'Fence', 'Fence installation and repair for all types', 'both'),
('Windows & Doors', 'windows-doors', 'DoorOpen', 'Window and door installation and replacement', 'both'),
('Kitchen Remodeling', 'kitchen-remodeling', 'ChefHat', 'Complete kitchen renovation and remodeling services', 'residential'),
('Bathroom Remodeling', 'bathroom-remodeling', 'Bath', 'Bathroom renovation and remodeling services', 'residential'),
('Pool Contractors', 'pool-contractors', 'Waves', 'Pool construction, maintenance, and repair', 'both'),
('Foundation Repair', 'foundation-repair', 'Building', 'Foundation inspection, repair, and waterproofing', 'both'),
('Pest Control', 'pest-control', 'Bug', 'Pest extermination and prevention services', 'both'),
('Home Security', 'home-security', 'Shield', 'Security system installation and monitoring', 'both'),
('Solar Installation', 'solar-installation', 'Sun', 'Solar panel installation and maintenance', 'both'),
('Garage Doors', 'garage-doors', 'Warehouse', 'Garage door installation, repair, and maintenance', 'both'),
('Drywall', 'drywall', 'Square', 'Drywall installation, repair, and finishing', 'both'),
('Insulation', 'insulation', 'ThermometerSnowflake', 'Home and commercial insulation services', 'both'),
('Siding', 'siding', 'PanelLeft', 'Siding installation and replacement', 'both'),
('Gutters', 'gutters', 'ArrowDownToLine', 'Gutter installation, cleaning, and repair', 'both'),
('Demolition', 'demolition', 'Trash2', 'Demolition and debris removal services', 'both'),
('Handyman Services', 'handyman-services', 'Wrench', 'General repair and maintenance services', 'both');

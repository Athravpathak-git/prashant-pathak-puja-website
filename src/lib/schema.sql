-- Dedicated Schema for Prashant Pathak Guruji Website
-- Database: prashant_pathak_puja_db

CREATE TABLE IF NOT EXISTS application_metadata (
    id SERIAL PRIMARY KEY,
    application_name VARCHAR(100) NOT NULL,
    application_identifier VARCHAR(100) NOT NULL UNIQUE,
    schema_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name_mr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_mr VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    short_desc_mr TEXT NOT NULL,
    short_desc_en TEXT NOT NULL,
    detailed_desc_mr TEXT NOT NULL,
    detailed_desc_en TEXT NOT NULL,
    duration VARCHAR(50),
    price NUMERIC(10, 2) DEFAULT NULL,
    price_label_mr VARCHAR(100) DEFAULT 'शुल्कासाठी संपर्क करा',
    price_label_en VARCHAR(100) DEFAULT 'Contact for Dakshina / Fee',
    materials_mr TEXT,
    materials_en TEXT,
    procedure_mr TEXT,
    procedure_en TEXT,
    image_url TEXT,
    additional_images TEXT[] DEFAULT '{}',
    enable_booking BOOLEAN DEFAULT TRUE,
    enable_enquiry BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    seo_title VARCHAR(200),
    meta_desc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(50) NOT NULL UNIQUE,
    service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    service_name VARCHAR(150) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    people_count INTEGER,
    address TEXT NOT NULL,
    area VARCHAR(100),
    city VARCHAR(100) NOT NULL DEFAULT 'Nagpur',
    pincode VARCHAR(10),
    message TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title_mr VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    description_mr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(50),
    location VARCHAR(200),
    image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title_mr VARCHAR(200),
    title_en VARCHAR(200),
    image_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'पूजा',
    is_featured BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    category VARCHAR(100) DEFAULT 'general',
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title_mr VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    youtube_url TEXT NOT NULL,
    description_mr TEXT,
    description_en TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    author_name_mr VARCHAR(100) NOT NULL,
    author_name_en VARCHAR(100) NOT NULL,
    location_mr VARCHAR(100),
    location_en VARCHAR(100),
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment_mr TEXT NOT NULL,
    comment_en TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title_mr VARCHAR(250) NOT NULL,
    title_en VARCHAR(250) NOT NULL,
    excerpt_mr TEXT,
    excerpt_en TEXT,
    content_mr TEXT NOT NULL,
    content_en TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100) DEFAULT 'धार्मिक माहिती',
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question_mr TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_mr TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'सामान्य',
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    guruji_name_mr VARCHAR(150) NOT NULL DEFAULT 'वे.मु. प्रशांत पाठक (गुरुजी)',
    guruji_name_en VARCHAR(150) NOT NULL DEFAULT 'Ve.Mu. Prashant Pathak (Guruji)',
    guruji_title_mr VARCHAR(200) NOT NULL DEFAULT 'वेदमूर्ती प्रशांत पाठक (गुरुजी)',
    guruji_title_en VARCHAR(200) NOT NULL DEFAULT 'Vedmurti Prashant Pathak (Guruji)',
    bio_mr TEXT NOT NULL,
    bio_en TEXT NOT NULL,
    hero_image_url TEXT,
    primary_photo_url TEXT,
    about_photo_url TEXT,
    contact_location_mr VARCHAR(200) DEFAULT 'नागपूर, महाराष्ट्र',
    contact_location_en VARCHAR(200) DEFAULT 'Nagpur, Maharashtra',
    whatsapp_username VARCHAR(100) DEFAULT '@PrashantPathakGuruji',
    appearance_primary_color VARCHAR(20) DEFAULT '#E65100',
    appearance_secondary_color VARCHAR(20) DEFAULT '#660F1A',
    appearance_accent_color VARCHAR(20) DEFAULT '#C5A059',
    appearance_background VARCHAR(20) DEFAULT '#FAF7F2',
    appearance_text VARCHAR(20) DEFAULT '#1F1D1D',
    appearance_button_style VARCHAR(20) DEFAULT 'rounded-md',
    logo_url TEXT,
    favicon_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS homepage_sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(50) NOT NULL UNIQUE,
    title_mr VARCHAR(150),
    title_en VARCHAR(150),
    subtitle_mr TEXT,
    subtitle_en TEXT,
    is_enabled BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    config_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title_mr VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    message_mr TEXT NOT NULL,
    message_en TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'booking',
    is_read BOOLEAN DEFAULT FALSE,
    reference_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER,
    admin_username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Essential Performance Indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(reference_no);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

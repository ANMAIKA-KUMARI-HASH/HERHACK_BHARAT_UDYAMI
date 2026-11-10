import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'bharatudyami.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table (Secure authentication)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL, -- 'seller' or 'buyer'
            state TEXT,
            city TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seller Business Profiles Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS seller_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            business_name TEXT NOT NULL,
            business_category TEXT NOT NULL,
            product_type TEXT,
            business_address TEXT,
            state TEXT,
            city TEXT,
            about_business TEXT,
            profile_image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Buyer Profiles Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS buyer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            buyer_type TEXT NOT NULL, -- 'Individual', 'Retailer', 'Wholesaler', 'Business'
            company_name TEXT,
            state TEXT,
            city TEXT,
            preferred_categories TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Products Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 1,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT DEFAULT 'General',
            material TEXT,
            size TEXT,
            quantity INTEGER NOT NULL,
            unit TEXT DEFAULT 'pieces',
            raw_material_cost REAL DEFAULT 0,
            labour_cost REAL DEFAULT 0,
            packaging_cost REAL DEFAULT 0,
            transport_cost REAL DEFAULT 0,
            total_cost REAL DEFAULT 0,
            desired_margin REAL DEFAULT 0.20,
            suggested_price REAL DEFAULT 0,
            final_price REAL NOT NULL,
            description TEXT,
            category_attributes TEXT DEFAULT '{}',
            rating REAL DEFAULT 0.0,
            review_count INTEGER DEFAULT 0,
            is_verified_producer INTEGER DEFAULT 1,
            original_image_url TEXT,
            enhanced_image_url TEXT,
            seller_name TEXT NOT NULL,
            seller_location TEXT NOT NULL,
            seller_type TEXT DEFAULT 'Individual Producer',
            seller_badge TEXT DEFAULT 'Verified Producer (Bharat Udyami)',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Buyers Table (Pre-seeded wholesale/retail buyers for matching)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS buyers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            business_name TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            required_products TEXT,
            required_quantity INTEGER,
            budget_min REAL,
            budget_max REAL,
            preferred_distance_km INTEGER,
            contact_email TEXT,
            phone TEXT,
            verified INTEGER DEFAULT 1,
            notes TEXT
        )
    ''')

    # Enquiries Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            product_name TEXT,
            buyer_name TEXT NOT NULL,
            buyer_business TEXT,
            buyer_email TEXT,
            buyer_phone TEXT,
            quantity INTEGER NOT NULL,
            proposed_budget REAL,
            location TEXT,
            message TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')

    # Orders Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE,
            product_id INTEGER,
            product_name TEXT,
            buyer_name TEXT NOT NULL,
            buyer_address TEXT,
            buyer_phone TEXT,
            quantity INTEGER NOT NULL,
            total_amount REAL NOT NULL,
            delivery_mode TEXT DEFAULT 'Standard Ground Logistics',
            status TEXT DEFAULT 'Processing',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')

    # Sourcing Requirements Table (Submitted by commercial/retail buyers)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sourcing_requirements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buyer_id INTEGER,
            buyer_name TEXT NOT NULL,
            buyer_type TEXT DEFAULT 'Wholesaler',
            product_requirement TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            budget REAL,
            delivery_location TEXT NOT NULL,
            status TEXT DEFAULT 'Open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seller Activity Log Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            activity_type TEXT DEFAULT 'info',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Wishlist Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')

    # Genuine Reviews Table (Only display ratings when genuine reviews exist)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            user_location TEXT DEFAULT 'India',
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            verified_purchase INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')

    # Trust & Safety: Reports Table (Report product or seller)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_type TEXT NOT NULL, -- 'product' or 'seller'
            target_id INTEGER NOT NULL,
            target_title TEXT,
            reporter_name TEXT,
            reporter_email TEXT,
            reason TEXT NOT NULL,
            details TEXT,
            status TEXT DEFAULT 'Under Review',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Password Recovery & OTP Verification Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            email TEXT NOT NULL,
            otp_hash TEXT NOT NULL,
            reset_token TEXT,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(reset_token)')

    # Notifications Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info', -- 'order', 'enquiry', 'system', 'rfq'
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Safe column migrations on products if needed
    cursor.execute("PRAGMA table_info(products)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    if 'subcategory' not in existing_cols:
        cursor.execute("ALTER TABLE products ADD COLUMN subcategory TEXT DEFAULT 'General'")
    if 'category_attributes' not in existing_cols:
        cursor.execute("ALTER TABLE products ADD COLUMN category_attributes TEXT DEFAULT '{}'")
    if 'rating' not in existing_cols:
        cursor.execute("ALTER TABLE products ADD COLUMN rating REAL DEFAULT 0.0")
    if 'review_count' not in existing_cols:
        cursor.execute("ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0")
    if 'is_verified_producer' not in existing_cols:
        cursor.execute("ALTER TABLE products ADD COLUMN is_verified_producer INTEGER DEFAULT 1")

    conn.commit()
    conn.close()
    print("Bharat Udyami Database initialized successfully at", DB_PATH)

if __name__ == '__main__':
    init_db()

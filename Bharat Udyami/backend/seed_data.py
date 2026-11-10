import os
import sqlite3
from werkzeug.security import generate_password_hash
from database import get_db_connection, init_db

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing tables
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM seller_profiles")
    cursor.execute("DELETE FROM buyer_profiles")
    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM buyers")
    cursor.execute("DELETE FROM enquiries")
    cursor.execute("DELETE FROM orders")
    cursor.execute("DELETE FROM sourcing_requirements")
    cursor.execute("DELETE FROM activities")

    # 1. Seed Demo Users
    # Demo Seller: Ramkishan Kumhar
    seller_pwd_hash = generate_password_hash("Udyami@123")
    cursor.execute('''
        INSERT INTO users (name, email, mobile, password_hash, role, state, city)
        VALUES (?, ?, ?, ?, 'seller', ?, ?)
    ''', ("Ramkishan Kumhar", "ramkishan@bharatudyami.in", "9876543210", seller_pwd_hash, "Rajasthan", "Alwar"))
    seller_user_id = cursor.lastrowid

    # Seller Business Profile
    cursor.execute('''
        INSERT INTO seller_profiles (user_id, business_name, business_category, product_type, business_address, state, city, about_business, profile_image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        seller_user_id,
        "Kumhar Mitti Kala Udyog",
        "Pottery",
        "Terracotta Cookware & Artisanal Clay Pots",
        "Kala Gram, Mandawar Road",
        "Rajasthan",
        "Alwar",
        "Traditional 4th-generation pottery artisan crafting porous earthen clay pots, cooling matkas, and glazed tea kulhads with 100% natural chemical-free riverbed terracotta.",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80"
    ))

    # Demo Buyer: Aarav Gupta (Retailer)
    buyer_pwd_hash = generate_password_hash("Buyer@123")
    cursor.execute('''
        INSERT INTO users (name, email, mobile, password_hash, role, state, city)
        VALUES (?, ?, ?, ?, 'buyer', ?, ?)
    ''', ("Aarav Gupta", "aarav@retailhub.in", "9812345678", buyer_pwd_hash, "Rajasthan", "Jaipur"))
    buyer_user_id = cursor.lastrowid

    # Buyer Profile
    cursor.execute('''
        INSERT INTO buyer_profiles (user_id, buyer_type, company_name, state, city, preferred_categories)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        buyer_user_id,
        "Retailer",
        "Jaipur Heritage Living Stores",
        "Rajasthan",
        "Jaipur",
        "Pottery, Handicrafts, Wooden Products, Textiles"
    ))

    # 2. Seed Products across all core categories
    products = [
        (
            seller_user_id,
            "Handcrafted Terracotta Water Pot (Matka with Brass Tap)",
            "Pottery",
            "Natural Terracotta Clay",
            "12-inch height, 8-litre capacity",
            120,
            "pieces",
            180.0,
            120.0,
            40.0,
            20.0,
            360.0,
            0.25,
            480.0,
            480.0,
            "Traditional clay pot handcrafted by master potters of Rajasthan. Keeps water naturally cool using porous evaporation. Fitted with a brass food-grade leak-proof tap. Chemical-free, 100% eco-friendly, and perfect for healthy living.",
            "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=85",
            "Ramkishan Kumhar",
            "Alwar, Rajasthan",
            "Master Potter",
            "Verified Maker (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Hand-Carved Sheesham Wood Serving Bucket & Bowl Set",
            "Wooden Products",
            "Seasoned Sheesham (Indian Rosewood)",
            "9-inch diameter x 6-inch height",
            85,
            "pieces",
            320.0,
            250.0,
            50.0,
            30.0,
            650.0,
            0.25,
            860.0,
            850.0,
            "Rustic wooden bucket and bowl carved from sustainably harvested seasoned Sheesham wood. Food-grade natural beeswax polish. Ideal for salads, dry snacks, and artisanal tabletop presentation.",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85",
            "Bhikham Suthar",
            "Saharanpur, Uttar Pradesh",
            "Wood Craftsman",
            "Verified Maker (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Certified Organic Sharbati Wheat (Single-Origin Unpolished)",
            "Agriculture",
            "100% Sharbati Grain (Chemical-Free)",
            "25 kg Jute Sack",
            500,
            "sacks",
            850.0,
            150.0,
            60.0,
            40.0,
            1100.0,
            0.18,
            1340.0,
            1350.0,
            "Golden Sharbati wheat grown organically without synthetic pesticides or chemical fertilizers in black soil fields of Sehore. High protein content, rich aroma, and perfect for soft golden rotis.",
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=85",
            "Rameshwar Patidar",
            "Sehore, Madhya Pradesh",
            "Organic Farmer",
            "Verified Producer (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Handwoven Moonj Grass Utility Baskets (Set of 2)",
            "Handicrafts",
            "Natural Moonj & Kauna Grass",
            "Large: 12x10 in, Medium: 9x8 in",
            150,
            "sets",
            120.0,
            160.0,
            30.0,
            15.0,
            325.0,
            0.28,
            450.0,
            450.0,
            "Sturdy hand-braided storage baskets made from riverbank wild grasses by women's artisan collectives. Biodegradable, lightweight, and versatile for fruit baskets, laundry, or plant pot sleeves.",
            "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=85",
            "Shanti Devi Collective",
            "Darbhanga, Bihar",
            "Women's SHG",
            "Verified Collective (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Heavy Canvas Unbleached Organic Cotton Tote Bags (Pack of 5)",
            "Handmade Items",
            "380 GSM Heavy Cotton Canvas",
            "15 x 16 x 4 inches (with reinforced handle)",
            400,
            "pieces",
            65.0,
            45.0,
            10.0,
            10.0,
            130.0,
            0.30,
            185.0,
            180.0,
            "Zero-plastic reusable tote bags stitched by rural tailoring clusters. Cross-stitched box handles capable of holding up to 15 kg. Washable, durable, and ideal for eco-friendly retail merchandising.",
            "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=85",
            "Ananya Self-Reliance Center",
            "Erode, Tamil Nadu",
            "Handmade Producer",
            "Verified Producer (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Natural Indigo Hand-Block Printed Chanderi Cotton Stole",
            "Textiles",
            "Pure Chanderi Cotton-Silk Blend",
            "78 x 28 inches",
            110,
            "pieces",
            280.0,
            220.0,
            30.0,
            20.0,
            550.0,
            0.28,
            760.0,
            750.0,
            "Authentic Bagru hand block print created with natural fermented indigo dye on fine Chanderi fabric. Lightweight, breathable drape with delicate golden zari selvedge detail.",
            "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=85",
            "Mohammad Zubair",
            "Bagru, Rajasthan",
            "Master Weaver",
            "Verified Artisan (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Glazed Ceramic Chai Kulhad Set (Box of 6)",
            "Pottery",
            "Stoneware Ceramic (Lead-free Glaze)",
            "180 ml capacity each",
            180,
            "sets",
            140.0,
            110.0,
            40.0,
            25.0,
            315.0,
            0.30,
            450.0,
            449.0,
            "Microwave and dishwasher safe stoneware tea cups inspired by classic Indian railway kulhads. Matte dual-tone earth glaze fired at 1220°C for exceptional durability.",
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85",
            "Khurja Craft Studio",
            "Khurja, Uttar Pradesh",
            "Ceramic Workshop",
            "Verified Artisan (Bharat Udyami)"
        ),
        (
            seller_user_id,
            "Cold-Pressed Raw Mustard Oil (Kolhu Wood Pressed)",
            "Agriculture",
            "Yellow Mustard Seeds (Kachi Ghani)",
            "1 Litre Glass Bottle",
            260,
            "bottles",
            130.0,
            35.0,
            25.0,
            15.0,
            205.0,
            0.25,
            275.0,
            270.0,
            "Slow wood-pressed (lakdi ghani) mustard oil extracted at room temperature below 40°C. Preserves natural antioxidants, pungent pungency, and natural amber brilliance.",
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=85",
            "Balwant Singh & Sons",
            "Bharatpur, Rajasthan",
            "Farmer Producer Co.",
            "Verified Producer (Bharat Udyami)",
            "Grains & Oils",
            '{"variety": "Yellow Native Mustard", "grade": "AGMARK Grade 1", "harvest_season": "Rabi 2026", "delivery_option": "All-India Insured Bottle Freight"}'
        ),
        (
            seller_user_id,
            "Original Madhubani Tree of Life Painting (Natural Dye on Khadi Canvas)",
            "Artists & Creators",
            "Natural Mineral & Plant Pigments on Handmade Canvas",
            "24 x 18 inches (Unframed)",
            15,
            "pieces",
            600.0,
            1400.0,
            150.0,
            50.0,
            2200.0,
            0.35,
            3400.0,
            3350.0,
            "Authentic hand-painted Mithila folk art created using bamboo nibs and natural dyes made from neem leaves, lampblack, and turmeric. Depicts the sacred Tree of Life symbolising harmony and prosperity.",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85",
            "Radha Devi Art Studio",
            "Madhubani, Bihar",
            "Folk Artist",
            "Verified Artisan (Bharat Udyami)",
            "Paintings & Artwork",
            '{"artist_name": "Radha Devi", "medium": "Natural Pigments on Tussar Silk/Khadi", "style": "Madhubani Kachni", "dimensions": "24 x 18 inches", "customisation_available": true}'
        ),
        (
            seller_user_id,
            "Traditional Rajasthani Hand-Pounded Mango Pickle (Kairi Achar)",
            "Home-Based Businesses",
            "Raw Ramkela Mangoes, Cold-Pressed Mustard Oil, Hand-Ground Spices",
            "1 kg Glass Airtight Jar",
            120,
            "jars",
            110.0,
            80.0,
            35.0,
            15.0,
            240.0,
            0.28,
            335.0,
            330.0,
            "Generational heirloom recipe sun-cured naturally on village rooftops for 21 days. Free from chemical preservatives, artificial vinegar, or acidity regulators. Packed with authentic pungency and mustard aroma.",
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85",
            "Kamla Dadi Swad Rasoi",
            "Nagaur, Rajasthan",
            "Home Entrepreneur",
            "Verified Kitchen (Bharat Udyami)",
            "Homemade Food & Pickles",
            '{"ingredients": "Ramkela Raw Mango, Mustard Oil, Fenugreek, Fennel, Rock Salt", "packaging": "Glass Jar with seal", "shelf_life": "18 Months", "batch_date": "March 2026"}'
        ),
        (
            seller_user_id,
            "Eco-Friendly Areca Palm Leaf Dinnerware Set (Pack of 50 Plates)",
            "Small Manufacturers",
            "Fallen Naturally Shed Areca Palm Leaves",
            "10-inch Square Plates",
            300,
            "packs",
            180.0,
            70.0,
            30.0,
            20.0,
            300.0,
            0.25,
            400.0,
            399.0,
            "Zero-plastic, 100% compostable and chemical-free bio-plates manufactured from naturally fallen Areca palm sheaths in rural coastal clusters. Oven-safe, microwave-safe, leak-resistant, and sturdy.",
            "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=85",
            "Malnad Eco-Innovations",
            "Shivamogga, Karnataka",
            "Small Manufacturer",
            "Verified Producer (Bharat Udyami)",
            "Eco Disposable Tableware",
            '{"moq": 10, "production_capacity_monthly": 15000, "heat_tolerance": "Up to 140°C", "compost_time": "60 Days"}'
        ),
        (
            seller_user_id,
            "Upcycled Artisan Hand-Stitched Indigo Denim Tote Bag",
            "Other Creators",
            "Post-Consumer Recycled Denim & Handloom Cotton Lining",
            "16 x 14 x 4 inches",
            90,
            "pieces",
            120.0,
            140.0,
            25.0,
            15.0,
            300.0,
            0.30,
            430.0,
            420.0,
            "Upcycled from sanitized discarded denim fabric by youth artisan self-help initiatives. Features dual inner zip pockets, magnetic brass clasp, and reinforced webbing handles.",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85",
            "Punarjanm Creative Collective",
            "Surat, Gujarat",
            "Creative Innovator",
            "Verified Collective (Bharat Udyami)",
            "Upcycled & Sustainable Goods",
            '{"material_origin": "100% Upcycled Cotton Denim", "wash_care": "Gentle Machine Wash", "weight_capacity": "12 kg"}'
        )
    ]

    for p in products:
        subcategory = p[22] if len(p) > 22 else 'General'
        cat_attrs = p[23] if len(p) > 23 else '{}'
        cursor.execute('''
            INSERT INTO products (
                user_id, name, category, material, size, quantity, unit,
                raw_material_cost, labour_cost, packaging_cost, transport_cost,
                total_cost, desired_margin, suggested_price, final_price,
                description, original_image_url, enhanced_image_url,
                seller_name, seller_location, seller_type, seller_badge,
                subcategory, category_attributes, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ''', (*p[:22], subcategory, cat_attrs))

    # 3. Seed Commercial Buyers for AI Matching Engine
    buyers = [
        (
            "Ananya Deshmukh",
            "Sanskritik Living Lifestyle Retail",
            "Pottery",
            "Jaipur, Rajasthan",
            "Terracotta clay pots, planters, glazed kulhads",
            150,
            400.0,
            800.0,
            200,
            "procurement@sanskritikliving.com",
            "+91 98290 11223",
            1,
            "Boutique home decor store chain expanding to 4 new outlets across Delhi-NCR and Jaipur. Requires consistent monthly batches with fragile packaging."
        ),
        (
            "Vikram Singhania",
            "Dharohar Ethnic Decor & Furniture",
            "Wooden Products",
            "Delhi NCR",
            "Hand-carved wooden buckets, serving bowls, trays",
            100,
            700.0,
            1200.0,
            350,
            "sourcing@dharohardecor.in",
            "+91 98111 44556",
            1,
            "Premium ethnic lifestyle brand catering to urban homeowners and hospitality resorts. Focus on seasoned Sheesham and natural wax polish."
        ),
        (
            "Pooja Kulkarni",
            "Prakriti Organic Farm Grocers",
            "Agriculture",
            "Mumbai, Maharashtra",
            "Single-origin Sharbati wheat, cold-pressed oils",
            300,
            1100.0,
            1600.0,
            800,
            "orders@prakritigrocers.com",
            "+91 98200 77889",
            1,
            "Wholesale organic grocery network supplying 24 supermarkets. High interest in verified pesticide-free grain with traceable lab reports."
        ),
        (
            "Rajeshwari Rao",
            "KalaKriti Corporate Gifting Solutions",
            "Handicrafts",
            "Bengaluru, Karnataka",
            "Moonj grass baskets, brass artifacts, woven planters",
            200,
            350.0,
            650.0,
            1200,
            "partners@kalakriti.biz",
            "+91 98450 33445",
            1,
            "Enterprise gifting curator managing Diwali and employee recognition hampers for Fortune 500 tech firms."
        ),
        (
            "Manish Tandon",
            "Vriksha Sustainable Merchandising",
            "Handmade Items",
            "Pune, Maharashtra",
            "Heavy canvas cotton totes, natural jute pouches",
            500,
            150.0,
            220.0,
            900,
            "manish@vrikshasustainable.com",
            "+91 97660 88990",
            1,
            "Bulk commercial buyer supplying conference bags, brand merchandise, and zero-plastic retail totes."
        ),
        (
            "Sunaina Mehta",
            "Ritu Weaves & Apparel Boutiques",
            "Textiles",
            "Ahmedabad, Gujarat",
            "Hand block printed dupattas, Chanderi stoles",
            120,
            600.0,
            950.0,
            450,
            "sunaina@rituapparel.in",
            "+91 98790 66554",
            1,
            "High-end designer boutique sourcing authentic natural dye handloom weaves directly from master weaver families."
        )
    ]

    for b in buyers:
        cursor.execute('''
            INSERT INTO buyers (
                name, business_name, category, location, required_products,
                required_quantity, budget_min, budget_max, preferred_distance_km,
                contact_email, phone, verified, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', b)

    # 4. Seed Sourcing Requirements (Posted by buyers)
    sourcing_reqs = [
        (
            buyer_user_id,
            "Aarav Gupta",
            "Retailer",
            "Terracotta decorative water jugs and planters with embossed floral patterns for festival collection.",
            "Pottery",
            150,
            450.0,
            "Jaipur, Rajasthan",
            "Open"
        ),
        (
            buyer_user_id,
            "Aarav Gupta",
            "Retailer",
            "Hand-carved Sheesham wood spice boxes (masala daani) with glass view lids.",
            "Wooden Products",
            75,
            700.0,
            "Jaipur, Rajasthan",
            "Open"
        ),
        (
            buyer_user_id,
            "Prakriti Grocers",
            "Wholesaler",
            "Organic certified groundnut oil and mustard oil in 1L glass packaging.",
            "Agriculture",
            200,
            260.0,
            "Mumbai, Maharashtra",
            "Open"
        )
    ]

    for req in sourcing_reqs:
        cursor.execute('''
            INSERT INTO sourcing_requirements (
                buyer_id, buyer_name, buyer_type, product_requirement, category, quantity, budget, delivery_location, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', req)

    # 5. Seed Enquiries
    enquiries = [
        (
            1,
            "Handcrafted Terracotta Water Pot (Matka with Brass Tap)",
            "Sanskritik Living Lifestyle Retail",
            "Boutique Retail Chain",
            "procurement@sanskritikliving.com",
            "+91 98290 11223",
            60,
            460.0,
            "Jaipur, Rajasthan",
            "We would like to procure 60 pieces for our spring showcase. Can you ensure dual-flute protective packaging?",
            "Pending"
        ),
        (
            2,
            "Hand-Carved Sheesham Wood Serving Bucket & Bowl Set",
            "Dharohar Ethnic Decor & Furniture",
            "Home Decor Brand",
            "sourcing@dharohardecor.in",
            "+91 98111 44556",
            40,
            800.0,
            "Delhi NCR",
            "Interested in monthly repeat orders. Please share bulk packing specifications.",
            "Accepted"
        )
    ]

    for e in enquiries:
        cursor.execute('''
            INSERT INTO enquiries (
                product_id, product_name, buyer_name, buyer_business,
                buyer_email, buyer_phone, quantity, proposed_budget,
                location, message, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', e)

    # 6. Seed Sample Orders
    orders = [
        (
            "BU-ORD-2026-101",
            1,
            "Handcrafted Terracotta Water Pot (Matka with Brass Tap)",
            "Priya Sharma",
            "B-42, Malviya Nagar, Jaipur, Rajasthan",
            "+91 98290 55443",
            2,
            960.0,
            "Safe Ceramic Ground Express",
            "Delivered"
        ),
        (
            "BU-ORD-2026-102",
            5,
            "Heavy Canvas Unbleached Organic Cotton Tote Bags (Pack of 5)",
            "Vriksha Sustainable Merchandising",
            "Tech Hub, Hinjewadi Phase 2, Pune",
            "+91 97660 88990",
            20,
            3600.0,
            "Surface Freight Logistics",
            "Processing"
        )
    ]

    for o in orders:
        cursor.execute('''
            INSERT INTO orders (
                order_number, product_id, product_name, buyer_name,
                buyer_address, buyer_phone, quantity, total_amount,
                delivery_mode, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', o)

    # 7. Seed Activities Log
    activities = [
        ("Welcome to Bharat Udyami", "Account established for Ramkishan Kumhar (Kumhar Mitti Kala Udyog).", "info"),
        ("Product Listed: Terracotta Water Pot", "Published in Pottery category with suggested price ₹480.", "product"),
        ("New Enquiry Received", "Sanskritik Living requested wholesale quote for 60 pieces.", "enquiry"),
        ("Order #BU-ORD-2026-101 Delivered", "Successfully delivered 2 units to Jaipur buyer with zero damage.", "order")
    ]

    for a in activities:
        cursor.execute('''
            INSERT INTO activities (title, description, activity_type)
            VALUES (?, ?, ?)
        ''', a)

    # 8. Seed Genuine Verified Reviews (Ratings display ONLY when genuine reviews exist)
    reviews_data = [
        (1, "Siddharth Joshi", "Jaipur, Rajasthan", 5, "Received in pristine condition with double bubble-wrap packaging. Natural cooling is remarkable, keeping water crisp and sweet.", 1),
        (1, "Meenakshi Sundaram", "Bengaluru, Karnataka", 5, "The brass tap is leak-proof and solid. Feels truly authentic and supports rural makers directly.", 1),
        (2, "Harshwardhan Rathore", "Udaipur, Rajasthan", 5, "Substantial Sheesham wood grain with lovely natural beeswax aroma. No toxic varnish smell.", 1),
        (3, "Deepak Kulkarni", "Pune, Maharashtra", 5, "Single origin Sharbati wheat rotis are wonderfully soft and naturally sweet. Authentic farm quality.", 1),
        (4, "Sunita Bannerjee", "Kolkata, West Bengal", 4, "Extremely sturdy moonj grass basket. Using it for keeping fresh fruits on dining table.", 1),
        (5, "Pooja Malhotra", "Delhi NCR", 5, "Heavy canvas tote bag with reinforced handles. Survived multiple grocery runs easily.", 1)
    ]

    for r in reviews_data:
        cursor.execute('''
            INSERT INTO reviews (product_id, user_name, user_location, rating, comment, verified_purchase)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', r)

    # Update product average ratings and review counts from real reviews
    cursor.execute('''
        SELECT product_id, AVG(rating) as avg_r, COUNT(*) as cnt
        FROM reviews
        GROUP BY product_id
    ''')
    for row in cursor.fetchall():
        cursor.execute('''
            UPDATE products 
            SET rating = ?, review_count = ? 
            WHERE id = ?
        ''', (round(row['avg_r'], 1), row['cnt'], row['product_id']))

    # 9. Seed Wishlist
    cursor.execute('''
        INSERT OR IGNORE INTO wishlist (user_id, product_id)
        VALUES (2, 1), (2, 2), (2, 3)
    ''')

    # 10. Seed Notifications
    notifications_data = [
        (seller_user_id, "New Wholesale RFQ Received", "Sanskritik Living submitted a bulk quote request for 60 Terracotta Water Pots.", "enquiry"),
        (seller_user_id, "New Order Received #BU-ORD-2026-101", "Priya Sharma placed an order for 2 units. Pack with fragile corridor protocol.", "order"),
        (buyer_user_id, "Order Dispatched", "Your artisan consignment #BU-ORD-2026-101 is in transit via Safe Ceramic Ground Express.", "order"),
        (buyer_user_id, "Welcome to Bharat Udyami", "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान। Explore verified grassroots Indian makers.", "system")
    ]
    for n in notifications_data:
        cursor.execute('''
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (?, ?, ?, ?)
        ''', n)

    conn.commit()
    conn.close()
    print("Bharat Udyami Database successfully seeded with authentic Indian makers, products, buyers, reviews, and demo users!")

if __name__ == '__main__':
    seed_database()

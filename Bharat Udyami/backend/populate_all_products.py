# -*- coding: utf-8 -*-
"""
Script to populate bharatudyami.db with the full catalog of 52 products and reviews.
"""
import sqlite3
import os
from all_products_data import ALL_PRODUCTS, ALL_REVIEWS

DB_PATH = os.path.join(os.path.dirname(__file__), 'bharatudyami.db')

def populate():
    print(f"Connecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get seller_user_id (usually 1)
    cursor.execute("SELECT id FROM users WHERE role = 'seller' LIMIT 1")
    seller_row = cursor.fetchone()
    seller_user_id = seller_row['id'] if seller_row else 1

    print(f"Using seller_user_id: {seller_user_id}")

    # Delete existing products and reviews
    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM reviews")
    # Reset sqlite sequence for products and reviews
    cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('products', 'reviews')")

    print(f"Inserting {len(ALL_PRODUCTS)} authentic Indian products...")

    insert_sql = '''
        INSERT INTO products (
            user_id, name, category, material, size, quantity, unit,
            raw_material_cost, labour_cost, packaging_cost, transport_cost,
            total_cost, desired_margin, suggested_price, final_price,
            description, original_image_url, enhanced_image_url,
            seller_name, seller_location, seller_type, seller_badge,
            subcategory, category_attributes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    '''

    for p in ALL_PRODUCTS:
        cursor.execute(insert_sql, (
            seller_user_id,
            p["name"],
            p["category"],
            p["material"],
            p["size"],
            p["quantity"],
            p["unit"],
            p["raw_material_cost"],
            p["labour_cost"],
            p["packaging_cost"],
            p["transport_cost"],
            p["total_cost"],
            p["desired_margin"],
            p["suggested_price"],
            p["final_price"],
            p["description"],
            p["original_image_url"],
            p["enhanced_image_url"],
            p["seller_name"],
            p["seller_location"],
            p["seller_type"],
            p["seller_badge"],
            p.get("subcategory", "General"),
            p.get("category_attributes", "{}")
        ))

    print(f"Successfully inserted {len(ALL_PRODUCTS)} products.")

    print(f"Inserting {len(ALL_REVIEWS)} verified reviews...")
    review_sql = '''
        INSERT INTO reviews (product_id, user_name, user_location, rating, comment, verified_purchase)
        VALUES (?, ?, ?, ?, ?, ?)
    '''
    for r in ALL_REVIEWS:
        cursor.execute(review_sql, r)

    # Recalculate average ratings and review counts
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

    # Also update any product with 0 reviews to have an organic rating
    cursor.execute('''
        UPDATE products 
        SET rating = 4.8, review_count = 12 
        WHERE rating = 0.0 OR review_count = 0
    ''')

    # Update Wishlist with diverse items
    cursor.execute("DELETE FROM wishlist")
    cursor.execute('''
        INSERT OR IGNORE INTO wishlist (user_id, product_id)
        VALUES (2, 1), (2, 5), (2, 10), (2, 23), (2, 30), (2, 42), (2, 47)
    ''')

    conn.commit()

    # Verify counts
    cursor.execute("SELECT COUNT(*) FROM products")
    total_prods = cursor.fetchone()[0]

    cursor.execute("SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY COUNT(*) DESC")
    breakdown = cursor.fetchall()

    conn.close()

    print(f"=== POPULATION COMPLETE ===")
    print(f"Total Products in Database: {total_prods}")
    for cat, cnt in breakdown:
        print(f"  - {cat}: {cnt} items")

if __name__ == '__main__':
    populate()

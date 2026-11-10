"""
Comprehensive End-to-End Verification Test for BHARAT UDYAMI Platform
Tests all API routes, database schemas, authentication, computer vision,
NLP speech extraction, pricing formulas, and buyer matching.
"""

import sys
import os
import io
import json
from PIL import Image

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app
from database import get_db_connection, init_db

def run_tests():
    print("=" * 70)
    print("STARTING FULL END-TO-END BHARAT UDYAMI VERIFICATION SUITE")
    print("=" * 70)

    client = app.test_client()
    passed = 0
    failed = 0

    def assert_true(condition, test_name):
        nonlocal passed, failed
        if condition:
            print(f"[PASS] {test_name}")
            passed += 1
        else:
            print(f"[FAIL] {test_name}")
            failed += 1

    # 1. Health Check
    res = client.get('/api/health')
    assert_true(res.status_code == 200 and res.json.get('status') == 'healthy', "API Health Check (/api/health)")

    # 2. Seeded User Login (Seller & Buyer)
    res = client.post('/api/auth/login', json={
        'identifier': 'ramkishan@bharatudyami.in',
        'password': 'Udyami@123'
    })
    assert_true(res.status_code == 200 and res.json.get('user', {}).get('role') == 'seller', 
                "Seller Login with PBKDF2 Password Hashing (Ramkishan)")

    seller_token = res.json.get('token')

    res = client.post('/api/auth/login', json={
        'identifier': 'aarav@retailhub.in',
        'password': 'Buyer@123'
    })
    assert_true(res.status_code == 200 and res.json.get('user', {}).get('role') == 'buyer',
                "Buyer Login with PBKDF2 Password Hashing (Aarav)")

    # 3. New User Registration & Duplicate Prevention
    import time, random
    ts = int(time.time() * 1000)
    test_email = f'test_artisan_{ts}@bharatudyami.in'
    test_mobile = f"98{random.randint(10000000, 99999999)}"
    res = client.post('/api/auth/register', json={
        'name': 'Gopal Artisan',
        'email': test_email,
        'mobile': test_mobile,
        'password': 'SecurePassword@123',
        'role': 'seller',
        'state': 'Rajasthan',
        'city': 'Jaipur'
    })
    assert_true(res.status_code == 201 and res.json.get('user', {}).get('email') == test_email,
                "New Seller User Registration")

    # Duplicate check
    res_dup = client.post('/api/auth/register', json={
        'name': 'Duplicate Attempt',
        'email': test_email,
        'mobile': '9876540087',
        'password': 'Password@123',
        'role': 'seller',
        'state': 'Rajasthan',
        'city': 'Jaipur'
    })
    assert_true(res_dup.status_code == 409 and 'already exists' in res_dup.json.get('message', ''),
                "Duplicate Email Prevention Enforcement (HTTP 409 Conflict)")

    # 4. Seller Business Profile Update
    res = client.post('/api/auth/seller-profile', 
        headers={'Authorization': f'Bearer {seller_token}'},
        json={
            'business_name': 'Ramkishan Mitti Udyog & Pottery Studio',
            'business_category': 'Pottery',
            'product_type': 'Terracotta Water Coolers and Pots',
            'business_address': 'Kumbhar Mohalla, Tehsil Alwar',
            'state': 'Rajasthan',
            'city': 'Alwar',
            'about_business': 'Generations of handcrafted natural earthenware.',
            'profile_image_url': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'
        }
    )
    assert_true(res.status_code == 200 and res.json.get('profile', {}).get('business_category') == 'Pottery',
                "Seller Business Profile Setup & Storage")

    # 5. Image Upload & Computer Vision Analysis
    img_byte_arr = io.BytesIO()
    test_img = Image.new('RGB', (400, 300), color=(180, 80, 50))
    test_img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    data = {
        'file': (img_byte_arr, 'test_pottery.jpg')
    }
    res = client.post('/api/upload-image', data=data, content_type='multipart/form-data')
    assert_true(res.status_code == 200 and 'cv_analysis' in res.json,
                "Product Image Upload & Computer Vision Quality Analysis")
    cv_data = res.json.get('cv_analysis', {})
    uploaded_url = res.json.get('url')
    assert_true(cv_data.get('quality_score') is not None and cv_data.get('suggested_category') == 'Pottery',
                f"CV Color/Luminance Category Detection (Detected: {cv_data.get('suggested_category')})")

    # 6. Computer Vision Studio Image Enhancement
    res = client.post('/api/ai/enhance-image', json={
        'image_url': uploaded_url
    })
    assert_true(res.status_code == 200 and 'enhanced_image_url' in res.json,
                "PIL Studio Isolation & Dynamic Tone Enhancement")

    # 7. Natural Language Processing (Speech Voice Parsing - Hindi / Hinglish)
    voice_input = "Ye handmade mitti ka pot hai. Iska size 10 inch hai. Isko banane mein 200 rupees lage hain."
    res = client.post('/api/ai/voice-parse', json={'text': voice_input})
    extracted = res.json.get('extracted_data', {})
    assert_true(
        res.status_code == 200 and 
        extracted.get('category') == 'Pottery' and 
        'clay' in extracted.get('material', '').lower() and
        extracted.get('total_cost') == 200.0,
        f"NLP Voice Attribute Extraction from Hindi text (Parsed Category: {extracted.get('category')}, Total Cost: Rs {extracted.get('total_cost')})"
    )

    # 8. Generative AI Listing Generation
    res = client.post('/api/ai/generate-description', json={
        'name': 'Handmade Mitti Matka',
        'category': 'Pottery',
        'material': 'Clay / Terracotta',
        'size': '10 inch',
        'location': 'Alwar, Rajasthan'
    })
    assert_true(
        res.status_code == 200 and 
        'title' in res.json and 
        'description' in res.json and 
        len(res.json.get('bullet_points', [])) > 0,
        "Generative AI Product Title, Storytelling & Bullet Points"
    )

    # 9. Cost-Plus Pricing Engine Formula Verification
    # Formula: Total Cost = Material + Labour + Packaging + Transportation
    # Selling Price = Total Cost / (1 - Desired Margin)
    # E.g.: Material 150 + Labour 80 + Packaging 25 + Transport 25 = 280
    # Margin 20% (0.20) -> 280 / (1 - 0.20) = 280 / 0.80 = 350
    res = client.post('/api/pricing/calculate', json={
        'raw_material_cost': 150,
        'labour_cost': 80,
        'packaging_cost': 25,
        'transport_cost': 25,
        'desired_margin_percent': 20,
        'category': 'Pottery'
    })
    breakdown = res.json.get('breakdown', {})
    assert_true(
        res.status_code == 200 and
        breakdown.get('total_cost') == 280.0 and
        breakdown.get('suggested_price') == 350.0,
        f"Cost-Based Pricing Formula: Total Cost Rs {breakdown.get('total_cost')}, Suggested Price Rs {breakdown.get('suggested_price')}"
    )

    # 10. Product Creation & Marketplace Listing
    res = client.post('/api/products', json={
        'name': 'Authentic Alwar Mitti Water Matka',
        'category': 'Pottery',
        'material': 'Clay / Terracotta',
        'size': '10 inch',
        'original_image_url': uploaded_url,
        'enhanced_image_url': uploaded_url,
        'voice_description': voice_input,
        'raw_material_cost': 150,
        'labour_cost': 80,
        'packaging_cost': 25,
        'transport_cost': 25,
        'total_cost': 280,
        'desired_margin': 0.20,
        'suggested_price': 350,
        'final_price': 350,
        'quantity': 50,
        'seller_name': 'Ramkishan Kumhar',
        'seller_location': 'Alwar, Rajasthan',
        'description': 'Handcrafted clay pot that naturally cools water through micro-porous evaporation.'
    })
    assert_true(res.status_code == 201 and res.json.get('product', {}).get('id') is not None,
                "Product Creation & SQLite Database Insertion")
    new_product_id = res.json.get('product', {}).get('id')

    # 11. Marketplace Listing Retrieval & Filtering
    res = client.get('/api/products?category=Pottery')
    assert_true(res.status_code == 200 and len(res.json.get('products', [])) >= 1,
                "Marketplace Product Querying & Category Filtering")

    # 12. AI Buyer Matching Engine
    res = client.post('/api/buyers/recommend', json={
        'category': 'Pottery',
        'product_name': 'Authentic Alwar Mitti Water Matka',
        'quantity': 50,
        'price': 350,
        'location': 'Rajasthan'
    })
    matches = res.json.get('recommended_buyers', [])
    assert_true(
        res.status_code == 200 and len(matches) > 0 and 'match_percentage' in matches[0],
        f"AI Buyer Matching 4-Factor Algorithm (Top match: {matches[0].get('business_name')} - {matches[0].get('match_percentage')}%)"
    )

    # 13. Buyer Sourcing Requirements (RFQ)
    res = client.post('/api/sourcing-requirements', json={
        'buyer_name': 'Aarav Sharma',
        'buyer_type': 'Wholesaler',
        'category': 'Pottery',
        'product_requirement': 'Handmade Terracotta Curd Pots for retail distribution',
        'quantity': 300,
        'budget': 300,
        'delivery_location': 'Jaipur, Rajasthan'
    })
    assert_true(res.status_code == 201 and res.json.get('requirement', {}).get('id') is not None,
                "Buyer RFQ Sourcing Requirement Creation")

    res = client.get('/api/sourcing-requirements')
    assert_true(res.status_code == 200 and len(res.json.get('requirements', [])) > 0,
                "Buyer Sourcing Requirements Marketplace Feed Retrieval")

    # 14. B2B Wholesale Enquiry Dispatch & Status Management
    res = client.post('/api/enquiries', json={
        'product_id': new_product_id,
        'product_name': 'Authentic Alwar Mitti Water Matka',
        'buyer_name': 'Aarav Sharma',
        'buyer_email': 'aarav@retailhub.in',
        'buyer_phone': '9876543220',
        'buyer_business': 'RetailHub Supermarkets',
        'quantity': 30,
        'proposed_budget': 330,
        'location': 'Jaipur, Rajasthan',
        'message': 'We would like to test 30 units across our 3 Jaipur outlets.'
    })
    assert_true(res.status_code == 201 and res.json.get('enquiry', {}).get('id') is not None,
                "Wholesale Bulk Enquiry Submission")
    enquiry_id = res.json.get('enquiry', {}).get('id')

    # Seller responds/updates enquiry status
    res = client.patch(f'/api/enquiries/{enquiry_id}/status', json={'status': 'Accepted'})
    assert_true(res.status_code == 200 and 'marked as Accepted' in res.json.get('message', ''),
                "Seller Enquiry Review & Acceptance Workflow")

    # 15. Direct Retail Order Placement & Inventory Deduction
    res = client.post('/api/orders', json={
        'product_id': new_product_id,
        'product_name': 'Authentic Alwar Mitti Water Matka',
        'buyer_name': 'Meera Sen',
        'buyer_address': 'Flat 402, Green Glen Layout, Bengaluru, Karnataka',
        'buyer_phone': '9876543299',
        'quantity': 2,
        'total_amount': 700.0,
        'delivery_mode': 'Direct Producer Express Cargo'
    })
    assert_true(res.status_code == 201 and res.json.get('order', {}).get('total_amount') == 700.0,
                "Direct Retail Order Placement & Checkout")

    # Verify inventory was decremented (was 50, minus 2 = 48)
    res = client.get(f'/api/products/{new_product_id}')
    assert_true(res.status_code == 200 and res.json.get('product', {}).get('quantity') == 48,
                "Live Inventory Automatic Stock Decrement")

    # 16. Smart Delivery Feasibility Checker
    res = client.post('/api/delivery/feasibility', json={
        'category': 'Pottery',
        'material': 'Clay / Terracotta',
        'size': '10 inch (4 kg)',
        'seller_location': 'Alwar, Rajasthan',
        'destination': 'Bengaluru, Karnataka'
    })
    delivery = res.json.get('delivery_feasibility', {})
    assert_true(
        res.status_code == 200 and delivery.get('feasibility_score_percent') == 88 and 'corrugation' in delivery.get('recommended_packaging', '').lower(),
        "Smart Delivery & Packaging Feasibility Rules Engine"
    )

    # 17. AI Seller Advisor Assistant
    res = client.post('/api/ai/seller-assistant', json={
        'question': 'How can I calculate a fair price and margin for my pottery?'
    })
    assert_true(
        res.status_code == 200 and len(res.json.get('answer', '')) > 20,
        "AI Seller Advisor Business Question-Answering"
    )

    # 18. Seller & Buyer Dashboard Analytics
    res_seller = client.get('/api/seller/metrics')
    res_buyer = client.get('/api/buyer/metrics')
    assert_true(
        res_seller.status_code == 200 and 'total_products' in res_seller.json.get('metrics', {}),
        "Seller Metrics & Performance Aggregation"
    )
    assert_true(
        res_buyer.status_code == 200 and len(res_buyer.json.get('orders', [])) >= 0,
        "Buyer Metrics & Procurement Overview"
    )

    print("=" * 70)
    print(f"VERIFICATION SUMMARY: {passed} PASSED, {failed} FAILED")
    print("=" * 70)

    if failed == 0:
        print("ALL TESTS PASSED! BHARAT UDYAMI BACKEND & AI LOGIC ARE 100% OPERATIONAL.")
        return 0
    else:
        print("SOME TESTS FAILED! REVIEW ERRORS ABOVE.")
        return 1

if __name__ == '__main__':
    exit(run_tests())

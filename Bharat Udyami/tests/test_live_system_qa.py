"""
Live System QA Test Script for BHARAT UDYAMI Platform
Executes real HTTP network requests against the running Flask backend
and tests all user journeys, authentication flows, and AI features.
"""

import urllib.request
import urllib.parse
import json
import time
import random
import io
from PIL import Image

BASE_URL = "http://127.0.0.1:5000"

def http_req(path, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    
    body = None
    if data is not None:
        if isinstance(data, dict):
            body = json.dumps(data).encode('utf-8')
            headers['Content-Type'] = 'application/json'
        elif isinstance(data, bytes):
            body = data
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {'raw_error': err_body}

def run_qa_suite():
    print("=" * 70)
    print("BHARAT UDYAMI LIVE QA & VALIDATION SUITE")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    def test(desc, condition, details=""):
        nonlocal passed, failed
        if condition:
            print(f"[PASS] {desc}")
            passed += 1
        else:
            print(f"[FAIL] {desc} - {details}")
            failed += 1

    # 1. Health check
    code, res = http_req("/api/health")
    test("TASK 1 & 2: Backend Health Check", code == 200 and res.get('status') == 'healthy', f"Code: {code}")

    # 2. Seller Login (Valid)
    code, res = http_req("/api/auth/login", method="POST", data={
        "identifier": "ramkishan@bharatudyami.in",
        "password": "Udyami@123"
    })
    test("TASK 3: Seller Login (Valid)", code == 200 and res.get('user', {}).get('role') == 'seller', f"Res: {res}")
    seller_token = res.get('token')

    # 3. Buyer Login (Valid)
    code, res = http_req("/api/auth/login", method="POST", data={
        "identifier": "aarav@retailhub.in",
        "password": "Buyer@123"
    })
    test("TASK 3: Buyer Login (Valid)", code == 200 and res.get('user', {}).get('role') == 'buyer', f"Res: {res}")
    buyer_token = res.get('token')

    # 4. Invalid Password Handling
    code, res = http_req("/api/auth/login", method="POST", data={
        "identifier": "ramkishan@bharatudyami.in",
        "password": "WrongPassword@999"
    })
    test("TASK 3: Invalid Password Rejected", code == 401, f"Expected 401, got {code}")

    # 5. Non-existent User Login
    code, res = http_req("/api/auth/login", method="POST", data={
        "identifier": "nobody_exists_999@test.com",
        "password": "Password@123"
    })
    test("TASK 3: Non-existent User Rejected", code == 401, f"Expected 401, got {code}")

    # 6. Seller Registration
    ts = int(time.time() * 1000)
    seller_email = f"qa_seller_{ts}@bharatudyami.in"
    seller_mobile = f"98{random.randint(10000000, 99999999)}"
    code, res = http_req("/api/auth/register", method="POST", data={
        "name": "QA Artisan Seller",
        "email": seller_email,
        "mobile": seller_mobile,
        "password": "SecurePassword@123",
        "role": "seller",
        "state": "Rajasthan",
        "city": "Jaipur"
    })
    test("TASK 3: New Seller Registration", code == 201 and res.get('user', {}).get('email') == seller_email, f"Res: {res}")
    new_seller_token = res.get('token')

    # 7. Buyer Registration
    buyer_email = f"qa_buyer_{ts}@bharatudyami.in"
    buyer_mobile = f"97{random.randint(10000000, 99999999)}"
    code, res = http_req("/api/auth/register", method="POST", data={
        "name": "QA Commercial Buyer",
        "email": buyer_email,
        "mobile": buyer_mobile,
        "password": "SecurePassword@123",
        "role": "buyer",
        "state": "Karnataka",
        "city": "Bengaluru",
        "buyer_type": "Wholesaler"
    })
    test("TASK 3: New Buyer Registration", code == 201 and res.get('user', {}).get('role') == 'buyer', f"Res: {res}")

    # 8. Duplicate Registration Prevention
    code, res = http_req("/api/auth/register", method="POST", data={
        "name": "QA Duplicate Test",
        "email": seller_email,
        "mobile": f"96{random.randint(10000000, 99999999)}",
        "password": "SecurePassword@123",
        "role": "seller",
        "state": "Rajasthan",
        "city": "Jaipur"
    })
    test("TASK 3: Duplicate Email Prevention (409 Conflict)", code == 409, f"Expected 409, got {code}")

    # 9. Logout
    code, res = http_req("/api/auth/logout", method="POST", headers={"Authorization": f"Bearer {new_seller_token}"})
    test("TASK 3: User Logout", code == 200 and res.get('success') is True, f"Res: {res}")

    # 10. AI Vision: Multipart Image Upload
    boundary = "----WebKitFormBoundaryQA7MA4YWxkTrZu0gW"
    img_byte_arr = io.BytesIO()
    test_img = Image.new('RGB', (350, 350), color=(170, 75, 45)) # Terracotta color
    test_img.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()

    form_data = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="qa_pottery.jpg"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode('utf-8') + img_bytes + f"\r\n--{boundary}--\r\n".encode('utf-8')

    code, res = http_req("/api/upload-image", method="POST", data=form_data, headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    })
    test("TASK 4: Product Image Upload & CV Analysis", code == 200 and 'cv_analysis' in res, f"Res: {res}")
    uploaded_url = res.get('url')
    cv_info = res.get('cv_analysis', {})
    test("TASK 4: CV Category Detection (Terracotta -> Pottery)", cv_info.get('suggested_category') == 'Pottery', f"Detected: {cv_info.get('suggested_category')}")

    # 11. AI Vision: PIL Studio Backdrop Enhancement
    code, res = http_req("/api/ai/enhance-image", method="POST", data={
        "image_url": uploaded_url
    })
    test("TASK 4: PIL Studio Backdrop Enhancement", code == 200 and 'studio_enhanced' in res.get('enhanced_image_url', ''), f"Res: {res}")
    enhanced_url = res.get('enhanced_image_url')

    # 12. NLP Voice Parsing (Hindi/Hinglish)
    hindi_voice = "Ye handmade mitti ka matka hai. Iska size 12 inch hai. Isko banane mein 240 rupees lage hain."
    code, res = http_req("/api/ai/voice-parse", method="POST", data={"text": hindi_voice})
    extracted = res.get('extracted_data', {})
    test("TASK 4: Voice NLP Parsing (Hindi/Hinglish)", code == 200 and extracted.get('category') == 'Pottery' and extracted.get('total_cost') == 240.0, f"Extracted: {extracted}")

    # 13. Generative AI Description Generation
    code, res = http_req("/api/ai/generate-description", method="POST", data={
        "name": "Handmade Clay Water Matka",
        "category": "Pottery",
        "material": "Natural Filtered Riverbed Clay",
        "size": "12 inch (5 L)",
        "location": "Alwar, Rajasthan"
    })
    test("TASK 4: Generative AI Description & Bullets", code == 200 and 'title' in res and len(res.get('bullet_points', [])) >= 3, f"Res: {res}")
    generated_desc = res.get('description')

    # 14. AI Pricing Calculator (Formula Verification)
    code, res = http_req("/api/pricing/calculate", method="POST", data={
        "raw_material_cost": 120,
        "labour_cost": 80,
        "packaging_cost": 20,
        "transport_cost": 20,
        "desired_margin_percent": 25,
        "category": "Pottery"
    })
    # Total = 240, Margin = 25% (0.25) -> 240 / 0.75 = 320.0
    breakdown = res.get('breakdown', {})
    test("TASK 4: Price Calculation Formula (Total 240 -> Price 320)", code == 200 and breakdown.get('total_cost') == 240.0 and breakdown.get('suggested_price') == 320.0, f"Breakdown: {breakdown}")

    # 15. AI Buyer Matching
    code, res = http_req("/api/buyers/recommend", method="POST", data={
        "category": "Pottery",
        "product_name": "Handmade Clay Water Matka",
        "quantity": 60,
        "price": 320,
        "location": "Rajasthan"
    })
    buyers = res.get('recommended_buyers', [])
    test("TASK 4: AI Buyer Matching Engine (Top Match > 70%)", code == 200 and len(buyers) > 0 and buyers[0].get('match_percentage') >= 70, f"Top match: {buyers[0] if buyers else None}")

    # 16. AI Seller Assistant
    code, res = http_req("/api/ai/seller-assistant", method="POST", data={
        "question": "How should I package fragile terracotta pottery for national shipping?"
    })
    test("TASK 4: AI Seller Assistant Knowledge Answering", code == 200 and "packaging" in res.get('answer', '').lower(), f"Answer: {res.get('answer')[:100]}...")

    # 17. Product Publishing
    code, res = http_req("/api/products", method="POST", headers={"Authorization": f"Bearer {seller_token}"}, data={
        "name": f"QA Terracotta Water Vessel {ts}",
        "category": "Pottery",
        "material": "Riverbed Clay",
        "size": "12 inch",
        "quantity": 80,
        "unit": "pieces",
        "raw_material_cost": 120,
        "labour_cost": 80,
        "packaging_cost": 20,
        "transport_cost": 20,
        "total_cost": 240,
        "desired_margin": 0.25,
        "suggested_price": 320,
        "final_price": 320,
        "description": generated_desc,
        "original_image_url": uploaded_url,
        "enhanced_image_url": enhanced_url,
        "seller_name": "Ramkishan Kumhar",
        "seller_location": "Alwar, Rajasthan",
        "seller_type": "Master Potter"
    })
    test("TASK 4: Product Publishing to Catalog", code == 201 and res.get('product', {}).get('id') is not None, f"Res: {res}")
    published_product_id = res.get('product', {}).get('id')

    # 18. Marketplace: List & Filter by Category
    code, res = http_req("/api/products?category=Pottery")
    test("TASK 5: Marketplace Category Filter (Pottery)", code == 200 and res.get('count', 0) >= 1, f"Count: {res.get('count')}")

    # 19. Marketplace: Search
    code, res = http_req(f"/api/products?search={ts}")
    test("TASK 5: Marketplace Product Search", code == 200 and res.get('count', 0) >= 1, f"Count: {res.get('count')}")

    # 20. Marketplace: Product Details by ID
    code, res = http_req(f"/api/products/{published_product_id}")
    prod = res.get('product', {})
    feasibility = res.get('delivery_feasibility', {})
    test("TASK 5: Product Details & Logistics Integration", code == 200 and prod.get('id') == published_product_id and feasibility.get('feasibility_score_percent') is not None, f"Res: {res}")

    # 21. B2B Wholesale Enquiry Submission
    code, res = http_req("/api/enquiries", method="POST", data={
        "product_id": published_product_id,
        "product_name": prod.get('name'),
        "buyer_name": "Aarav Sharma",
        "buyer_business": "RetailHub Supermarkets",
        "buyer_email": "aarav@retailhub.in",
        "buyer_phone": "9876543220",
        "quantity": 40,
        "proposed_budget": 300,
        "location": "Jaipur, Rajasthan",
        "message": "Interested in 40 units for retail display."
    })
    test("TASK 5: Wholesale Bulk Enquiry Submission", code == 201 and res.get('enquiry', {}).get('id') is not None, f"Res: {res}")
    enquiry_id = res.get('enquiry', {}).get('id')

    # 22. Seller Enquiry Status Update
    code, res = http_req(f"/api/enquiries/{enquiry_id}/status", method="PATCH", data={"status": "Accepted"})
    test("TASK 5: Seller Enquiry Status Update (Accepted)", code == 200 and "Accepted" in res.get('message', ''), f"Res: {res}")

    # 23. Direct Retail Order Placement & Inventory Stock Decrement
    initial_stock = prod.get('quantity', 80)
    order_qty = 5
    code, res = http_req("/api/orders", method="POST", data={
        "product_id": published_product_id,
        "product_name": prod.get('name'),
        "buyer_name": "Pooja Verma",
        "buyer_address": "Sector 14, Gurugram, Haryana",
        "buyer_phone": "9811122334",
        "quantity": order_qty,
        "total_amount": 320 * order_qty,
        "delivery_mode": "Standard Ground Express"
    })
    test("TASK 5: Direct Retail Order Placement", code == 201 and res.get('order', {}).get('total_amount') == 1600.0, f"Res: {res}")

    # Verify inventory stock was decremented
    code, res = http_req(f"/api/products/{published_product_id}")
    new_stock = res.get('product', {}).get('quantity')
    test("TASK 5: Real-Time Inventory Decrement (80 -> 75)", new_stock == (initial_stock - order_qty), f"Was {initial_stock}, now {new_stock}")

    # 24. Buyer Sourcing Requirements (RFQ)
    code, res = http_req("/api/sourcing-requirements", method="POST", headers={"Authorization": f"Bearer {buyer_token}"}, data={
        "buyer_name": "Aarav Sharma",
        "buyer_type": "Wholesaler",
        "product_requirement": "Procuring 500 units of terracotta curd handis for summer promotion",
        "category": "Pottery",
        "quantity": 500,
        "budget": 280,
        "delivery_location": "Jaipur, Rajasthan"
    })
    test("TASK 5: Buyer Sourcing RFQ Posting", code == 201 and res.get('requirement', {}).get('id') is not None, f"Res: {res}")

    # 25. Seller Dashboard Metrics
    code, res = http_req("/api/seller/metrics", headers={"Authorization": f"Bearer {seller_token}"})
    metrics = res.get('metrics', {})
    test("TASK 5: Seller Dashboard Analytics & Metrics", code == 200 and 'total_products' in metrics and 'total_revenue' in metrics, f"Metrics: {metrics}")

    # 26. Buyer Dashboard Metrics
    code, res = http_req("/api/buyer/metrics", headers={"Authorization": f"Bearer {buyer_token}"})
    test("TASK 5: Buyer Dashboard Overview", code == 200 and 'orders' in res and 'sourcing_requirements' in res, f"Res: {res}")

    # 27. Delivery Feasibility Rules Engine
    code, res = http_req("/api/delivery/feasibility", method="POST", data={
        "category": "Wooden Products",
        "material": "Sheesham Wood",
        "size": "9 inch",
        "seller_location": "Saharanpur, Uttar Pradesh",
        "destination": "Mumbai, Maharashtra"
    })
    deliv = res.get('delivery_feasibility', {})
    test("TASK 6: Smart Delivery Feasibility (Woodcraft)", code == 200 and deliv.get('feasibility_score_percent') == 96, f"Feasibility: {deliv}")

    print("=" * 70)
    print(f"LIVE QA EXECUTION SUMMARY: {passed} PASSED, {failed} FAILED")
    print("=" * 70)
    return failed == 0

if __name__ == '__main__':
    success = run_qa_suite()
    exit(0 if success else 1)

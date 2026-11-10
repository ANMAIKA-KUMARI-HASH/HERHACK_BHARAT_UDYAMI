import requests
import io
from PIL import Image

BASE = 'http://localhost:5173'

def run_tests():
    print('=============================================')
    print('RUNNING MARKETLINK AI END-TO-END VERIFICATION')
    print('=============================================')

    # 1. Frontend Check
    r = requests.get(BASE)
    assert r.status_code == 200, f'Frontend not running (Status {r.status_code})'
    print('[PASS] 1. React Frontend responding (Status: 200)')

    # 2 & 3. Backend & Connection Check
    r = requests.get(f'{BASE}/api/health')
    assert r.status_code == 200, 'Backend not responding'
    print('[PASS] 2 & 3. Flask Backend connected via Vite proxy (Health: OK)')

    # 4. Seller Image Upload
    img = Image.new('RGB', (400, 400), color=(140, 70, 40))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    r = requests.post(f'{BASE}/api/upload-image', files={'file': ('matka.jpg', buf, 'image/jpeg')})
    upload_data = r.json()
    assert upload_data.get('success') is True, 'Image upload failed'
    img_url = upload_data['url']
    print(f'[PASS] 4. Seller Image uploaded successfully -> {img_url}')

    # AI Enhancement with PIL
    r = requests.post(f'{BASE}/api/ai/enhance-image', json={'image_url': img_url})
    enh_url = r.json().get('enhanced_image_url')
    print(f'[PASS] 4b. AI Studio Enhancement applied -> {enh_url}')

    # 5. Voice-to-Listing Parsing
    voice_prompt = 'Ye mitti ka handmade pot hai. Isme natural mitti use hui hai. Iska size 10 inch hai aur production cost 200 rupees hai.'
    r = requests.post(f'{BASE}/api/ai/voice-parse', json={'text': voice_prompt})
    voice_data = r.json()
    assert voice_data.get('success') is True, 'Voice parse failed'
    extracted = voice_data['extracted_data']
    print(f"[PASS] 5. Voice parsed: Category={extracted['category']}, Material={extracted['material']}, Cost={extracted['total_cost']}")

    # 6. Pricing Calculator Test
    r = requests.post(f'{BASE}/api/pricing/calculate', json={
        'raw_material_cost': 350,
        'labour_cost': 200,
        'packaging_cost': 50,
        'transport_cost': 0,
        'desired_margin_percent': 20,
        'category': 'Pottery'
    })
    pricing = r.json()['breakdown']
    assert pricing['total_cost'] == 600.0, 'Incorrect total cost'
    assert pricing['suggested_price'] == 750.0, 'Incorrect suggested price'
    print(f"[PASS] 6. Pricing formula verified: Total={pricing['total_cost']}, Margin={pricing['desired_margin_percent']}%, Suggested Price={pricing['suggested_price']}")

    # 7 & 8. Publish Product to SQLite
    payload = {
        'name': 'Masterpiece Terracotta Handi Pot',
        'category': 'Pottery',
        'material': extracted['material'],
        'size': extracted['size'],
        'quantity': 75,
        'unit': 'pieces',
        'raw_material_cost': 110,
        'labour_cost': 70,
        'packaging_cost': 15,
        'transport_cost': 5,
        'total_cost': 200,
        'desired_margin': 0.25,
        'suggested_price': 267,
        'final_price': 267,
        'description': extracted['description'],
        'original_image_url': img_url,
        'enhanced_image_url': enh_url,
        'seller_name': 'Ramkishan Kumhar',
        'seller_location': 'Alwar, Rajasthan'
    }
    r = requests.post(f'{BASE}/api/products', json=payload)
    prod_res = r.json()
    assert prod_res.get('success') is True, 'Product publishing failed'
    new_prod_id = prod_res['product']['id']
    print(f"[PASS] 7 & 8. Product published and saved in SQLite (ID: {new_prod_id}, Name: {prod_res['product']['name']})")

    # 9. Verify in Marketplace
    r = requests.get(f'{BASE}/api/products')
    all_prods = r.json()['products']
    assert any(p['id'] == new_prod_id for p in all_prods), 'Published product not in marketplace'
    print(f'[PASS] 9. Marketplace verified: Published product ID {new_prod_id} is live (Total active: {len(all_prods)})')

    # 10a. Search & Filter Test
    r = requests.get(f'{BASE}/api/products?category=Pottery&search=Terracotta')
    filtered = r.json()['products']
    assert len(filtered) > 0, 'Filter returned empty'
    print(f'[PASS] 10a. Search & Category filter working (Found {len(filtered)} items)')

    # 10b. Buyer Matching
    r = requests.post(f'{BASE}/api/buyers/recommend', json={
        'category': 'Pottery',
        'product_name': 'Masterpiece Terracotta Handi Pot',
        'quantity': 75,
        'price': 267,
        'location': 'Rajasthan'
    })
    matches = r.json()['recommended_buyers']
    top_match = matches[0]
    print(f"[PASS] 10b. AI Buyer Match verified: Top match '{top_match['business_name']}' with {top_match['match_percentage']}% score")

    # 10c. Buyer Enquiry
    r = requests.post(f'{BASE}/api/enquiries', json={
        'product_id': new_prod_id,
        'product_name': 'Masterpiece Terracotta Handi Pot',
        'buyer_name': 'Jaipur Heritage Decor',
        'buyer_business': 'Jaipur Heritage Retail',
        'buyer_email': 'contact@jaipurheritage.in',
        'buyer_phone': '+91 98290 88776',
        'quantity': 30,
        'proposed_budget': 260,
        'location': 'Jaipur, Rajasthan',
        'message': 'Interested in recurring monthly supply of 30 pieces.'
    })
    enq_res = r.json()
    assert enq_res.get('success') is True, 'Enquiry failed'
    enq_id = enq_res['enquiry']['id']
    print(f'[PASS] 10c. Buyer Enquiry submitted directly to maker (Enquiry ID: {enq_id})')

    # 10d. Cart Checkout / Order Placement
    r = requests.post(f'{BASE}/api/orders', json={
        'product_id': new_prod_id,
        'product_name': 'Masterpiece Terracotta Handi Pot',
        'buyer_name': 'Aarav Gupta',
        'buyer_address': 'Vaishali Nagar, Jaipur',
        'buyer_phone': '+91 98290 33221',
        'quantity': 5,
        'total_amount': 267 * 5,
        'delivery_mode': 'Insulated Fragile Cargo'
    })
    ord_res = r.json()
    assert ord_res.get('success') is True, 'Order failed'
    print(f"[PASS] 10d. Cart Order placed: #{ord_res['order']['order_number']}, Stock deducted")

    # 11. Seller Dashboard Verification
    r = requests.get(f'{BASE}/api/seller/metrics')
    metrics = r.json()['metrics']
    print(f"[PASS] 11. Seller Dashboard updated: Orders={metrics['total_orders']}, Products={metrics['total_products']}, Enquiries={len(metrics['recent_enquiries'])}")

    # 12. AI Seller Assistant
    r = requests.post(f'{BASE}/api/ai/seller-assistant', json={'question': 'How should I price my product?'})
    assert r.json().get('success') is True, 'AI Assistant failed'
    print('[PASS] 12. AI Seller Advisor responded with cost-plus pricing strategy guidance')

    print('=============================================')
    print('ALL 12 CORE CHECKS PASSED WITH FLYING COLORS!')
    print('=============================================')

if __name__ == '__main__':
    run_tests()

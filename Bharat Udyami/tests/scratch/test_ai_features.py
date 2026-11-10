import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests

BASE_URL = "http://127.0.0.1:5000/api"

def test_ai_features():
    print("Testing Bharat Udyami Advanced AI Features...")

    # 1. Studio Styles
    res = requests.get(f"{BASE_URL}/ai/studio/styles")
    assert res.status_code == 200 and res.json()['success']
    styles = res.json()['styles']
    print(f"[PASS] Studio styles ({len(styles)} styles) returned successfully: {[s['id'] for s in styles]}")

    # 2. Studio Image Enhancement (Test Clean White & Premium Studio)
    test_img = "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80"
    enh_res = requests.post(f"{BASE_URL}/ai/studio/enhance", json={
        "image_url": test_img,
        "background_style": "premium-studio",
        "brightness": 5,
        "contrast": 10,
        "sharpness": 60
    })
    assert enh_res.status_code == 200 and enh_res.json()['success']
    enh_data = enh_res.json()
    assert enh_data['enhanced_image_url']
    print(f"[PASS] Studio Enhance applied style: {enh_data['background_style']}, CV quality score: {enh_data['cv_analysis']['quality_score']}")

    # 3. Studio Analyze
    anz_res = requests.post(f"{BASE_URL}/ai/studio/analyze", json={"image_url": test_img})
    assert anz_res.status_code == 200 and anz_res.json()['success']
    print(f"[PASS] Studio Analyze returned sharpness {anz_res.json()['cv_analysis']['sharpness_score']}")

    # 4. Languages List (22 Scheduled Languages)
    lang_res = requests.get(f"{BASE_URL}/ai/languages")
    assert lang_res.status_code == 200 and lang_res.json()['success']
    langs = lang_res.json()['languages']
    print(f"[PASS] Supported Languages ({len(langs)} languages) returned: {[l['name'] for l in langs[:5]]}...")

    # 5. Multilingual Voice Parse with Conversational Questions
    sample_speech = "I made this product using wood, paint and polish. Wood cost me 300, paint cost 100 and labour cost 250."
    parse_res = requests.post(f"{BASE_URL}/ai/multilingual-parse", json={
        "speech_text": sample_speech,
        "language_code": "en"
    })
    assert parse_res.status_code == 200 and parse_res.json()['success']
    p_data = parse_res.json()
    assert p_data['extracted_data']['raw_material_cost'] == 400.0 # 300 + 100
    assert p_data['extracted_data']['labour_cost'] == 250.0
    print(f"[PASS] Multilingual parse correctly extracted materials & costs: raw ₹{p_data['extracted_data']['raw_material_cost']}, labour ₹{p_data['extracted_data']['labour_cost']}")
    print(f"[PASS] Follow-up questions generated for missing info: {len(p_data['follow_up_questions'])} questions")

    # 6. Smart Category-Specific Pricing
    price_res = requests.post(f"{BASE_URL}/ai/smart-pricing", json={
        "category": "Handicrafts & Handmade Products",
        "raw_material_cost": 400,
        "labour_cost": 250,
        "packaging_cost": 40,
        "transport_cost": 30,
        "desired_margin_percent": 25
    })
    assert price_res.status_code == 200 and price_res.json()['success']
    pr_data = price_res.json()
    assert pr_data['pricing_tiers']['suggested_fair_price'] > 0
    assert pr_data['pricing_tiers']['wholesale_b2b_price'] < pr_data['pricing_tiers']['suggested_fair_price']
    print(f"[PASS] Smart pricing calculated: Total cost ₹{pr_data['breakdown']['total_production_cost']}, Retail ₹{pr_data['pricing_tiers']['suggested_fair_price']}, Wholesale ₹{pr_data['pricing_tiers']['wholesale_b2b_price']}")
    print(f"[PASS] Market benchmark: {pr_data['market_benchmark']}")

    # 7. Generate Full Listing
    list_res = requests.post(f"{BASE_URL}/ai/generate-full-listing", json={
        "name": "Hand-Carved Sheesham Wooden Bowl",
        "category": "Handicrafts & Handmade Products",
        "materials": ["Seasoned Sheesham Wood", "Natural Beeswax"],
        "size": "9 inch diameter",
        "location": "Saharanpur, UP"
    })
    assert list_res.status_code == 200 and list_res.json()['success']
    l_data = list_res.json()
    assert len(l_data['keywords']) >= 5
    assert len(l_data['features']) >= 3
    print(f"[PASS] Generate Full Listing created title, description, {len(l_data['features'])} bullet points, and {len(l_data['keywords'])} search tags")

    print("\n======================================================================")
    print("ALL ADVANCED AI BACKEND ENDPOINTS PASSED PERFECTLY!")
    print("======================================================================")

if __name__ == "__main__":
    test_ai_features()

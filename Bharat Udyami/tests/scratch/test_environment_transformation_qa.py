import os
import sys
import io
import json
import requests
from PIL import Image, ImageDraw

BASE_URL = "http://127.0.0.1:5000"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def run_tests():
    log("Starting Bharat Udyami AI Smart Product Environment Transformation QA Suite...")

    # 1. Check API Health
    res = requests.get(f"{BASE_URL}/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    log("1. Health check passed.", "PASS")

    # 2. Check 8 Environment Styles
    res = requests.get(f"{BASE_URL}/api/ai/studio/environment-styles")
    assert res.status_code == 200, f"Styles check failed: {res.text}"
    styles_data = res.json()
    assert styles_data.get('success') is True, "Styles response success is not True"
    styles = styles_data.get('styles', [])
    assert len(styles) == 8, f"Expected 8 styles, got {len(styles)}"
    
    style_ids = [s['id'] for s in styles]
    expected_ids = [
        "natural-earthy",
        "minimal-luxury",
        "premium-studio",
        "modern-home",
        "traditional-indian",
        "elegant-boutique",
        "pure-white",
        "custom-prompt"
    ]
    for eid in expected_ids:
        assert eid in style_ids, f"Style {eid} missing from environment styles"
    log(f"2. All 8 Environment Styles verified ({', '.join(style_ids)}).", "PASS")

    # 3. Check Environment Status endpoint
    res = requests.get(f"{BASE_URL}/api/ai/studio/environment-status")
    assert res.status_code == 200, f"Environment status failed: {res.text}"
    status_data = res.json()
    log(f"3. Environment status verified: Active engine = '{status_data.get('active_inpainting_engine')}'.", "PASS")

    # 4. Create and upload a realistic synthetic test craft image
    img = Image.new("RGB", (600, 600), color=(220, 215, 210))
    draw = ImageDraw.Draw(img)
    # Draw clay pot body
    draw.ellipse([(180, 200), (420, 480)], fill=(185, 78, 40), outline=(130, 50, 25), width=3)
    # Draw pot neck
    draw.rectangle([(240, 140), (360, 210)], fill=(200, 85, 45), outline=(130, 50, 25), width=3)
    # Draw rim
    draw.ellipse([(225, 125), (375, 155)], fill=(175, 70, 35), outline=(120, 45, 20), width=3)
    # Pot decorative patterns
    draw.arc([(200, 300), (400, 360)], start=0, end=180, fill=(245, 200, 120), width=4)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)

    files = {"file": ("test_artisan_pot.jpg", buf, "image/jpeg")}
    upload_res = requests.post(f"{BASE_URL}/api/upload-image", files=files)
    assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
    upload_data = upload_res.json()
    assert upload_data.get('success') is True
    image_url = upload_data.get('url')
    log(f"4. Test photograph uploaded successfully: {image_url}", "PASS")

    # 5. Test 6-Point Scene Analysis endpoint
    analyze_res = requests.post(f"{BASE_URL}/api/ai/studio/analyze-scene", json={"image_url": image_url})
    assert analyze_res.status_code == 200, f"Analyze scene failed: {analyze_res.text}"
    analyze_data = analyze_res.json()
    assert analyze_data.get('success') is True
    scene = analyze_data.get('scene_analysis', {})
    log(f"5. 6-Point Scene Analysis verified: "
        f"Category='{scene.get('detected_category')}', "
        f"Surface='{scene.get('current_surface')}', "
        f"Angle='{scene.get('camera_angle')}', "
        f"Lighting='{scene.get('lighting_profile')}', "
        f"Recommended='{scene.get('recommended_environment')}'.", "PASS")

    # 6. Test Environment Transformation with Natural & Earthy style
    transform_res = requests.post(f"{BASE_URL}/api/ai/studio/transform-environment", json={
        "image_url": image_url,
        "environment_style": "natural-earthy",
        "brightness": 2,
        "contrast": 3,
        "sharpness": 55
    })
    assert transform_res.status_code == 200, f"Transformation failed: {transform_res.text}"
    transform_data = transform_res.json()
    assert transform_data.get('success') is True
    assert transform_data.get('product_fidelity_guaranteed') is True
    enhanced_url = transform_data.get('enhanced_image_url')
    cutout_url = transform_data.get('cutout_image_url')
    assert enhanced_url, "Missing enhanced_image_url in response"
    assert cutout_url, "Missing cutout_image_url in response"

    # Verify enhanced image is retrievable
    img_get = requests.get(f"{BASE_URL}{enhanced_url}")
    assert img_get.status_code == 200, f"Could not retrieve transformed image from {enhanced_url}"
    assert len(img_get.content) > 1000, "Transformed image response is too small"
    log(f"6. Natural & Earthy Environment transformation successful: {enhanced_url} (Size: {len(img_get.content)} bytes).", "PASS")

    # 7. Test Environment Transformation with Minimal Luxury style
    luxury_res = requests.post(f"{BASE_URL}/api/ai/studio/transform-environment", json={
        "image_url": image_url,
        "environment_style": "minimal-luxury"
    })
    assert luxury_res.status_code == 200
    luxury_data = luxury_res.json()
    assert luxury_data.get('success') is True
    log("7. Minimal Luxury Environment transformation verified.", "PASS")

    # 8. Test Custom Background Prompt transformation
    custom_prompt_text = "On an antique teak table with marigold flower petals in a sunlit Jaipur haveli courtyard"
    custom_res = requests.post(f"{BASE_URL}/api/ai/studio/transform-environment", json={
        "image_url": image_url,
        "environment_style": "custom-prompt",
        "custom_prompt": custom_prompt_text
    })
    assert custom_res.status_code == 200, f"Custom prompt transformation failed: {custom_res.text}"
    custom_data = custom_res.json()
    assert custom_data.get('success') is True
    log(f"8. Custom Background Prompt transformation verified: '{custom_prompt_text[:40]}...'.", "PASS")

    # 9. Regression check: Forgot Password OTP workflow (real email check + invalid email handling)
    fp_invalid = requests.post(f"{BASE_URL}/api/auth/forgot-password", json={"email": "nonexistent_email_12345@test.com"})
    assert fp_invalid.status_code == 404, f"Expected 404 for nonexistent email, got {fp_invalid.status_code}"
    
    fp_res = requests.post(f"{BASE_URL}/api/auth/forgot-password", json={"email": "aarav@retailhub.in"})
    assert fp_res.status_code in (200, 429, 503), f"Forgot password failed: {fp_res.text}"
    if fp_res.status_code == 503:
        assert fp_res.json().get('error_code') == 'SMTP_NOT_CONFIGURED', "Expected SMTP_NOT_CONFIGURED when SMTP not set"
    log("9. Regression Check: Forgot password recovery endpoint operational (honest status & validation verified).", "PASS")

    # 10. Regression check: Smart Pricing Engine
    price_res = requests.post(f"{BASE_URL}/api/ai/smart-pricing", json={
        "category": "Handicrafts & Handmade Products",
        "raw_material_cost": 350,
        "labour_cost": 250,
        "packaging_cost": 40,
        "transport_cost": 30,
        "desired_margin_percent": 25
    })
    assert price_res.status_code == 200, f"Smart pricing failed: {price_res.text}"
    price_data = price_res.json()
    assert price_data.get('pricing_tiers', {}).get('suggested_fair_price') == 893
    log("10. Regression Check: Cost-based pricing formula verified (Rs. 670 / 0.75 = Rs. 893).", "PASS")

    print("\n=========================================================================")
    print("ALL 10 QA VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=========================================================================")

if __name__ == "__main__":
    run_tests()

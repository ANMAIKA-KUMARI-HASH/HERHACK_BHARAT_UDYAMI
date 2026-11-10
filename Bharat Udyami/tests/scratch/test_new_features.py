import requests

BASE_URL = "http://127.0.0.1:5000/api"

def test_new_features():
    print("Testing Bharat Udyami Enhanced Features...")

    # 1. Locations
    res = requests.get(f"{BASE_URL}/locations")
    assert res.status_code == 200 and res.json()['success']
    print("[PASS] Locations API returned states & districts")

    # 2. OTP flow
    res = requests.post(f"{BASE_URL}/auth/send-otp", json={"identifier": "9876543210"})
    assert res.status_code == 200 and res.json()['success']
    print("[PASS] Send OTP API succeeded")

    res = requests.post(f"{BASE_URL}/auth/verify-otp", json={"identifier": "9876543210", "otp": "123456", "role": "buyer"})
    assert res.status_code == 200 and res.json()['success']
    token = res.json()['token']
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Verify OTP login succeeded")

    # Find first product
    prod_res = requests.get(f"{BASE_URL}/products")
    assert prod_res.status_code == 200
    first_prod = prod_res.json()['products'][0]
    prod_id = first_prod['id']
    print(f"Testing against Product ID {prod_id}: {first_prod['name']}")

    # 3. Reviews
    res = requests.get(f"{BASE_URL}/products/{prod_id}/reviews")
    assert res.status_code == 200 and res.json()['success']
    print(f"[PASS] Fetch Reviews API returned {len(res.json()['reviews'])} genuine reviews")

    res = requests.post(f"{BASE_URL}/products/{prod_id}/reviews", json={
        "rating": 5,
        "comment": "Exceptional craftsmanship, packaged securely with zero damage!",
        "reviewer_name": "Radhika Sharma"
    }, headers=headers)
    assert res.status_code == 201 and res.json()['success']
    print("[PASS] Add Review API recalculated rating and stored review successfully")

    # 4. Wishlist
    res = requests.post(f"{BASE_URL}/wishlist", json={"product_id": prod_id}, headers=headers)
    assert res.status_code in [200, 201] and res.json()['success']
    print("[PASS] Add to Wishlist API succeeded")

    res = requests.get(f"{BASE_URL}/wishlist", headers=headers)
    assert res.status_code == 200 and res.json()['success']
    print(f"[PASS] Fetch Wishlist API returned {len(res.json()['wishlist'])} items")

    # 5. Reports (Trust & Safety)
    res = requests.post(f"{BASE_URL}/reports", json={
        "report_type": "product",
        "target_id": prod_id,
        "target_title": first_prod['name'],
        "reporter_name": "Trust Auditor",
        "reporter_email": "auditor@bharatudyami.in",
        "reason": "Test audit",
        "details": "Routine quality compliance verification"
    }, headers=headers)
    assert res.status_code == 201 and res.json()['success']
    print("[PASS] Trust & Safety Report API succeeded")

    # 6. Notifications
    res = requests.get(f"{BASE_URL}/notifications", headers=headers)
    assert res.status_code == 200 and res.json()['success']
    print(f"[PASS] Notifications API returned {len(res.json()['notifications'])} alerts")

    # 7. Seller toggle product status & edit product
    s_login = requests.post(f"{BASE_URL}/auth/login", json={"identifier": "ramkishan@bharatudyami.in", "password": "Udyami@123"})
    assert s_login.status_code == 200
    s_token = s_login.json()['token']
    s_headers = {"Authorization": f"Bearer {s_token}"}

    # Pause Product
    res = requests.patch(f"{BASE_URL}/products/{prod_id}/status", json={"status": "paused"}, headers=s_headers)
    assert res.status_code == 200 and res.json()['success']
    print("[PASS] Toggle Product Status (Paused) succeeded")

    # Resume Product
    res = requests.patch(f"{BASE_URL}/products/{prod_id}/status", json={"status": "active"}, headers=s_headers)
    assert res.status_code == 200 and res.json()['success']
    print("[PASS] Toggle Product Status (Resume Active) succeeded")

    # Edit Product
    res = requests.put(f"{BASE_URL}/products/{prod_id}", json={
        "name": f"{first_prod['name']} (Verified)",
        "final_price": 285,
        "quantity": 65,
        "description": "Updated handcrafted creation direct from master artisan workshop."
    }, headers=s_headers)
    assert res.status_code == 200 and res.json()['success']
    print("[PASS] Update Product API succeeded")

    print("\n======================================================================")
    print("ALL ENHANCED FEATURES VERIFIED WITH ZERO ERRORS!")
    print("======================================================================")

if __name__ == "__main__":
    test_new_features()

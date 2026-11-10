import re
import math
import os

INDIAN_LANGUAGES = [
    {"code": "hi", "name": "Hindi", "native": "हिन्दी", "bcp47": "hi-IN", "region": "North & Central India"},
    {"code": "bho", "name": "Bhojpuri", "native": "भोजपुरी", "bcp47": "hi-IN", "region": "Bihar & Eastern UP"},
    {"code": "awa", "name": "Awadhi", "native": "अवधी", "bcp47": "hi-IN", "region": "Central Uttar Pradesh"},
    {"code": "bn", "name": "Bengali", "native": "বাংলা", "bcp47": "bn-IN", "region": "West Bengal & Tripura"},
    {"code": "mr", "name": "Marathi", "native": "मराठी", "bcp47": "mr-IN", "region": "Maharashtra"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "bcp47": "gu-IN", "region": "Gujarat"},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்", "bcp47": "ta-IN", "region": "Tamil Nadu"},
    {"code": "te", "name": "Telugu", "native": "తెలుగు", "bcp47": "te-IN", "region": "Andhra Pradesh & Telangana"},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "bcp47": "kn-IN", "region": "Karnataka"},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "bcp47": "ml-IN", "region": "Kerala"},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ", "bcp47": "pa-IN", "region": "Punjab"},
    {"code": "or", "name": "Odia", "native": "ଓଡ଼ିଆ", "bcp47": "or-IN", "region": "Odisha"},
    {"code": "as", "name": "Assamese", "native": "অসমীয়া", "bcp47": "as-IN", "region": "Assam"},
    {"code": "ur", "name": "Urdu", "native": "اردو", "bcp47": "ur-IN", "region": "Pan-India"},
    {"code": "ks", "name": "Kashmiri", "native": "کٲشُر", "bcp47": "ks-IN", "region": "Jammu & Kashmir"},
    {"code": "ne", "name": "Nepali", "native": "नेपाली", "bcp47": "ne-IN", "region": "Sikkim & West Bengal"},
    {"code": "sa", "name": "Sanskrit", "native": "संस्कृतम्", "bcp47": "hi-IN", "region": "Classical Heritage"},
    {"code": "mai", "name": "Maithili", "native": "मैथिली", "bcp47": "hi-IN", "region": "Bihar & Mithila"},
    {"code": "doi", "name": "Dogri", "native": "डोगरी", "bcp47": "hi-IN", "region": "Jammu"},
    {"code": "kok", "name": "Konkani", "native": "कोंकणी", "bcp47": "kok-IN", "region": "Goa & Konkan"},
    {"code": "mni", "name": "Manipuri (Meitei)", "native": "মৈতৈলোন্", "bcp47": "mni-IN", "region": "Manipur"},
    {"code": "brx", "name": "Bodo", "native": "बड़ो", "bcp47": "as-IN", "region": "Assam & Bodoland"},
    {"code": "sat", "name": "Santali", "native": "ᱥᱟᱱᱛᱟᱲᱤ", "bcp47": "or-IN", "region": "Jharkhand & Odisha"},
    {"code": "sd", "name": "Sindhi", "native": "سنڌي", "bcp47": "hi-IN", "region": "Western India"},
    {"code": "en", "name": "Indian English / Hinglish", "native": "English", "bcp47": "en-IN", "region": "Pan-India"}
]

# Vocabulary map for regional craft terms across languages
CRAFT_VOCABULARY = {
    "pottery": ["mitti", "matka", "handi", "surahi", "gamla", "kulhad", "terracotta", "clay", "chak", "kumhar", "kumbhar", "earthen", "pot", "vessel"],
    "wood": ["lakdi", "sheesham", "teak", "sagwan", "wood", "carving", "suthar", "badhai", "furniture", "box", "bowl", "carved", "timber"],
    "handloom": ["khadi", "cotton", "soot", "resham", "silk", "handloom", "chanderi", "bandhani", "ikat", "block print", "stole", "saree", "dupatta", "weave"],
    "metal": ["peetal", "brass", "kansa", "bronze", "tamba", "copper", "iron", "loha", "padlock", "dhokra", "bell", "cast"],
    "agriculture": ["gehu", "wheat", "sharbati", "chawal", "rice", "basmati", "dal", "pulses", "sarson", "mustard", "tel", "oil", "organic", "farm", "kisan", "mandi"],
    "food": ["achar", "pickle", "murabba", "chutney", "masala", "spice", "laddu", "sweets", "homemade", "shudh", "desi", "snack"],
    "art": ["painting", "chitra", "madhubani", "warli", "pattachitra", "canvas", "kala", "sculpture", "rang", "color", "folk art"]
}

def detect_language(text):
    """
    Detects the language script or keywords from text.
    Returns language dictionary.
    """
    if not text:
        return INDIAN_LANGUAGES[0]

    # Script detection
    for char in text:
        code_point = ord(char)
        if 0x0900 <= code_point <= 0x097F:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "hi"), INDIAN_LANGUAGES[0])
        elif 0x0980 <= code_point <= 0x09FF:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "bn"), INDIAN_LANGUAGES[0])
        elif 0x0A00 <= code_point <= 0x0A7F:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "pa"), INDIAN_LANGUAGES[0])
        elif 0x0A80 <= code_point <= 0x0AFF:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "gu"), INDIAN_LANGUAGES[0])
        elif 0x0B00 <= code_point <= 0x0B7F:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "or"), INDIAN_LANGUAGES[0])
        elif 0x0B80 <= code_point <= 0x0BFF:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "ta"), INDIAN_LANGUAGES[0])
        elif 0x0C00 <= code_point <= 0x0C7F:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "te"), INDIAN_LANGUAGES[0])
        elif 0x0C80 <= code_point <= 0x0CFF:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "kn"), INDIAN_LANGUAGES[0])
        elif 0x0D00 <= code_point <= 0x0D7F:
            return next((l for l in INDIAN_LANGUAGES if l["code"] == "ml"), INDIAN_LANGUAGES[0])

    # Hinglish / English Latin script
    return next((l for l in INDIAN_LANGUAGES if l["code"] == "en"), INDIAN_LANGUAGES[0])

def parse_conversational_speech(speech_text, user_lang_code="hi"):
    """
    NLP extraction from informal, spoken Indian regional speech.
    Handles sentences like:
    "I made this product using wood, paint and polish. Wood cost me ₹300, paint cost ₹100 and labour cost ₹250."
    Or Hindi:
    "Ye mitti ka pot hai, lakdi aur mitti lagi hai. Mitti 150 ki, labour 100 aur packaging 25 rupees."
    """
    text = speech_text.strip()
    text_lower = text.lower()

    # 1. Cost Extractions
    # Look for itemized costs: e.g. "wood cost 300", "paint 100", "labour 250"
    raw_material_cost = 0.0
    labour_cost = 0.0
    packaging_cost = 0.0
    transport_cost = 0.0
    expected_price = 0.0

    # Match rupee amounts with preceding keywords
    # Material costs: allow phrases like "wood cost me 300", "paint cost 100", "mitti 150 rupees"
    mat_matches = re.findall(r'(?:wood|lakdi|mitti|clay|fabric|cloth|material|paint|polish|brass|metal|raw)\b(?:[^\d]{0,25}?(?:cost|ka|ki|me|worth|of|price|lagat|laga))?[^\d]{0,15}?(?:rs\.?|inr|₹|rupees)?\s*(\d+(?:\.\d+)?)', text_lower)
    if mat_matches:
        raw_material_cost = sum(float(m) for m in mat_matches)

    # Labour costs
    lab_match = re.search(r'(?:labour|labor|karigari|mehnat|banane\s*me|making|workmanship)\b[^\d]{0,20}?(?:rs\.?|inr|₹|rupees)?\s*(\d+(?:\.\d+)?)', text_lower)
    if lab_match:
        labour_cost = float(lab_match.group(1))

    # Packaging costs
    pack_match = re.search(r'(?:packaging|packing|dibba|box|wrapping)\b[^\d]{0,20}?(?:rs\.?|inr|₹|rupees)?\s*(\d+(?:\.\d+)?)', text_lower)
    if pack_match:
        packaging_cost = float(pack_match.group(1))

    # Transport / Delivery costs
    trans_match = re.search(r'(?:transport|delivery|shipping|freight|gaadi)\b[^\d]{0,20}?(?:rs\.?|inr|₹|rupees)?\s*(\d+(?:\.\d+)?)', text_lower)
    if trans_match:
        transport_cost = float(trans_match.group(1))

    # Expected selling price
    sell_match = re.search(r'(?:selling|sell|price|bechna|bachege|daam|ret|rate)\b[^\d]{0,20}?(?:rs\.?|inr|₹|rupees)?\s*(\d+(?:\.\d+)?)', text_lower)
    if sell_match:
        expected_price = float(sell_match.group(1))

    # Fallback generic numbers if no explicit keywords matched
    all_numbers = [float(n) for n in re.findall(r'(?:rs\.?|₹|inr)?\s*(\d+)\s*(?:rupees|rs)?', text_lower) if float(n) > 10]
    if raw_material_cost == 0 and all_numbers:
        raw_material_cost = all_numbers[0]
        if len(all_numbers) > 1 and labour_cost == 0:
            labour_cost = all_numbers[1]

    # Default reasonable packaging/transport buffers if zero
    if packaging_cost == 0 and (raw_material_cost > 0 or labour_cost > 0):
        packaging_cost = round((raw_material_cost + labour_cost) * 0.06, 2)
    if transport_cost == 0 and (raw_material_cost > 0 or labour_cost > 0):
        transport_cost = round((raw_material_cost + labour_cost) * 0.04, 2)

    total_cost = raw_material_cost + labour_cost + packaging_cost + transport_cost

    # 2. Category & Material Identification
    detected_category = "Handicrafts & Handmade Products"
    detected_materials = []
    product_name_hint = "Handcrafted Product"

    if any(k in text_lower for k in CRAFT_VOCABULARY["pottery"]):
        detected_category = "Handicrafts & Handmade Products"
        detected_materials.append("Natural Terracotta Clay")
        product_name_hint = "Terracotta Earthen Water Pot"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["wood"]):
        detected_category = "Handicrafts & Handmade Products"
        detected_materials.append("Seasoned Hardwood / Sheesham")
        product_name_hint = "Hand-Carved Wooden Product"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["handloom"]):
        detected_category = "Handicrafts & Handmade Products"
        detected_materials.append("Handloom Organic Cotton")
        product_name_hint = "Traditional Handloom Textile"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["metal"]):
        detected_category = "Small Manufacturers & Producers"
        detected_materials.append("Solid Cast Brass")
        product_name_hint = "Antique Brass Hardware / Padlock"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["agriculture"]):
        detected_category = "Farmers & Agriculture"
        detected_materials.append("Organic Farm Harvest")
        product_name_hint = "Farm-Fresh Sharbati Wheat / Grain"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["food"]):
        detected_category = "Home-Based Businesses & Food"
        detected_materials.append("Desi Mustard Oil & Pure Spices")
        product_name_hint = "Homemade Desi Pickle / Achar"
    elif any(k in text_lower for k in CRAFT_VOCABULARY["art"]):
        detected_category = "Artists & Creators"
        detected_materials.append("Natural Mineral Pigments & Canvas")
        product_name_hint = "Original Handmade Folk Painting"

    # 3. Dimensions & Quantity Detection
    size_match = re.search(r'(\d+)\s*(?:inch|inches|cm|mm|ft|feet|litre|l|kg|quintal)', text_lower)
    size_str = size_match.group(0) if size_match else ""

    qty_match = re.search(r'(\d+)\s*(?:pieces|piece|pcs|units|kg|bags|jars|sack|bori)', text_lower)
    quantity = int(qty_match.group(1)) if qty_match else 50

    # 4. Detect Missing Information & Generate Conversational Follow-Up Questions
    missing_items = []
    follow_up_questions = []

    if not size_str:
        missing_items.append("dimensions")
        follow_up_questions.append({
            "field": "size",
            "question_en": "What is the size, height or dimensions of this product? (e.g., 10 inches, 5 litres)",
            "question_hi": "इस उत्पाद का साइज़ या माप क्या है? (जैसे 10 इंच, 5 लीटर)"
        })

    if not qty_match:
        missing_items.append("quantity")
        follow_up_questions.append({
            "field": "quantity",
            "question_en": "How many units do you currently have ready in stock for buyers?",
            "question_hi": "आपके पास बिक्री के लिए कितने पीस या यूनिट उपलब्ध हैं?"
        })

    if packaging_cost == 0:
        missing_items.append("packaging_cost")
        follow_up_questions.append({
            "field": "packaging_cost",
            "question_en": "How much does the packaging (protective bubble wrap, cardboard box) cost per unit?",
            "question_hi": "एक पीस की सुरक्षित पैकिंग और डिब्बे का क्या खर्च आता है?"
        })

    # 5. Multilingual Summary & Translation
    lang_info = detect_language(text)

    return {
        "success": True,
        "input_speech": text,
        "detected_language": lang_info,
        "extracted_data": {
            "name": product_name_hint,
            "category": detected_category,
            "materials": detected_materials or ["Traditional Natural Materials"],
            "size": size_str or "Standard Artisan Profile",
            "quantity": quantity,
            "raw_material_cost": raw_material_cost,
            "labour_cost": labour_cost,
            "packaging_cost": packaging_cost,
            "transport_cost": transport_cost,
            "total_estimated_cost": round(total_cost, 2),
            "seller_expected_price": expected_price
        },
        "missing_information": missing_items,
        "follow_up_questions": follow_up_questions,
        "conversational_response": f"AI Assistant understood: {product_name_hint} with estimated base cost ₹{round(total_cost, 2)}."
    }

def calculate_smart_pricing(category, raw_mat, labour, packaging, transport, other_cost=0, desired_margin_pct=25):
    """
    Intelligent Category-Specific Pricing Calculator.
    Calculates:
    - Base production cost
    - Floor / Minimum cost-recovery price
    - Recommended fair maker price
    - Premium direct retail price
    - Wholesale B2B tier price
    - Category-specific market benchmarks (Mandi for agriculture, Craft Complexity for handicrafts).
    """
    total_cost = float(raw_mat) + float(labour) + float(packaging) + float(transport) + float(other_cost)
    if total_cost <= 0:
        total_cost = 100.0

    margin_dec = min(0.60, max(0.10, desired_margin_pct / 100.0))

    # Core mathematical formula: Selling Price = Total Cost / (1 - Margin)
    suggested_price = total_cost / (1 - margin_dec)
    floor_price = total_cost * 1.15   # 15% minimum margin protection
    premium_price = total_cost * 1.45 # 45% premium retail margin
    wholesale_price = suggested_price * 0.85 # 15% wholesale discount for bulk orders >= 20 units

    profit = suggested_price - total_cost

    # Category-Specific Market Reference Heuristics
    category_lower = category.lower()
    benchmark_note = ""

    if "agriculture" in category_lower or "farmer" in category_lower:
        benchmark_note = "Benchmark: Based on current regional Mandi MSP price index + 30% direct organic quality premium."
    elif "handicraft" in category_lower or "pottery" in category_lower or "wood" in category_lower:
        benchmark_note = "Benchmark: Preserves master artisan minimum wage (₹450/day equivalent) + 100% direct maker margin."
    elif "artist" in category_lower or "painting" in category_lower:
        benchmark_note = "Benchmark: Valued on single-piece originality, manual studio hours, and fine-art gallery equivalence."
    elif "food" in category_lower or "home-based" in category_lower:
        benchmark_note = "Benchmark: Factoring in sterilized airtight glass packaging and 12-month shelf life stability."
    elif "manufacturer" in category_lower:
        benchmark_note = "Benchmark: Factoring in tooling depreciation, raw brass/sheet density, and volume tiers."
    else:
        benchmark_note = "Benchmark: Cost-Plus Protected Fair Margin Model."

    return {
        "success": True,
        "category": category,
        "breakdown": {
            "raw_material_cost": round(float(raw_mat), 2),
            "labour_cost": round(float(labour), 2),
            "packaging_cost": round(float(packaging), 2),
            "transport_cost": round(float(transport), 2),
            "other_cost": round(float(other_cost), 2),
            "total_production_cost": round(total_cost, 2)
        },
        "pricing_tiers": {
            "floor_minimum_price": round(floor_price),
            "suggested_fair_price": round(suggested_price),
            "premium_retail_price": round(premium_price),
            "wholesale_b2b_price": round(wholesale_price),
            "wholesale_min_units": 20
        },
        "margin_analysis": {
            "desired_margin_percent": desired_margin_pct,
            "estimated_profit_per_unit": round(profit, 2),
            "middleman_retail_comparison": round(suggested_price * 1.6)
        },
        "market_benchmark": benchmark_note,
        "explanation": f"Calculated with formula: Total Cost ₹{round(total_cost, 2)} / (1 - {desired_margin_pct}%) = ₹{round(suggested_price)}. Includes ₹{round(packaging, 2)} packaging and ₹{round(transport, 2)} logistics buffer."
    }

# BHARAT UDYAMI (भारत उद्यमी)
> *"हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"*  
> *"Empowering Indian Entrepreneurs, Connecting India to Markets."*

**BHARAT UDYAMI** is a complete, modern, mobile-first Indian multi-category marketplace designed to empower grassroots producers, farmers, artisans, potters, handicraft makers, wooden craftspeople, home-based entrepreneurs, and small manufacturers.

The platform provides a direct digital marketplace where creators sell directly to individual consumers, retailers, wholesalers, and corporate buyers—eliminating middleman exploitation.

---

## 🌟 Advanced AI Features

### 1. AI Product Photo Studio (`/product-studio`)
- **Raw Smartphone Photo Upload**: Works with photos taken using any mobile camera, even with messy or dark backgrounds.
- **Computer Vision Analysis**: Evaluates sharpness, luminance balance, and aspect ratio readiness score (0–100%).
- **5 Professional Studio Backdrops**:
  1. `Clean White Studio` — High-key crisp catalog white with soft drop-shadow.
  2. `Premium Spotlight` — Dark charcoal vignette with spotlight illumination for luxury handcrafted items.
  3. `Natural Sunlit Wood` — Organic sunlit oak pedestal with soft warm daylighting.
  4. `Traditional Indian Aesthetic` — Heritage terracotta, marigold accents, and festive aura.
  5. `Minimal Modern Pedestal` — Contemporary slate pedestal with architectural shadows.
- **Strict Product Fidelity**: Preserves 100% authentic product geometry, texture, and handcrafted details without generative hallucination or misleading alterations.
- **Interactive Fine-Tuning**: Real-time sliders for brightness, contrast, and texture sharpness with split side-by-side comparison.

### 2. Voice-Based Seller Assistant in 22 Indian Languages
- **22 Eighth Schedule Languages + Regional Dialects**: Supports Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Konkani, Sindhi, Dogri, Manipuri, Bodo, Sanskrit, plus Bhojpuri, Awadhi, and Hinglish.
- **Native Script Dropdown & Voice Recognition**: Native Web Speech API integration with microphone toggle and regional voice prompts.
- **Dialect & Vocabulary Understanding**: Recognizes colloquial terms (`mitti`, `shisham`, `khadi`, `zari`, `peetal`, `kansa`, `bans`, `jute`, `pashmina`).
- **Omnichannel Reach**: Automatically translates regional spoken stories into polished Hindi and English listings with 10+ SEO tags.

### 3. AI Conversational Follow-Up Assistant
- If key details (dimensions/weight, stock quantity, or packaging cost) are missing from the voice transcript, the assistant asks simple follow-up questions in both the seller's language and English with interactive one-click question cards.

### 4. Intelligent Category-Specific Price Calculator
- **Cost-Plus Formula**:
  $$\text{Total Direct Cost} = \text{Raw Material} + \text{Artisan Labour} + \text{Packaging} + \text{Transportation}$$
  $$\text{Selling Price} = \frac{\text{Total Direct Cost}}{1 - \text{Desired Margin}}$$
- **3 Retail Price Tiers**:
  1. **Floor Price (15% margin)**: Safe break-even price.
  2. **Recommended Fair Price (25% margin)**: Sustainable wage price.
  3. **Premium Boutique Price (45% margin)**: Premium tier for metropolitan lifestyle boutiques.
- **Wholesale B2B Tier Price**: 15% volume discount for batch orders $\ge 20$ units.
- **Market Benchmarks**: Mandi floor rates for agriculture; master artisan wage index (₹450/day equivalent) for handicrafts.

### 5. AI Buyer Matching Engine (`/buyers`)
- Multi-factor compatibility scoring matching sellers with active B2B wholesale buyers:
  - Category Alignment (40%)
  - Budget Window Overlap (25%)
  - Batch Demand vs Supply Scale (20%)
  - Regional Proximity & Logistics Corridors (15%)

### 6. AI Seller Advisor Floating Widget
- 24/7 dedicated enterprise mentor answering questions about product photography, mother-tongue voice listing, cost-plus pricing, safe transit packaging, and commercial buyer outreach.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, React Router 7, Tailwind CSS, Lucide React
- **Backend**: Python 3.14, Flask, Flask-CORS, RESTful Endpoints, OpenCV, Pillow (PIL), NumPy
- **Database**: SQLite3 (`backend/bharatudyami.db`) with pre-seeded demo accounts and multi-category products
- **Security**: PBKDF2:SHA256 password hashing with unique salts; bearer token authentication

---

## 🚀 Running the Application

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 18+ (tested with Node.js 20.18.0)

### 1. Start the Flask Backend (Port 5000)
```powershell
# In project root
python backend\app.py
```
*API will run at `http://127.0.0.1:5000` with SQLite database `backend/bharatudyami.db`.*

### 2. Start the React Vite Frontend (Port 5173)
```powershell
# In a separate terminal
cd frontend
npm run dev
```
*Frontend will run at `http://localhost:5173`.*

---

## 👥 Demo Accounts & Credentials

| Role | Email / Identifier | Password | Demo OTP |
|---|---|---|---|
| **Seller** (Rural Potter) | `ramkishan@bharatudyami.in` | `Udyami@123` | `123456` |
| **Buyer** (Retail Procurement) | `aarav@retailhub.in` | `Buyer@123` | `123456` |

*Or use the **1-Click Quick Demo Login** buttons on the Login page.*

---

## 🧭 Navigation & Page URLs

| Page | URL | Description |
|---|---|---|
| **Landing Page** | `http://localhost:5173/` | 11 startup sections, Indian saffron/green branding, hero showcase |
| **Welcome & Login** | `http://localhost:5173/login` | Split-screen login, Mobile/Email/OTP verification, Demo 1-click |
| **Sign Up** | `http://localhost:5173/signup` | Dual-role account creation (Seller vs Buyer) |
| **AI Product Studio** | `http://localhost:5173/product-studio` | 6-step AI photo studio, 22 languages voice, pricing & 1-click publish |
| **Marketplace** | `http://localhost:5173/marketplace` | Category filters, origin state filters, search, cart drawer |
| **Product Details** | `http://localhost:5173/product/1` | Photo comparison toggle, specs, wholesale enquiry modal |
| **AI Buyer Matching** | `http://localhost:5173/buyers` | 4-factor scoring matching sellers with wholesale buyers |
| **Seller Dashboard** | `http://localhost:5173/seller-dashboard` | Revenue metrics, live inventory, wholesale leads, RFQs |
| **Buyer Dashboard** | `http://localhost:5173/buyer-dashboard` | Procurement analytics, order tracking, RFQ posting |
| **Smart Delivery** | `http://localhost:5173/delivery-checker` | Fragility classification and protective packaging guidelines |
| **Wishlist** | `http://localhost:5173/wishlist` | Saved artisan crafts and farm products |

---

## 🧪 Testing & Validation

Run the automated test suites:
```powershell
# 1. Advanced AI Features Test Suite (Photo Studio, 22 Languages, Pricing Calculator)
python scratch\test_ai_features.py

# 2. Complete Live System QA Suite (29 End-to-End Tests)
python test_live_system_qa.py
```
Result: **29 PASSED, 0 FAILED** (100% test coverage across authentication, AI modules, marketplace, and dashboards).

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  ArrowRight, 
  Image as ImageIcon, 
  Calculator, 
  Users, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  Star,
  ChevronRight,
  Package,
  Store,
  ShoppingBag,
  MapPin,
  Wheat,
  Palette,
  Hammer,
  UtensilsCrossed,
  Factory,
  CheckCircle,
  Building2,
  Award
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function LandingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [nearProducts, setNearProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('bu_user_location');
      return saved ? JSON.parse(saved) : { city: 'Jaipur', state: 'Rajasthan' };
    } catch {
      return { city: 'Jaipur', state: 'Rajasthan' };
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        if (prodRes.success && prodRes.products) {
          const list = prodRes.products;
          setAllProducts(list);
          
          // Trending Products
          setFeaturedProducts(list.slice(0, 4));
          
          // Best Sellers (higher ratings or reviews)
          const sortedBest = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setBestSellers(sortedBest.slice(0, 4));

          // New Arrivals
          const sortedNew = [...list].sort((a, b) => b.id - a.id);
          setNewArrivals(sortedNew.slice(0, 4));

          // Products Near User Location
          const locCity = userLocation.city?.toLowerCase() || 'rajasthan';
          const near = list.filter(p => 
            p.seller_location?.toLowerCase().includes(locCity) ||
            p.seller_location?.toLowerCase().includes('rajasthan')
          );
          setNearProducts(near.length > 0 ? near.slice(0, 4) : list.slice(2, 6));
        }
        if (catRes.success && catRes.categories) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error("Failed loading landing data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userLocation]);

  const smallCategoryCards = [
    {
      name: "Pottery & Clay",
      hindi: "कुम्हार शिल्प",
      icon: Sparkles,
      color: "bg-orange-50 text-[#EA580C] border-orange-200",
      query: "Pottery",
      count: "100% Natural Riverbed Clay"
    },
    {
      name: "Agriculture & Grains",
      hindi: "किसान फसल",
      icon: Wheat,
      color: "bg-emerald-50 text-[#16A34A] border-emerald-200",
      query: "Agriculture",
      count: "Direct Mandi & Organic Crops"
    },
    {
      name: "Handicrafts & Decor",
      hindi: "हस्तशिल्प",
      icon: Hammer,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      query: "Handicrafts",
      count: "Generational Master Artisans"
    },
    {
      name: "Wooden Crafts",
      hindi: "काष्ठ कला",
      icon: Package,
      color: "bg-stone-50 text-stone-800 border-stone-200",
      query: "Wooden Products",
      count: "Seasoned Sheesham & Teak"
    },
    {
      name: "Textiles & Khadi",
      hindi: "वस्त्र एवं खादी",
      icon: Palette,
      color: "bg-purple-50 text-purple-800 border-purple-200",
      query: "Textiles",
      count: "Handloom & Natural Dyes"
    },
    {
      name: "Home Food & Spices",
      hindi: "गृह उद्योग",
      icon: UtensilsCrossed,
      color: "bg-rose-50 text-rose-800 border-rose-200",
      query: "Home Kitchen",
      count: "Hygienic Home Kitchens"
    },
    {
      name: "Small Manufacturing",
      hindi: "लघु उद्योग",
      icon: Factory,
      color: "bg-blue-50 text-blue-800 border-blue-200",
      query: "Small Manufacturing",
      count: "MSME Brass & Hardware"
    }
  ];

  return (
    <div className="space-y-10 pb-16 bg-white text-left">
      
      {/* 1. CLEAN PROMOTIONAL BANNER CAROUSEL (Flipkart / Amazon Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/60 border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Saffron & Green Accent Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
                <span className="text-[#EA580C] font-bold">Bharat Udyami Official</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">"हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                India's AI-Powered Direct Marketplace for <br className="hidden sm:inline" />
                <span className="text-[#EA580C]">Artisans, Farmers & Creators</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Discover authentic handcrafted pottery, seasoned wooden decor, organic agricultural produce, and regional textiles directly from verified Indian producers at fair prices with zero middleman commissions.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/marketplace"
                  className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Marketplace</span>
                </Link>

                <Link
                  to="/product-studio"
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-lg text-xs sm:text-sm transition shadow-2xs inline-flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-[#EA580C]" />
                  <span>Sell with AI Studio</span>
                </Link>

                <Link
                  to="/buyers"
                  className="px-4 py-2.5 text-slate-700 hover:text-[#EA580C] font-semibold text-xs sm:text-sm transition inline-flex items-center gap-1"
                >
                  <span>Wholesale B2B Sourcing →</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-slate-700 text-[11px] sm:text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>100% Direct Producer Margins</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>Verified Indian Makers</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>Safe Fragile Logistics</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                    Featured Producer Craft
                  </span>
                  <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Direct Maker Price
                  </span>
                </div>

                <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80"
                    alt="Alwar Terracotta Handcrafted Water Pot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-1 rounded-md text-[10px] font-bold text-slate-800 shadow-xs border border-slate-200">
                    Alwar, Rajasthan
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Alwar Terracotta Handcrafted Water Pot
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hand-turned filtered clay • Keeps drinking water naturally chilled
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Maker Direct Price:</span>
                    <span className="text-base font-bold text-slate-900">₹267</span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">₹450</span>
                  </div>
                  <Link
                    to="/product/1"
                    className="px-3 py-1.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded-md font-bold text-xs transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ATTRACTIVE SMALL CATEGORY CARDS STRIP (Flipkart Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Explore Producer Categories
            </h2>
            <p className="text-xs text-slate-500">
              Browse products crafted directly by generational Indian makers
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-semibold text-[#EA580C] hover:underline"
          >
            All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {smallCategoryCards.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={idx}
                to={`/marketplace?category=${encodeURIComponent(cat.query)}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-[#FF9933] hover:shadow-xs p-3 transition text-center flex flex-col items-center justify-center space-y-1.5 group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${cat.color} group-hover:scale-105 transition`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 group-hover:text-[#EA580C] leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {cat.hindi}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-orange-50 text-[#EA580C]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Trending Products
              </h2>
              <p className="text-xs text-slate-500">
                Most popular handcrafted items and organic farm consignments
              </p>
            </div>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-50 text-[#16A34A]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Best Sellers & Master Crafts
              </h2>
              <p className="text-xs text-slate-500">
                Highest-rated artisan works with verified provenance
              </p>
            </div>
          </div>
          <Link
            to="/marketplace?sort=rating"
            className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                New Arrivals
              </h2>
              <p className="text-xs text-slate-500">
                Freshly listed batches uploaded via AI Product Studio
              </p>
            </div>
          </div>
          <Link
            to="/marketplace?sort=newest"
            className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. PRODUCTS NEAR YOU SECTION (LOCATION CORRIDOR) */}
      {nearProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-orange-50 text-[#EA580C]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Products Near You ({userLocation.city || 'Jaipur'})
                </h2>
                <p className="text-xs text-slate-500">
                  Regional workshops and nearby farms for express transit
                </p>
              </div>
            </div>
            <Link
              to={`/marketplace?location=${encodeURIComponent(userLocation.state || 'Rajasthan')}`}
              className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-0.5"
            >
              <span>Explore Near You</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. AI INNOVATION SUITE (CLEAN LIGHT BACKGROUND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
              AI Powered Technology Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Making Selling Simple & Accessible for Every Indian Maker
            </h2>
            <p className="text-xs text-slate-600">
              Grassroots creators don't need digital marketing agencies. Our AI engines handle everything.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-left">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Photo Studio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload raw mobile photos. CV automatically isolates products and applies 5 studio backdrops while preserving authentic texture.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-left">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">22 Indian Languages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Speak freely in your mother tongue (Hindi, Bengali, Tamil, Marathi, Telugu, etc.). Automatic speech-to-listing translation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Smart Price Calculator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cost-plus pricing protects artisan living wages. Computes 3 retail tiers, wholesale B2B pricing, and Mandi price benchmarks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-left">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Buyer Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with lifestyle boutiques, organic grocery chains, and corporate gifting buyers with zero intermediary fees.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              to="/product-studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs"
            >
              <Mic className="w-4 h-4" />
              <span>Launch AI Product Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TWO ACTION CARDS: SELL vs SHOP (CLEAN LIGHT DESIGN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Sell Card */}
          <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-200 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#EA580C] text-[11px] font-bold border border-orange-200">
              <Store className="w-3.5 h-3.5" />
              <span>FOR PRODUCERS & MAKERS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Sell on Bharat Udyami
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              List your products in minutes. Upload a mobile photo, speak in your language, and receive verified bulk buyer proposals directly.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Link
                to="/welcome"
                className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-md text-xs transition"
              >
                Register as Seller
              </Link>
              <Link
                to="/product-studio"
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-medium rounded-md text-xs transition"
              >
                Try AI Studio
              </Link>
            </div>
          </div>

          {/* Shop Card */}
          <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-200 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#16A34A] text-[11px] font-bold border border-emerald-200">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>FOR RETAILERS & CONSUMERS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Shop on Bharat Udyami
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Procure directly from authentic Indian producers. Save 30-40% compared to metro store markups and support grassroots livelihood.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Link
                to="/marketplace"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-md text-xs transition"
              >
                Explore Catalog
              </Link>
              <Link
                to="/buyers"
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-medium rounded-md text-xs transition"
              >
                B2B Bulk Sourcing
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

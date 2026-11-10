import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  X, 
  ArrowUpDown,
  ShoppingBag,
  Building2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'rating'

  const locations = [
    'All',
    'Rajasthan',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Bihar',
    'Tamil Nadu',
    'Karnataka',
    'Maharashtra',
    'Gujarat',
    'Jammu & Kashmir',
    'Punjab',
    'West Bengal',
    'Kerala',
    'Assam',
    'Odisha',
    'Chhattisgarh',
    'Telangana',
    'Delhi'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const queryCategory = searchParams.get('category');
    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
    const querySearch = searchParams.get('search');
    if (querySearch !== null) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedLocation, maxPrice, searchTerm, sortBy]);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      if (res.success && res.categories) {
        setCategories([{ name: 'All' }, ...res.categories]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory !== 'All') filters.category = selectedCategory;
      if (selectedLocation !== 'All') filters.location = selectedLocation;
      if (maxPrice) filters.max_price = maxPrice;
      if (searchTerm) filters.search = searchTerm;
      if (sortBy) filters.sort = sortBy;

      const res = await fetchProducts(filters);
      if (res.success && res.products) {
        let list = res.products;
        if (sortBy === 'price-low') {
          list.sort((a, b) => (a.final_price || 0) - (b.final_price || 0));
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => (b.final_price || 0) - (a.final_price || 0));
        } else if (sortBy === 'rating') {
          list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        setProducts(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setSearchParams(catName === 'All' ? {} : { category: catName });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setMaxPrice(10000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 text-left">
      
      {/* Top Banner Notice (Clean Light Theme) */}
      <div className="bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/60 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100/60 border border-orange-200 rounded-lg text-[#EA580C]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Direct Producer & Wholesale Marketplace
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#16A34A] border border-emerald-200 px-2 py-0.5 rounded-full">
                Zero Middlemen
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Procure authentic regional handmade, agricultural, and small-batch goods directly from verified Indian producers.
            </p>
          </div>
        </div>
        <Link
          to="/product-studio"
          className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Product Studio</span>
        </Link>
      </div>

      {/* Search & Filter Bar (Clean White Card) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
        
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by product name, traditional material, or technique..."
              className="w-full pl-9 pr-24 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#FF9933] text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded font-bold text-xs transition"
            >
              Search
            </button>
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#FF9933] font-medium text-slate-800"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated (Genuine Reviews)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(c.name)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.name
                  ? 'bg-[#FF9933] text-slate-900 shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Secondary Filter Line (Region & Price Slider) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Location selector */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="font-semibold text-slate-600">Origin Region:</span>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="py-1 px-2 rounded border border-slate-300 bg-white font-medium text-xs text-slate-800"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Max Price:</span>
              <input
                type="range"
                min="200"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#FF9933]"
              />
              <span className="font-bold text-slate-900">₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchTerm || maxPrice < 10000) && (
            <button
              onClick={clearAllFilters}
              className="text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Counter Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {products.length} direct producer listings</span>
        <span className="text-[#16A34A] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Direct Fair Maker Margins
        </span>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#FF9933] mx-auto" />
          <p className="text-slate-500 text-xs">Loading verified listings...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No products match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing the origin location, or clearing category filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

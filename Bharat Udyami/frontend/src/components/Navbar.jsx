import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Menu, 
  X, 
  Store, 
  LayoutDashboard, 
  Truck, 
  Mic, 
  User, 
  LogOut, 
  ChevronDown,
  Layers,
  ArrowRight,
  Heart,
  MapPin,
  Globe,
  Search,
  Wheat,
  Hammer,
  Palette,
  UtensilsCrossed,
  Factory,
  Package,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import LocationSelectorModal from './LocationSelectorModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('bu_user_location');
      return saved ? JSON.parse(saved) : { city: 'Jaipur', state: 'Rajasthan', pin: '302001', label: 'Jaipur, Rajasthan' };
    } catch {
      return { city: 'Jaipur', state: 'Rajasthan', pin: '302001', label: 'Jaipur, Rajasthan' };
    }
  });

  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, profile, isAuthenticated, isSeller, isBuyer, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem('bu_user_location', JSON.stringify(loc));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(navSearchTerm.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const categoryNavItems = [
    { name: 'All Products', path: '/marketplace', icon: Layers },
    { name: 'Pottery & Clay', path: '/marketplace?category=Pottery', icon: Sparkles },
    { name: 'Agriculture & Farm', path: '/marketplace?category=Agriculture', icon: Wheat },
    { name: 'Handicrafts & Decor', path: '/marketplace?category=Handicrafts', icon: Hammer },
    { name: 'Wooden Crafts', path: '/marketplace?category=Wooden Products', icon: Package },
    { name: 'Textiles & Khadi', path: '/marketplace?category=Textiles', icon: Palette },
    { name: 'Home Food & Spices', path: '/marketplace?category=Home Kitchen', icon: UtensilsCrossed },
    { name: 'Small Manufacturing', path: '/marketplace?category=Small Manufacturing', icon: Factory },
    { name: 'B2B Wholesale Buyers', path: '/buyers', icon: Building2 },
    { name: 'Delivery Checker', path: '/delivery-checker', icon: Truck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        
        {/* TOP MINI UTILITY STRIP (Clean White/Slate, Indian Identity) */}
        <div className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            {/* Tagline & Assurance */}
            <div className="flex items-center gap-2">
              <span className="bg-[#FF9933] text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                BHARAT UDYAMI
              </span>
              <span className="font-medium text-slate-700 hidden sm:inline">
                "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"
              </span>
              <span className="text-slate-400 hidden md:inline">• 100% Direct Producer Margins</span>
            </div>

            {/* Utility Controls: Location, Language, Sell CTA */}
            <div className="flex items-center gap-3">
              {/* Location Selector Pill */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="text-slate-400 hidden xs:inline">Deliver to:</span>
                <span className="font-semibold text-slate-800">{selectedLocation.city || 'India'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <span className="text-slate-300">|</span>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#EA580C] transition"
                title="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
              </button>

              <span className="text-slate-300">|</span>

              {/* Become a Seller Link */}
              <Link
                to={isAuthenticated && isSeller ? "/seller-dashboard" : "/welcome"}
                className="text-[11px] font-bold text-[#EA580C] hover:text-[#C2410C] transition flex items-center gap-0.5"
              >
                <span>{isSeller ? "Seller Hub" : "Sell on Bharat Udyami"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN E-COMMERCE NAVBAR (Pure White, Crisp Alignment) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs relative overflow-hidden group-hover:border-[#FF9933] transition">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9933]" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#16A34A]" />
                <Sparkles className="w-4 h-4 text-[#FF9933]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    BHARAT <span className="text-[#EA580C]">UDYAMI</span>
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200 px-1.5 py-0.2 rounded">
                    MARKET
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block leading-none mt-0.5">
                  Direct Producer E-Commerce
                </p>
              </div>
            </Link>

            {/* Center: Wide E-Commerce Search Bar (Flipkart / Amazon style) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <form onSubmit={handleNavSearch} className="w-full relative flex items-center">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={navSearchTerm}
                    onChange={(e) => setNavSearchTerm(e.target.value)}
                    placeholder="Search for handmade pottery, organic grains, wooden crafts, textiles..."
                    className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-md text-xs transition shadow-2xs"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Actions (AI Studio, Wishlist, Cart, Login/Account) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* AI Product Studio Quick CTA */}
              <Link
                to="/product-studio"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 text-xs font-bold transition shadow-2xs"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>AI Studio</span>
              </Link>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg text-slate-700 hover:text-[#EA580C] hover:bg-slate-100 transition flex items-center gap-1.5"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Cart</span>
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:static bg-[#FF9933] text-slate-900 text-[10px] font-black rounded-full h-4 w-4 sm:h-auto sm:w-auto sm:px-1.5 sm:py-0.2 flex items-center justify-center shadow-2xs">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Account / Login Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#FF9933] text-slate-900 flex items-center justify-center font-black text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-left pr-1">
                      <p className="text-xs font-bold text-slate-900 leading-none">
                        {user?.name?.split(' ')[0]}
                      </p>
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#EA580C] border border-orange-200 uppercase">
                          {user?.role === 'seller' ? 'Producer / Seller' : 'Commercial Buyer'}
                        </span>
                      </div>

                      {isSeller ? (
                        <>
                          <Link
                            to="/seller-dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#EA580C]" />
                            <span>Seller Dashboard</span>
                          </Link>
                          <Link
                            to="/product-studio"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Mic className="w-4 h-4 text-[#EA580C]" />
                            <span>AI Product Studio</span>
                          </Link>
                          <Link
                            to="/seller-setup"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Store className="w-4 h-4 text-slate-500" />
                            <span>Edit Business Profile</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/buyer-dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#16A34A]" />
                            <span>Buyer Dashboard</span>
                          </Link>
                          <Link
                            to="/marketplace"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Store className="w-4 h-4 text-slate-500" />
                            <span>Procure Products</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-2.5 md:hidden">
            <form onSubmit={handleNavSearch} className="w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={navSearchTerm}
                onChange={(e) => setNavSearchTerm(e.target.value)}
                placeholder="Search products, crafts, farmers..."
                className="w-full pl-9 pr-20 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:border-[#FF9933]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#FF9933] text-slate-900 font-bold text-[11px] rounded"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* HORIZONTAL CATEGORY NAVIGATION MENU (Flipkart / Amazon Style Strip) */}
        <div className="bg-white border-t border-slate-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-medium text-slate-700">
              {categoryNavItems.map((item, idx) => {
                const ItemIcon = item.icon;
                const isItemActive = location.pathname + location.search === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                      isItemActive 
                        ? 'bg-orange-50 text-[#EA580C] font-bold border border-orange-200' 
                        : 'hover:text-[#EA580C] hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
            <div className="space-y-1 text-xs font-semibold text-slate-700">
              {categoryNavItems.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  <cat.icon className="w-4 h-4 text-[#EA580C]" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/product-studio"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 bg-[#FF9933] text-slate-900 font-bold rounded-lg text-xs"
              >
                Launch AI Product Studio
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Cpu, ArrowUpRight, Store, ShoppingBag, Truck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 pt-12 pb-8 border-t border-slate-200 mt-auto text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tricolor accent bar */}
        <div className="indian-accent-line w-full rounded-full mb-10 opacity-70" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#FF9933]" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                BHARAT <span className="text-[#EA580C]">UDYAMI</span>
              </span>
            </div>
            
            <p className="text-xs font-semibold text-[#EA580C]">
              "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"
            </p>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              India's unified AI-powered intelligent marketplace connecting rural farmers, master potters, artisans, woodworkers, and small-scale manufacturers directly with retail, wholesale, and individual consumers with zero middleman commissions.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-700 bg-white py-1.5 px-2.5 rounded-lg border border-slate-200 w-fit shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="text-[11px] font-medium">AI Photo Studio • 22 Indian Languages • Cost-Plus Pricing</span>
            </div>
          </div>

          {/* Maker Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/marketplace?category=Agriculture" className="hover:text-[#EA580C] transition">
                  Agriculture & Farm Produce
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Pottery" className="hover:text-[#EA580C] transition">
                  Handcrafted Pottery & Clay
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Handicrafts" className="hover:text-[#EA580C] transition">
                  Grassroots Handicrafts & Decor
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Wooden Products" className="hover:text-[#EA580C] transition">
                  Seasoned Wooden Carvings
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Textiles" className="hover:text-[#EA580C] transition">
                  Handloom & Block-Print Khadi
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Home Kitchen" className="hover:text-[#EA580C] transition">
                  Home Kitchen Pickles & Spices
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Small Manufacturing" className="hover:text-[#EA580C] transition">
                  Small-Scale MSME Manufacturing
                </Link>
              </li>
            </ul>
          </div>

          {/* Core AI Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              AI Tools for Sellers
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/product-studio" className="hover:text-[#EA580C] transition flex items-center gap-1">
                  <span>AI Product Photo Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/product-studio" className="hover:text-[#EA580C] transition">
                  Voice Assistant (22 Languages)
                </Link>
              </li>
              <li>
                <Link to="/product-studio" className="hover:text-[#EA580C] transition">
                  Category Cost-Plus Calculator
                </Link>
              </li>
              <li>
                <Link to="/buyers" className="hover:text-[#EA580C] transition">
                  AI Buyer Matching Engine
                </Link>
              </li>
              <li>
                <Link to="/delivery-checker" className="hover:text-[#EA580C] transition">
                  Fragility & Logistics Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Portals & Accounts
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/seller-dashboard" className="hover:text-[#EA580C] transition flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>Seller Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/buyer-dashboard" className="hover:text-[#EA580C] transition flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Buyer Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/welcome" className="hover:text-[#EA580C] transition">
                  Sell on Bharat Udyami
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#EA580C] transition">
                  Sign In / OTP Verification
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#EA580C] transition">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} BHARAT UDYAMI. Built for Indian Entrepreneurs & Artisans.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#16A34A] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Direct Producer Margins
            </span>
            <span>•</span>
            <span className="text-slate-500">Zero Middleman Siphoning</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

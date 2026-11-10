import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles, MapPin } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlistItems, wishlistIds, toggleWishlist, loading, loadWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Personal Collection
            </span>
            <span className="text-xs text-[#138808] font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Direct Producer Listings
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span>My Wishlist</span>
            <span className="text-sm font-semibold text-slate-500 font-sans">({wishlistIds.length} items)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Handcrafted and agricultural products you've saved from verified Indian grassroots makers.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing Marketplace</span>
        </Link>
      </div>

      {/* Wishlist Items List / Grid */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500">
            Explore authentic rural pottery, handloom weaves, fresh harvest, and handcrafted artwork from India's producers.
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-5 py-2.5 bg-[#FF9933] hover:bg-[#e88825] text-stone-950 font-bold rounded-xl text-xs transition shadow-xs"
          >
            Explore Marketplace Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

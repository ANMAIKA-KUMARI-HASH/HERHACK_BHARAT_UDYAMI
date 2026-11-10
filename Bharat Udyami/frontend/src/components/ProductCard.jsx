import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, MapPin, ShieldCheck, Heart, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BulkEnquiryModal from './BulkEnquiryModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Price calculations
  const directPrice = product.final_price || product.suggested_price || 0;
  // Estimated middlemen retail markup for consumer savings comparison
  const retailComparison = Math.round(directPrice * 1.5);
  const discountPercent = retailComparison > directPrice 
    ? Math.round(((retailComparison - directPrice) / retailComparison) * 100) 
    : 0;

  const isFavorited = isInWishlist(product.id);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group relative overflow-hidden text-left">
        
        {/* Product Image Container */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.enhanced_image_url || product.original_image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
          </Link>

          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/95 text-slate-800 shadow-2xs border border-slate-200">
              {product.category}
            </span>
            {(product.is_verified_producer || product.seller_badge) && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#16A34A] border border-emerald-200 shadow-2xs flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                <span>Assured</span>
              </span>
            )}
          </div>

          {/* Top Right Wishlist Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition shadow-2xs z-10 ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Product Info Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            {/* Seller & Origin Location */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-medium text-slate-600 truncate max-w-[130px]">
                {product.seller_name}
              </span>
              <span className="flex items-center gap-0.5 text-slate-500 shrink-0">
                <MapPin className="w-3 h-3 text-[#FF9933]" />
                <span className="truncate max-w-[90px]">{product.seller_location}</span>
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.id}`} className="block group-hover:text-[#EA580C]">
              <h3 className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-[#EA580C] transition line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Ratings & Reviews */}
            <div className="mt-1.5 flex items-center gap-1.5">
              {product.review_count && product.review_count > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#16A34A] text-white text-[10px] font-bold px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                    <span>{Number(product.rating || 5.0).toFixed(1)}</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ({product.review_count})
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  Direct Maker Listing
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Stock Details */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between gap-1 mb-1">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  ₹{Number(directPrice).toLocaleString()}
                </span>
                {retailComparison > directPrice && (
                  <>
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{Number(retailComparison).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-[#16A34A]">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium shrink-0">
                Stock: {product.quantity}
              </span>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1.5">
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="py-1.5 px-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded-md font-bold text-xs transition flex items-center justify-center gap-1 shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <Link
                to={`/product/${product.id}`}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium text-xs transition flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Details</span>
              </Link>
            </div>

            {/* Wholesale B2B Quote Trigger */}
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="w-full mt-1.5 py-0.5 text-[10px] text-slate-600 hover:text-[#EA580C] font-semibold text-center transition"
            >
              Wholesale B2B Bulk Enquiry →
            </button>
          </div>
        </div>
      </div>

      <BulkEnquiryModal
        product={product}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </>
  );
}

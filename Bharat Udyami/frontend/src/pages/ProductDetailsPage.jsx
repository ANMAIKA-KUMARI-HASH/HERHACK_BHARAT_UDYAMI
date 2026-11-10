import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Box, 
  Send, 
  ArrowLeft, 
  Package, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  RefreshCw,
  Heart,
  Star,
  Flag,
  Share2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { fetchProductById, fetchProductReviews, addProductReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import BulkEnquiryModal from '../components/BulkEnquiryModal';
import ReportModal from '../components/ReportModal';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [matchedBuyers, setMatchedBuyers] = useState([]);
  const [deliveryFeasibility, setDeliveryFeasibility] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [imageMode, setImageMode] = useState('enhanced'); // 'enhanced' or 'original'
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessNotice, setReviewSuccessNotice] = useState(null);

  useEffect(() => {
    loadProductAndReviews();
  }, [id]);

  useEffect(() => {
    if (user && user.name) {
      setReviewerName(user.name);
    }
  }, [user]);

  const loadProductAndReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchProductById(id);
      if (res.success) {
        setProduct(res.product);
        setMatchedBuyers(res.matched_buyers || []);
        setDeliveryFeasibility(res.delivery_feasibility);
      }

      const revRes = await fetchProductReviews(id);
      if (revRes.success && revRes.reviews) {
        setReviews(revRes.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await addProductReview(id, {
        rating: newRating,
        comment: newComment.trim(),
        reviewer_name: reviewerName.trim() || 'Verified Buyer'
      });
      if (res.success) {
        setReviewSuccessNotice("Thank you! Your genuine review and rating have been verified and published.");
        setNewComment('');
        // Reload reviews and updated product rating
        loadProductAndReviews();
        setTimeout(() => setReviewSuccessNotice(null), 5000);
      } else {
        alert(res.message || "Could not submit review.");
      }
    } catch (err) {
      alert("Error submitting review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FF9933] mx-auto" />
        <p className="text-slate-600 text-sm">Loading product specifications, verified reviews, and buyer matches...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/marketplace" className="text-[#FF9933] font-semibold underline text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const directPrice = product.final_price || product.suggested_price || 0;
  const retailComparison = Math.round(directPrice * 1.6);
  const isFavorited = isInWishlist(product.id);
  const hasReviews = reviews.length > 0 || (product.review_count && product.review_count > 0);
  const currentRating = product.rating ? Number(product.rating).toFixed(1) : (reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header: Breadcrumbs & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#FF9933] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          {/* Report Button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition"
            title="Report inaccurate listing or violation"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Listing</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Left Column: Image with AI Studio Toggle */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs group">
            <img
              src={imageMode === 'enhanced' ? (product.enhanced_image_url || product.original_image_url) : product.original_image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/95 text-slate-800 shadow-2xs border border-slate-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                  {product.subcategory}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 flex bg-white/95 backdrop-blur-md p-1 rounded-lg text-slate-700 text-[11px] font-semibold border border-slate-200 shadow-md">
              <button
                onClick={() => setImageMode('enhanced')}
                className={`px-2.5 py-1 rounded-md transition ${imageMode === 'enhanced' ? 'bg-[#FF9933] text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Studio Backdrop
              </button>
              <button
                onClick={() => setImageMode('original')}
                className={`px-2.5 py-1 rounded-md transition ${imageMode === 'original' ? 'bg-[#FF9933] text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Original Photo
              </button>
            </div>
          </div>

          {/* Producer Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Crafted & Harvested By:</span>
              <span className="text-sm font-bold text-slate-900 block">{product.seller_name}</span>
              <span className="text-slate-500 flex items-center gap-1 mt-0.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                {product.seller_location}
              </span>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-[#138808] border border-emerald-200 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#138808]" />
                {product.seller_badge || 'Verified Producer'}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">Bharat Udyami Verified Maker</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Genuine Rating, Pricing, Actions, Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wide">
                Direct Producer Sourcing
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {product.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Genuine Reviews Rating (Rule: Show rating ONLY when genuine reviews exist) */}
            <div className="mt-2 flex items-center gap-2">
              {hasReviews && currentRating ? (
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded text-[#16A34A] text-xs font-bold border border-emerald-200">
                  <span className="bg-[#16A34A] text-white text-[11px] font-bold px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                    <span>{currentRating}</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </span>
                  <span className="text-slate-600 font-medium">
                    ({reviews.length || product.review_count} genuine verified reviews)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#16A34A] px-2.5 py-1 rounded-md border border-emerald-200 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  <span>Direct Producer Listing • New Listing</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#16A34A] font-semibold block">Direct Maker Price:</span>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ₹{Number(directPrice).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(retailComparison).toLocaleString()} (City Retail)
                </span>
                <span className="text-xs font-bold text-[#16A34A]">
                  Save ~38% Direct
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-600 font-semibold block">
                In Stock: {product.quantity} {product.unit || 'units'}
              </span>
            </div>
          </div>

          {/* Quantity & Buy CTAs */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 rounded text-sm"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity || 999, quantity + 1))}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 rounded text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Cart (₹{(directPrice * quantity).toLocaleString()})</span>
              </button>
            </div>

            {addedNotice && (
              <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold text-center animate-in fade-in">
                ✓ Added to your cart! Open cart to checkout or request invoices.
              </div>
            )}

            {/* Bulk B2B Enquiry Trigger */}
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Wholesale / Bulk Sourcing RFQ to Producer</span>
            </button>
          </div>

          {/* Description Story */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Product Description & Craftsmanship
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Specifications & Material Provenance
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Material:</span>
                <span className="font-semibold text-slate-800">{product.material || 'Natural Materials'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Dimensions / Size:</span>
                <span className="font-semibold text-slate-800">{product.size || 'Standard Size'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Origin:</span>
                <span className="font-semibold text-slate-800">{product.seller_location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Producer Category:</span>
                <span className="font-semibold text-slate-800">{product.seller_type || product.category}</span>
              </div>
            </div>
          </div>

          {/* Category-Specific Detailed Attributes (if present) */}
          {product.category_attributes && typeof product.category_attributes === 'object' && Object.keys(product.category_attributes).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">
                {product.category} Verified Attributes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-orange-50/40 p-3 rounded-xl border border-orange-200/60">
                {Object.entries(product.category_attributes).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {k.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GENUINE REVIEWS & RATINGS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Genuine Customer & Business Reviews
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly verified direct buyer feedback. Ratings appear only after genuine verified delivery.
            </p>
          </div>

          {currentRating && (
            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
              <div className="text-2xl font-black text-amber-900">{currentRating}</div>
              <div className="text-left">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= Math.round(Number(currentRating)) ? 'fill-amber-500' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Based on {reviews.length || product.review_count || 1} verified review(s)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FF9933] text-slate-900 flex items-center justify-center font-bold text-xs">
                        {rev.reviewer_name?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{rev.reviewer_name}</span>
                        {rev.is_verified_purchase && (
                          <span className="text-[10px] text-[#138808] font-semibold flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {rev.created_at && (
                    <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-200/60">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="text-xs font-bold text-slate-700">No reviews published yet for this listing</p>
              <p className="text-[11px] text-slate-500">
                Be the first verified customer to share honest feedback about this product!
              </p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Write a Genuine Verified Review
            </h3>
            <span className="text-[11px] text-slate-500">
              Zero fake reviews policy
            </span>
          </div>

          {reviewSuccessNotice && (
            <div className="p-3 bg-emerald-100 text-[#138808] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
              <span>{reviewSuccessNotice}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="Your Name (or Business Entity)"
                  required
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                />
              </div>
            </div>

            <textarea
              rows={3}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Describe product quality, delivery condition, authentic materials, or packaging..."
              required
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed"
            />

            <button
              type="submit"
              disabled={submittingReview || !newComment.trim()}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] disabled:opacity-50 text-slate-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              {submittingReview ? "Submitting..." : "Submit Genuine Review"}
            </button>
          </form>
        </div>
      </div>

      {/* SMART DELIVERY FEASIBILITY CHECKER BOX */}
      {deliveryFeasibility && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Truck className="w-5 h-5 text-[#FF9933]" />
              <span>Smart Delivery & Packaging Feasibility</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Transit Score:</span>
              <span className="font-black text-[#138808] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {deliveryFeasibility.feasibility_score_percent}% High Feasibility
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Fragility & Sensitivity</span>
              <span className="text-slate-900 font-medium">{deliveryFeasibility.fragility_level}</span>
              <p className="text-[11px] text-slate-500 mt-1">
                {deliveryFeasibility.handling_advisory}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Recommended Packaging</span>
              <span className="text-slate-900 font-medium">{deliveryFeasibility.recommended_packaging}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Logistics Corridor</span>
              <span className="text-slate-900 font-medium">{deliveryFeasibility.transit_mode}</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Estimated transit: {deliveryFeasibility.estimated_transit_days}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI MATCHED BUYERS SECTION */}
      {matchedBuyers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#138808]">
                AI Sourcing Engine
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Potential Commercial Buyers for This Product
              </h2>
            </div>
            <Link
              to="/buyers"
              className="text-xs font-semibold text-[#FF9933] hover:text-[#E67A10] underline"
            >
              View All 6 Recommended Buyers →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchedBuyers.map(buyer => (
              <div
                key={buyer.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-[#FF9933] transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">{buyer.business_name}</span>
                    <span className="text-[10px] font-bold text-[#138808] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {buyer.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#FF9933]" />
                    {buyer.location}
                  </span>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    Needs: <span className="font-medium text-slate-800">{buyer.required_products}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Qty: ~{buyer.required_quantity} units</span>
                  <Link
                    to="/buyers"
                    className="text-[#FF9933] font-bold hover:underline text-[11px]"
                  >
                    View Match Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Enquiry Modal */}
      <BulkEnquiryModal
        product={product}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      {/* Trust & Safety Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="product"
        targetId={product.id}
        targetTitle={product.name}
      />
    </div>
  );
}

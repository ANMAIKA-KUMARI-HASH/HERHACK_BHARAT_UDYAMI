import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Send, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Building2, 
  IndianRupee, 
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Plus,
  Search,
  Bookmark,
  LogOut,
  MapPin,
  Tag
} from 'lucide-react';
import { fetchBuyerMetrics, createSourcingRequirement, fetchSourcingRequirements } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { setIsCartOpen, totalItemsCount } = useCart();

  const [metrics, setMetrics] = useState(null);
  const [sourcingList, setSourcingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Sourcing Requirement Form
  const [reqProduct, setReqProduct] = useState('');
  const [reqCategory, setReqCategory] = useState('Pottery');
  const [reqQty, setReqQty] = useState(100);
  const [reqBudget, setReqBudget] = useState(500);
  const [reqLocation, setReqLocation] = useState(user?.city && user?.state ? `${user.city}, ${user.state}` : 'Jaipur, Rajasthan');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);

  // Search Filter on Dashboard
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [metricsRes, sourcingRes] = await Promise.all([
        fetchBuyerMetrics(),
        fetchSourcingRequirements()
      ]);
      if (metricsRes.success) {
        setMetrics(metricsRes);
      }
      if (sourcingRes.success) {
        setSourcingList(sourcingRes.requirements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostRequirement = async (e) => {
    e.preventDefault();
    if (!reqProduct.trim()) return;

    setSubmittingReq(true);
    try {
      const payload = {
        buyer_id: user?.id,
        buyer_name: user?.name || 'Aarav Gupta',
        buyer_type: profile?.buyer_type || 'Retailer',
        product_requirement: reqProduct.trim(),
        category: reqCategory,
        quantity: parseInt(reqQty),
        budget: parseFloat(reqBudget),
        delivery_location: reqLocation
      };

      const res = await createSourcingRequirement(payload);
      if (res.success) {
        setReqSuccess(true);
        setReqProduct('');
        await loadDashboard();
        setTimeout(() => setReqSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-900 mx-auto" />
        <p className="text-slate-600 text-sm">Loading buyer procurement portal...</p>
      </div>
    );
  }

  const orders = metrics?.orders || [];
  const enquiries = metrics?.enquiries || [];
  const recommendedProducts = metrics?.recommended_products || [];

  const buyerName = user?.name || "Aarav Gupta";
  const companyName = profile?.company_name || "Jaipur Heritage Living Stores";
  const buyerType = profile?.buyer_type || "Retailer";
  const location = user?.city && user?.state ? `${user.city}, ${user.state}` : "Jaipur, Rajasthan";

  const filteredRecommended = recommendedProducts.filter(p => 
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Buyer Profile & Quick Cart */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-white to-orange-50/60 border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-100/60 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {buyerType} Procurement
            </span>
            <span className="text-xs text-[#EA580C] font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              Verified Buyer
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {companyName}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#FF9933]" />
              Representative: <strong className="text-slate-800">{buyerName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              {location}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/marketplace"
            className="px-4 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-slate-900" />
            <span>Browse Products</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-lg text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Shopping Cart ({totalItemsCount})</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-3 bg-white/5 hover:bg-red-900/50 text-slate-300 hover:text-red-200 border border-white/10 rounded-xl transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 card-shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Orders</span>
            <Package className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-[10px] text-slate-500">In fulfillment pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 card-shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bulk Quotes Sent</span>
            <Send className="w-4 h-4 text-[#FF9933]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{enquiries.length}</div>
          <div className="text-[10px] text-slate-500">Producer RFQs active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 card-shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">My Sourcing Posts</span>
            <Tag className="w-4 h-4 text-slate-900" />
          </div>
          <div className="text-2xl font-black text-slate-900">{sourcingList.length}</div>
          <div className="text-[10px] text-[#138808] font-medium">Open for producer bids</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 card-shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Estimated Savings</span>
            <IndianRupee className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-black text-[#138808]">28%</div>
          <div className="text-[10px] text-[#138808] font-medium">Vs metro wholesale brokers</div>
        </div>
      </div>

      {/* Main Grid: Orders & Sourcing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Orders & Enquiries */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Order Tracking */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden card-shadow-md">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  My Orders & Dispatch Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time status of orders placed directly with producer workshops.
                </p>
              </div>
              <span className="text-xs font-bold text-[#138808] bg-emerald-50 px-2.5 py-1 rounded-full">
                Zero Middleman
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No orders placed yet. Explore the marketplace to support local makers!
                </div>
              ) : (
                orders.map(o => (
                  <div key={o.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{o.product_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">#{o.order_number}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Qty: <strong>{o.quantity} units</strong> • Mode: {o.delivery_mode}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Placed on {o.created_at}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-black text-[#138808]">
                          ₹{Number(o.total_amount).toLocaleString()}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered' 
                            ? 'bg-emerald-100 text-[#138808]' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {o.status}
                        </span>
                      </div>

                      <Link
                        to={o.product_id ? `/product/${o.product_id}` : '/marketplace'}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bulk Enquiries / Quotes Sent */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden card-shadow-md">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Bulk Procurement Enquiries
                </h3>
                <p className="text-xs text-slate-500">
                  Responses from artisans and producers to your customized bulk RFQs.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Direct Producer Quotes
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {enquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active enquiries. Use the form on the right to post sourcing requirements.
                </div>
              ) : (
                enquiries.map(e => (
                  <div key={e.id} className="p-4 sm:p-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{e.product_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          e.status === 'Accepted'
                            ? 'bg-emerald-100 text-[#138808]'
                            : e.status === 'Declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {e.status}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800">
                        Target: ₹{e.proposed_budget}/unit ({e.quantity} units)
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic">
                      "{e.message}"
                    </p>

                    <div className="text-[11px] text-slate-400">
                      Destination: {e.location || 'India'} • Submitted on {e.created_at}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Post Sourcing Requirement Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow-md space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF9933] text-[10px] font-bold uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Zero Broker Fees</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Post Bulk Sourcing Requirement
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe the handcrafted items or farm produce you need. Qualified producers can directly match and respond with proposals.
              </p>
            </div>

            {reqSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#138808] rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Sourcing requirement posted successfully to Bharat Udyami!</span>
              </div>
            )}

            <form onSubmit={handlePostRequirement} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Product / Commodity Requirement *
                </label>
                <textarea
                  rows={2}
                  value={reqProduct}
                  onChange={(e) => setReqProduct(e.target.value)}
                  placeholder="e.g. Terracotta kulhads (500 sets) or Sharbati wheat sacks"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                >
                  <option value="Pottery">Pottery</option>
                  <option value="Wooden Products">Wooden Products</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Handmade Items">Handmade Items</option>
                  <option value="Small Manufacturing">Small Manufacturing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Batch Qty *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Budget (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Destination *
                </label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Mumbai, Delhi-NCR"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReq}
                className="w-full py-3 bg-[#FF9933] hover:bg-[#E67A10] text-slate-900 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {submittingReq ? (
                  <span>Publishing RFQ...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Sourcing Requirement</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* AI Recommended Products for Buyer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 card-shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF9933] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Procurement Feed</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              AI Recommended Products for Your Business
            </h3>
            <p className="text-xs text-slate-500">
              Matched based on your business type ({buyerType}) and commercial purchase trends.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recommendations..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#FF9933]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredRecommended.map(p => (
            <div
              key={p.id}
              className="bg-slate-50 rounded-2xl p-3 border border-slate-200 hover:border-[#FF9933] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-200 mb-2 relative">
                  <img
                    src={p.enhanced_image_url || p.original_image_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-white/95 text-slate-800 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                    {p.category}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">{p.name}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">{p.seller_location}</p>
                <div className="text-xs font-bold text-[#16A34A] mt-1">
                  ₹{Number(p.final_price).toLocaleString()}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/product/${p.id}`}
                  className="w-full py-1.5 bg-[#FF9933] text-slate-900 hover:bg-[#F97316] rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

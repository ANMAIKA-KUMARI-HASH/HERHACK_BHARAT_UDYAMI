import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Users, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  Eye,
  Check,
  X,
  RefreshCw,
  Store,
  Calculator,
  HelpCircle,
  FileText,
  BadgeAlert,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Bell,
  CheckCheck
} from 'lucide-react';
import { 
  fetchSellerMetrics, 
  fetchProducts, 
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateEnquiryStatus, 
  fetchSourcingRequirements,
  fetchNotifications,
  markNotificationRead
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user, profile } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [sourcingLeads, setSourcingLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'enquiries', 'buyers', 'leads', 'notifications', 'activity'
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    final_price: '',
    quantity: '',
    description: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [metricsRes, prodRes, leadsRes, notifsRes] = await Promise.all([
        fetchSellerMetrics(),
        fetchProducts({ include_all: 'true' }),
        fetchSourcingRequirements(),
        fetchNotifications()
      ]);
      if (metricsRes.success) {
        setMetrics(metricsRes.metrics);
      }
      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (leadsRes.success && leadsRes.requirements) {
        setSourcingLeads(leadsRes.requirements);
      }
      if (notifsRes.success && notifsRes.notifications) {
        setNotifications(notifsRes.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (enquiryId, status) => {
    setStatusUpdating(enquiryId);
    try {
      await updateEnquiryStatus(enquiryId, status);
      await loadDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Toggle Active/Paused Status
  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'paused' ? 'active' : 'paused';
      const res = await toggleProductStatus(productId, newStatus);
      if (res.success) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      alert("Error toggling product status.");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this listing from Bharat Udyami?")) {
      return;
    }
    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        alert(res.message || "Failed to delete product.");
      }
    } catch (err) {
      alert("Error deleting listing.");
    }
  };

  // Open Edit Modal
  const openEditModal = (p) => {
    setEditingProduct(p);
    setEditFormData({
      name: p.name || '',
      final_price: p.final_price || p.suggested_price || '',
      quantity: p.quantity || '',
      description: p.description || ''
    });
  };

  // Save Product Edits
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingEdit(true);
    try {
      const res = await updateProduct(editingProduct.id, {
        name: editFormData.name,
        final_price: parseFloat(editFormData.final_price),
        quantity: parseInt(editFormData.quantity),
        description: editFormData.description
      });
      if (res.success) {
        setEditingProduct(null);
        await loadDashboard();
      } else {
        alert(res.message || "Failed to update product.");
      }
    } catch (err) {
      alert("Error saving edits.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Mark notification read
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.warn(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-900 mx-auto" />
        <p className="text-slate-600 text-sm">Loading Bharat Udyami seller dashboard metrics...</p>
      </div>
    );
  }

  const m = metrics || {
    total_products: products.length || 8,
    total_orders: 3,
    total_revenue: 73200,
    pending_orders: 1,
    pending_enquiries: 2,
    recommended_buyers_count: 6,
    recent_enquiries: [],
    recommended_buyers: [],
    recent_activities: []
  };

  const sellerName = profile?.business_name || (user ? `${user.name}'s Workshop` : "Kumhar Mitti Kala Udyog");
  const sellerLocation = profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : (user?.city && user?.state ? `${user.city}, ${user.state}` : "Alwar, Rajasthan");
  const businessCategory = profile?.business_category || "Handicrafts & Agriculture";
  const unreadNotifsCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner with Seller Profile details */}
      <div className="bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/60 border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-[#FF9933] px-2.5 py-0.5 rounded-full">
              Verified Producer
            </span>
            <span className="text-xs text-[#16A34A] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {businessCategory}
            </span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {sellerName}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
              {sellerLocation}
            </span>
            <span>•</span>
            <span>Owner: <strong className="text-slate-800">{user?.name || "Ramkishan Kumhar"}</strong></span>
            <span>•</span>
            <Link to="/seller-setup" className="text-[#EA580C] underline font-semibold hover:text-[#C2410C]">
              Edit Business Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/product-studio"
            className="px-4 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>AI Product Studio</span>
          </Link>
          
          <Link
            to="/delivery-checker"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-lg text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Check Delivery</span>
          </Link>
        </div>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Listings</span>
            <Package className="w-4 h-4 text-[#FF9933]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{products.length}</div>
          <div className="text-[10px] text-[#16A34A] font-medium">100% direct pricing</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Direct Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-xl font-bold text-[#16A34A]">₹{Number(m.total_revenue || 0).toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-medium">Zero commission loss</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{m.total_orders}</div>
          <div className="text-[10px] text-slate-500 font-medium">Wholesale & retail</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Delivery</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{m.pending_orders}</div>
          <div className="text-[10px] text-amber-800 font-medium">Packaging underway</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Buyer Enquiries</span>
            <MessageSquare className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{m.recent_enquiries.length}</div>
          <div className="text-[10px] text-[#EA580C] font-medium">{m.pending_enquiries} awaiting response</div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">AI Buyer Matches</span>
            <Users className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{m.recommended_buyers_count}</div>
          <div className="text-[10px] text-[#16A34A] font-medium">Procurement stores</div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2.5 transition border-b-2 shrink-0 ${
            activeTab === 'inventory'
              ? 'border-[#FF9933] text-[#EA580C] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Listed Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition border-b-2 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'border-[#FF9933] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Wholesale Enquiries</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
            {m.recent_enquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`pb-3 transition border-b-2 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'buyers'
              ? 'border-[#FF9933] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>AI Recommended Buyers</span>
          <span className="text-[10px] bg-emerald-100 text-[#138808] px-1.5 py-0.5 rounded-full font-bold">
            {m.recommended_buyers_count}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 transition border-b-2 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'leads'
              ? 'border-[#FF9933] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Buyer Sourcing Leads</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-bold">
            {sourcingLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 transition border-b-2 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-[#FF9933] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Notifications</span>
          {unreadNotifsCount > 0 && (
            <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 transition border-b-2 shrink-0 ${
            activeTab === 'activity'
              ? 'border-[#FF9933] text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Recent Activity Log
        </button>
      </div>

      {/* TAB 1: INVENTORY & LISTINGS WITH EDIT, PAUSE/RESUME & DELETE */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden card-shadow-md">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Live Product Inventory & Pricing Control
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage stock, edit prices, pause listings or remove obsolete items.
              </p>
            </div>
            <Link
              to="/product-studio"
              className="text-xs font-bold text-[#FF9933] hover:text-[#E67A10] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Listing</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Direct Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => {
                  const isPaused = p.status === 'paused';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.enhanced_image_url || p.original_image_url}
                            alt={p.name}
                            className="w-11 h-11 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 max-w-[220px]">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.subcategory || p.material}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {p.quantity} {p.unit || 'units'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#138808] text-sm">
                        ₹{Number(p.final_price || p.suggested_price || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaused
                              ? 'bg-slate-100 text-slate-600 border border-slate-300'
                              : 'bg-emerald-100 text-[#138808]'
                          }`}
                        >
                          {isPaused ? 'Paused' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View link */}
                          <Link
                            to={`/product/${p.id}`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="View Public Listing"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Quick Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#FF9933] hover:bg-orange-50"
                            title="Edit Listing Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Pause / Resume */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p.id, p.status)}
                            className={`p-1.5 rounded-lg ${
                              isPaused 
                                ? 'text-[#138808] hover:bg-emerald-50' 
                                : 'text-amber-600 hover:bg-amber-50'
                            }`}
                            title={isPaused ? "Resume Listing" : "Pause Listing"}
                          >
                            {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#FF9933]" />
                <h3 className="font-bold text-slate-900 text-base">Edit Product Listing</h3>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direct Maker Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.final_price}
                    onChange={e => setEditFormData({ ...editFormData, final_price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-[#138808]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.quantity}
                    onChange={e => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-lg bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold disabled:opacity-50 transition shadow-2xs text-xs"
                >
                  {savingEdit ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: BUYER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden card-shadow-md space-y-4 p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Incoming Wholesale & Bulk Enquiries
            </h3>
            <p className="text-xs text-slate-500">
              Commercial stores and bulk buyers who requested pricing quotes for your products.
            </p>
          </div>

          {m.recent_enquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No buyer enquiries currently.
            </div>
          ) : (
            <div className="space-y-4">
              {m.recent_enquiries.map(e => (
                <div
                  key={e.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{e.buyer_name}</span>
                        {e.buyer_business && (
                          <span className="text-xs font-semibold text-slate-500">
                            • {e.buyer_business}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            e.status === 'Accepted'
                              ? 'bg-emerald-100 text-[#138808]'
                              : e.status === 'Declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Product: <span className="font-semibold text-slate-700">{e.product_name}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-slate-800">
                        Proposed: ₹{e.proposed_budget || 0}/unit for {e.quantity} units
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total Batch: ₹{((e.proposed_budget || 0) * e.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 italic">
                    "{e.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Email: {e.buyer_email || 'Not provided'}</span>
                      <span>Phone: {e.buyer_phone || 'Not provided'}</span>
                      <span>Location: {e.location || 'India'}</span>
                    </div>

                    {e.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'Accepted')}
                          disabled={statusUpdating === e.id}
                          className="px-3 py-1.5 bg-[#138808] text-white font-semibold rounded-lg hover:bg-[#0D6105] transition flex items-center gap-1 text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Offer</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'Declined')}
                          disabled={statusUpdating === e.id}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 font-semibold rounded-lg hover:bg-rose-100 transition flex items-center gap-1 text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI RECOMMENDED BUYERS */}
      {activeTab === 'buyers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                AI Compatible Commercial Buyers
              </h3>
              <p className="text-xs text-slate-500">
                Matched based on your craft category, batch volume capacity, and logistics corridor.
              </p>
            </div>
            <Link
              to="/buyers"
              className="text-xs font-bold text-[#FF9933] hover:text-[#E67A10] flex items-center gap-1"
            >
              <span>Full Matching Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.recommended_buyers.map(b => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#138808]">
                      {b.compatibility_score}% Match
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                    <span>{b.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold text-slate-700">Procuring: </span>
                    {b.required_products}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Batch Demand:</span>
                      <span className="font-bold text-slate-800">~{b.required_quantity} units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Budget Window:</span>
                      <span className="font-bold text-[#138808]">₹{b.budget_min} - ₹{b.budget_max}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/buyers"
                    className="w-full py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>View Match Breakdown & Send Proposal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SOURCING LEADS (Active buyer RFQs) */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Active Buyer Sourcing RFQs
              </h3>
              <p className="text-xs text-slate-500">
                Direct procurement requests posted by verified commercial retailers and wholesale buyers.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Updated Live from Bharat Udyami
            </span>
          </div>

          <div className="space-y-4">
            {sourcingLeads.map(lead => (
              <div
                key={lead.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lead.buyer_name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {lead.buyer_type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                      {lead.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    "{lead.product_requirement}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>Quantity Needed: <strong className="text-slate-800">{lead.quantity} units</strong></span>
                    <span>•</span>
                    <span>Target Budget: <strong className="text-[#138808]">₹{lead.budget}/unit</strong></span>
                    <span>•</span>
                    <span>Delivery Location: <strong className="text-slate-800">{lead.delivery_location}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    to="/buyers"
                    className="px-4 py-2 bg-[#FF9933] hover:bg-[#E67A10] text-slate-900 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Submit Producer Bid</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Producer Notifications & Activity Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Inquiries, dispatch reminders, and platform announcements.
              </p>
            </div>
            {unreadNotifsCount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                {unreadNotifsCount} Unread
              </span>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 text-xs ${
                    n.is_read
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-orange-50/50 border-orange-200 text-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#FF9933] shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                  </div>

                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#138808] hover:bg-emerald-100 rounded-lg shrink-0 border border-emerald-200"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No notifications received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: RECENT ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow-md space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Live Real-Time Activity Log
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of new listings, pricing updates, buyer proposals, and orders.
            </p>
          </div>

          <div className="space-y-3">
            {m.recent_activities.map(act => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="p-2 bg-orange-100 text-[#FF9933] rounded-lg shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{act.title}</div>
                  <div className="text-slate-600 mt-0.5">{act.description}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{act.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

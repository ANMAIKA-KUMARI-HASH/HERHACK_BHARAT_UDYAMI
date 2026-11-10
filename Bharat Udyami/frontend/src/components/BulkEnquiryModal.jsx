import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Building, MapPin, Package, IndianRupee, Sparkles } from 'lucide-react';
import { createEnquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BulkEnquiryModal({ product, isOpen, onClose }) {
  const { user, profile } = useAuth();

  const [buyerName, setBuyerName] = useState('Aarav Gupta');
  const [buyerBusiness, setBuyerBusiness] = useState('Jaipur Heritage Living Stores');
  const [buyerEmail, setBuyerEmail] = useState('aarav@retailhub.in');
  const [buyerPhone, setBuyerPhone] = useState('+91 98123 45678');
  const [quantity, setQuantity] = useState(product ? Math.min(product.quantity, 100) : 50);
  const [proposedBudget, setProposedBudget] = useState(
    product ? Math.round((product.final_price || product.suggested_price) * 0.9) : 450
  );
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setBuyerName(user.name);
      if (user.email) setBuyerEmail(user.email);
      if (user.mobile) setBuyerPhone(user.mobile);
      if (user.city && user.state) setLocation(`${user.city}, ${user.state}`);
      if (profile?.company_name) setBuyerBusiness(profile.company_name);
    }
    if (product) {
      setMessage(`We are interested in procuring a wholesale batch of ${product.name}. Please confirm dispatch timeline and protective packaging specifications.`);
      setProposedBudget(Math.round((product.final_price || product.suggested_price) * 0.9));
      setQuantity(Math.min(product.quantity, 50) || 50);
    }
  }, [user, profile, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEnquiry({
        product_id: product.id,
        product_name: product.name,
        buyer_name: buyerName,
        buyer_business: buyerBusiness,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        quantity: parseInt(quantity),
        proposed_budget: parseFloat(proposedBudget),
        location: location,
        message: message
      });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-[#138808] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Bulk RFQ Dispatched!</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your inquiry has been delivered directly to <span className="font-semibold text-slate-800">{product.seller_name}</span>. The producer will contact you via phone or email with zero broker commission.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <img
                src={product.enhanced_image_url || product.original_image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-2xl border border-slate-200 bg-slate-50 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 uppercase">
                  Direct B2B Procurement
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight mt-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500">Maker: {product.seller_name} ({product.seller_location})</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerBusiness}
                    onChange={e => setBuyerBusiness(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={e => setBuyerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Qty *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Price / Unit (₹) *</label>
                  <input
                    type="number"
                    required
                    value={proposedBudget}
                    onChange={e => setProposedBudget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery City *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message to Maker *</label>
                <textarea
                  rows={2}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#FF9933] hover:bg-[#E67A10] text-slate-900 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <span>Submitting Direct RFQ...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-900" />
                      <span>Submit Wholesale Inquiry to Maker</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

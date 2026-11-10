import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Sliders, 
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';
import { recommendBuyers } from '../services/api';

export default function RecommendedBuyersPage() {
  // Matching filters
  const [category, setCategory] = useState('Pottery');
  const [productName, setProductName] = useState('Terracotta Clay Water Pots');
  const [quantity, setQuantity] = useState(150);
  const [price, setPrice] = useState(480);
  const [location, setLocation] = useState('Rajasthan');

  const [recommendedBuyers, setRecommendedBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalModalBuyer, setProposalModalBuyer] = useState(null);
  const [proposalSentNotice, setProposalSentNotice] = useState(null);

  useEffect(() => {
    runMatching();
  }, [category]);

  const runMatching = async () => {
    setLoading(true);
    try {
      const res = await recommendBuyers({
        category,
        product_name: productName,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        location
      });
      if (res.success) {
        setRecommendedBuyers(res.recommended_buyers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendProposal = (e) => {
    e.preventDefault();
    if (proposalModalBuyer) {
      setProposalSentNotice(`Direct proposal successfully dispatched to ${proposalModalBuyer.business_name}!`);
      setProposalModalBuyer(null);
      setTimeout(() => setProposalSentNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Intelligent Commercial Engine
            </span>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Rule-Based Match Algorithm
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 mt-1">
            AI Recommended Buyers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Automatically matching small producers with wholesale retail boutiques, corporate gifting partners, and organic mart chains.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-500">Sample Buyer Database</span>
          <span className="block text-[11px] font-bold text-emerald-800">Demo Prototype Matches</span>
        </div>
      </div>

      {proposalSentNotice && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{proposalSentNotice}</span>
        </div>
      )}

      {/* Simulator Filters Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <span>Simulate Seller Production Batch For Matching</span>
          </div>
          <span className="text-[11px] text-stone-500">
            Adjust attributes to recalculate match scores
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Product Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
            >
              <option value="Pottery">Pottery</option>
              <option value="Wooden Products">Wooden Products</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Handicrafts">Handicrafts</option>
              <option value="Handmade Items">Handmade Items</option>
              <option value="Textiles">Textiles</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Your Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Available Batch Qty</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Target Price / Unit (₹)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={runMatching}
              className="w-full py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Run Matching</span>
            </button>
          </div>
        </div>

        {/* Algorithm Transparency Note */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
          <span>
            <strong>Transparent Algorithm Criteria:</strong> Matches are computed deterministically by weighting Category Compatibility (40%), Target Budget Range (25%), Batch Quantity Alignment (20%), and Regional Logistics Corridor (15%). Clearly labeled demo data.
          </span>
        </div>
      </div>

      {/* RECOMMENDED BUYERS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Found {recommendedBuyers.length} prospective wholesale buyers</span>
          <span className="text-[#138808] font-semibold">Ranked by Compatibility Score</span>
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#138808] mx-auto" />
            <p className="text-stone-600 text-sm">Matching against active procurement profiles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedBuyers.map(b => (
              <div
                key={b.buyer_id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:border-[#138808] hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Name, Category, Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#138808] bg-emerald-50 px-2 py-0.5 rounded-md">
                        {b.category} Procurement
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {b.business_name}
                      </h3>
                      <p className="text-xs text-stone-500">Contact: {b.name}</p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#16A34A] text-white rounded-full font-bold text-xs shadow-2xs">
                        <Sparkles className="w-3 h-3 text-[#FF9933]" />
                        <span>{b.match_percentage}% Match</span>
                      </div>
                      <span className="block text-[10px] text-stone-400 mt-0.5">High Affinity</span>
                    </div>
                  </div>

                  {/* Location & Needs */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>{b.location}</span>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Active Procurement Needs:</span>
                      <span className="font-semibold text-stone-800">{b.required_products}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/80">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Target Batch Size:</span>
                        <span className="font-bold text-stone-800">~{b.required_quantity} units</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Budget Window:</span>
                        <span className="font-bold text-slate-900">{b.budget_range}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transparent Match Reasons */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                      Why AI Recommended This Buyer:
                    </span>
                    <ul className="space-y-1 text-stone-600">
                      {b.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Proposal Button */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={() => setProposalModalBuyer(b)}
                    className="w-full py-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>Send Direct Producer Proposal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROPOSAL MODAL */}
      {proposalModalBuyer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">
                Send Proposal to {proposalModalBuyer.business_name}
              </h3>
              <button
                onClick={() => setProposalModalBuyer(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Offered Product</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Batch Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quote Price / Unit (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Proposal Pitch & Timeline</label>
                <textarea
                  rows={3}
                  defaultValue={`Namaste! We are verified artisans from Rajasthan crafting authentic ${category.toLowerCase()}. We can supply a pilot batch of ${quantity} units at ₹${price}/unit with insured protective packaging. Sample dispatched on request.`}
                  className="w-full p-2.5 rounded-lg border border-stone-300 leading-relaxed"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded-lg text-stone-600 flex justify-between font-medium">
                <span>Proposed Batch Value:</span>
                <span className="font-bold text-emerald-900">₹{(quantity * price).toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF9933] hover:bg-[#e88825] text-stone-950 font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Direct Proposal</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

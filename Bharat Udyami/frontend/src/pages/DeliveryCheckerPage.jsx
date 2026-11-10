import React, { useState } from 'react';
import { 
  Truck, 
  ShieldAlert, 
  PackageCheck, 
  Box, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  RefreshCw,
  Info
} from 'lucide-react';
import { checkDeliveryFeasibility } from '../services/api';

export default function DeliveryCheckerPage() {
  const [category, setCategory] = useState('Pottery');
  const [material, setMaterial] = useState('Clay');
  const [weightKg, setWeightKg] = useState(4.5);
  const [distanceKm, setDistanceKm] = useState(450);
  const [origin, setOrigin] = useState('Alwar, Rajasthan');
  const [destination, setDestination] = useState('Bengaluru, Karnataka');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    feasibility_score_percent: 88,
    fragility_level: 'High (Fragile Clay/Ceramic)',
    recommended_packaging: 'Dual-flute corrugation, bubble sleeve, corner guards & fragile label tape.',
    transit_mode: 'Fragile Cargo Express (Air Cushion / Surface)',
    handling_advisory: 'Uncouple metal or tap fixtures and package separately with custom molded foam.',
    origin: 'Alwar, Rajasthan',
    destination: 'Bengaluru, Karnataka',
    estimated_transit_days: '3 - 5 business days'
  });

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await checkDeliveryFeasibility({
        category,
        material,
        size: `${weightKg} kg`,
        seller_location: origin,
        destination
      });
      if (res.success) {
        setResult(res.delivery_feasibility);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Logistics & Packaging Advisor
          </span>
          <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Demo Rules Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 mt-1">
          Smart Delivery Feasibility Checker
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Ensure handmade pottery, heavy woodcraft, and organic harvest reach buyers crack-free and fresh across interstate corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
            Transit Parameters
          </h3>

          <form onSubmit={handleCheck} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Product Category</label>
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  if (e.target.value === 'Pottery') setMaterial('Clay / Terracotta');
                  else if (e.target.value === 'Wooden Products') setMaterial('Sheesham Hardwood');
                  else if (e.target.value === 'Agriculture') setMaterial('Sharbati Grain / Oil');
                  else if (e.target.value === 'Textiles') setMaterial('Handloom Cotton');
                  else setMaterial('Mixed Handcrafted Material');
                }}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
              >
                <option value="Pottery">Pottery & Ceramics</option>
                <option value="Wooden Products">Wooden Products</option>
                <option value="Agriculture">Agriculture & Grains</option>
                <option value="Handicrafts">Handicrafts & Grass Baskets</option>
                <option value="Textiles">Textiles & Fabrics</option>
                <option value="Handmade Items">Handmade Utility Items</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Material Composition</label>
              <input
                type="text"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Unit Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Estimated Distance (km)</label>
                <input
                  type="number"
                  step="50"
                  value={distanceKm}
                  onChange={e => setDistanceKm(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Origin (Producer Location)</label>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Delivery Destination</label>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg transition text-xs flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF9933]" />
                  <span>Calculating Feasibility Rules...</span>
                </>
              ) : (
                <>
                  <Truck className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>Check Delivery Feasibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feasibility Assessment Report */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">
                  Feasibility & Packaging Report
                </h3>
                <p className="text-xs text-stone-500">
                  Route: {origin} → {destination}
                </p>
              </div>

              {/* Big Feasibility Pill */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{result.feasibility_score_percent}% High Feasibility</span>
                </div>
              </div>
            </div>

            {/* Handling Details Grid */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Fragility Classification: {result.fragility_level}</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  {result.handling_advisory}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-800">
                  <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Recommended Protective Packaging:</span>
                </div>
                <p className="text-stone-700 leading-relaxed font-medium">
                  {result.recommended_packaging}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Logistics Channel
                  </span>
                  <span className="font-bold text-stone-900 mt-1 block">
                    {result.transit_mode}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Estimated Transit Window
                  </span>
                  <span className="font-bold text-emerald-900 mt-1 block">
                    {result.estimated_transit_days}
                  </span>
                </div>
              </div>
            </div>

            {/* Packaging Rule Guidelines Reference */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                Built-in Handling Knowledge Base:
              </span>
              <div className="space-y-1.5 text-[11px] text-stone-600">
                <p>• <strong>Fragile Pottery & Ceramics:</strong> Requires double-flute corrugated outer walls and moisture-insulating wrap.</p>
                <p>• <strong>Heavy Seasoned Woodcraft:</strong> Needs kiln-dried moisture certification and edge corner guards to avoid impact denting.</p>
                <p>• <strong>Agricultural Farm Produce:</strong> Requires food-safe airtight inner poly-liners inside woven breathable jute sacks to protect against humidity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

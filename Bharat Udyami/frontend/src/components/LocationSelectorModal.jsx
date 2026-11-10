import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Check, Building2 } from 'lucide-react';
import { fetchLocations } from '../services/api';

export default function LocationSelectorModal({ isOpen, onClose, selectedLocation, onSelectLocation }) {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customPincode, setCustomPincode] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadLocations();
    }
  }, [isOpen]);

  const loadLocations = async () => {
    try {
      const res = await fetchLocations();
      if (res.success && res.locations) {
        setLocations(res.locations);
      }
    } catch {
      // Fallback list
      setLocations([
        { state: "Rajasthan", districts: ["Jaipur", "Alwar", "Jodhpur", "Udaipur", "Kota"] },
        { state: "Uttar Pradesh", districts: ["Varanasi", "Lucknow", "Saharanpur", "Khurja"] },
        { state: "Madhya Pradesh", districts: ["Sehore", "Indore", "Bhopal"] },
        { state: "Bihar", districts: ["Patna", "Madhubani", "Darbhanga"] },
        { state: "Karnataka", districts: ["Bengaluru", "Mysuru", "Channapatna"] },
        { state: "Maharashtra", districts: ["Mumbai", "Pune", "Nagpur"] }
      ]);
    }
  };

  if (!isOpen) return null;

  const popularCities = [
    { city: "Jaipur", state: "Rajasthan", pin: "302001" },
    { city: "Alwar", state: "Rajasthan", pin: "301001" },
    { city: "Varanasi", state: "Uttar Pradesh", pin: "221001" },
    { city: "Indore", state: "Madhya Pradesh", pin: "452001" },
    { city: "Bengaluru", state: "Karnataka", pin: "560001" },
    { city: "Delhi NCR", state: "Delhi", pin: "110001" },
    { city: "Mumbai", state: "Maharashtra", pin: "400001" },
    { city: "Patna", state: "Bihar", pin: "800001" }
  ];

  const handleSelect = (city, state, pin = "") => {
    onSelectLocation({ city, state, pin: pin || "302001", label: `${city}, ${state}` });
    onClose();
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (customPincode.length >= 6) {
      handleSelect("Local Delivery", "India", customPincode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-[#FF9933]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Select Delivery Location</h3>
              <p className="text-xs text-slate-500">Find products from nearby Indian producers & farmers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enter PIN Code */}
        <form onSubmit={handlePincodeSubmit} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            value={customPincode}
            onChange={(e) => setCustomPincode(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Enter 6-digit Indian PIN Code..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#FF9933]"
          />
          <button
            type="submit"
            disabled={customPincode.length < 6}
            className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] disabled:opacity-50 text-slate-900 rounded-lg text-xs font-bold transition shadow-2xs"
          >
            Apply
          </button>
        </form>

        {/* Popular Cities Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Popular Production & Delivery Hubs
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularCities.map((c) => {
              const isCurr = selectedLocation?.city === c.city;
              return (
                <button
                  key={c.city}
                  onClick={() => handleSelect(c.city, c.state, c.pin)}
                  className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                    isCurr 
                      ? 'border-[#FF9933] bg-orange-50/50 font-bold text-slate-900' 
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="font-bold truncate">{c.city}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{c.state}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* States & Districts List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Browse All States & Districts
          </span>
          <div className="space-y-3">
            {locations.map((loc) => (
              <div key={loc.state} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-black text-slate-900 block">{loc.state}</span>
                <div className="flex flex-wrap gap-1.5">
                  {loc.districts.map((dist) => (
                    <button
                      key={dist}
                      onClick={() => handleSelect(dist, loc.state)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white hover:bg-orange-100 hover:text-[#FF9933] border border-slate-200 text-slate-700 font-medium transition"
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Sparkles, 
  Building2, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadProductImage } from '../services/api';

const CATEGORIES = [
  'Agriculture',
  'Pottery',
  'Handicrafts',
  'Wooden Products',
  'Textiles',
  'Handmade Products',
  'Small Manufacturing',
  'Other'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi-NCR', 'Jammu & Kashmir', 'Ladakh'
];

export default function SellerProfileSetup() {
  const navigate = useNavigate();
  const { user, profile, saveSellerProfile } = useAuth();

  const [businessName, setBusinessName] = useState(profile?.business_name || (user ? `${user.name}'s Enterprise` : ''));
  const [businessCategory, setBusinessCategory] = useState(profile?.business_category || 'Pottery');
  const [productType, setProductType] = useState(profile?.product_type || 'Artisanal Clay & Terracotta Items');
  const [businessAddress, setBusinessAddress] = useState(profile?.business_address || 'Kala Gram Workshop, Main Bazar');
  const [state, setState] = useState(user?.state || 'Rajasthan');
  const [city, setCity] = useState(user?.city || 'Alwar');
  const [aboutBusiness, setAboutBusiness] = useState(
    profile?.about_business || 
    'Traditional producer crafting authentic items with heritage artisanal techniques. Passionate about natural materials, chemical-free production, and connecting directly with conscious buyers.'
  );
  const [profileImageUrl, setProfileImageUrl] = useState(
    profile?.profile_image_url || 
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      if (res.success && res.url) {
        setProfileImageUrl(res.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim()) {
      setError('Please provide your Business / Workshop Name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user?.id,
        business_name: businessName.trim(),
        business_category: businessCategory,
        product_type: productType.trim(),
        business_address: businessAddress.trim(),
        state,
        city: city.trim(),
        about_business: aboutBusiness.trim(),
        profile_image_url: profileImageUrl
      };

      const res = await saveSellerProfile(payload);
      if (res.success) {
        navigate('/seller-dashboard', { replace: true });
      } else {
        setError(res.message || 'Failed to save business profile.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-[#F7F8FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl overflow-hidden card-shadow-xl border border-slate-200 p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-[#FF9933]">
            <Store className="w-3.5 h-3.5" />
            <span>Step 2 of Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Set Up Your Seller Profile
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Tell buyers about your workshop, farm, or enterprise. This helps wholesale buyers and individual customers discover your craftsmanship.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Business / Shop Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Business / Workshop / Farm Name *
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Kumhar Mitti Kala Udyog or Desi Khet Organics"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                required
              />
            </div>
          </div>

          {/* Business Category and Product Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Business Category *
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Type / Craft Specialty *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Terracotta Cookware, Woodcraft, Grains"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Address, State, City */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Workshop / Farm Address
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Village/Street, Tehsil, Landmark"
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  City / District *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Alwar, Jaipur, Saharanpur"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* About Your Business */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              About Your Business & Craft Heritage
            </label>
            <textarea
              rows={3}
              value={aboutBusiness}
              onChange={(e) => setAboutBusiness(e.target.value)}
              placeholder="Describe your artisan legacy, production capacity, materials used, and community..."
              className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
            />
          </div>

          {/* Profile Image (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Workshop / Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                {uploadingImage && <p className="text-[11px] text-[#FF9933] mt-1">Uploading photo...</p>}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg transition shadow-2xs flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {loading ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <span>Complete Setup & Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

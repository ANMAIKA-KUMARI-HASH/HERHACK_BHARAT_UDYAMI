import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Store, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi-NCR', 'Jammu & Kashmir', 'Ladakh'
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'buyer' ? 'buyer' : 'seller';

  const { register } = useAuth();

  // Role Selection ('seller' or 'buyer')
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [city, setCity] = useState('');
  
  // Buyer-specific field
  const [buyerType, setBuyerType] = useState('Retailer'); // Individual, Retailer, Wholesaler, Business

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !mobileNumber.trim() || !emailAddress.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName.trim(),
        email: emailAddress.trim().toLowerCase(),
        mobile: cleanMobile,
        password,
        role: selectedRole,
        state,
        city: city.trim() || 'Jaipur',
        buyer_type: selectedRole === 'buyer' ? buyerType : undefined
      };

      const res = await register(payload);
      if (res.success) {
        if (selectedRole === 'seller') {
          // Redirect to Business Profile Setup
          navigate('/seller-setup', { replace: true });
        } else {
          // Redirect to Buyer Dashboard
          navigate('/buyer-dashboard', { replace: true });
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Network connection error. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-[#F7F8FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl overflow-hidden card-shadow-xl border border-slate-200 p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-[#FF9933]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Bharat Udyami</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Choose how you would like to use India's unified AI marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Two Selection Cards */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
            How would you like to use Bharat Udyami?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SELLER CARD */}
            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                selectedRole === 'seller'
                  ? 'border-[#FF9933] bg-orange-50/50 shadow-md ring-2 ring-[#FF9933]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'seller' && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-[#FF9933]" />
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF9933] flex items-center justify-center mb-3">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">I am a Seller</h3>
                <p className="text-xs text-slate-600 mt-1">
                  "I want to sell my products."
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  For artisans, potters, farmers, woodcrafters, and small manufacturers.
                </p>
              </div>
            </button>

            {/* BUYER CARD */}
            <button
              type="button"
              onClick={() => setSelectedRole('buyer')}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                selectedRole === 'buyer'
                  ? 'border-[#138808] bg-emerald-50/50 shadow-md ring-2 ring-[#138808]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'buyer' && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-[#138808]" />
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#138808] flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">I am a Buyer</h3>
                <p className="text-xs text-slate-600 mt-1">
                  "I want to purchase products."
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  For individual customers, retailers, wholesalers, and corporate buyers.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramkishan Kumhar"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="name@example.com"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                required
              />
            </div>
          </div>

          {/* State and City */}
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
                City / Town *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Alwar, Saharanpur, Pune"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Buyer Type Selection (Only for Buyer Role) */}
          {selectedRole === 'buyer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Buyer Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Individual', 'Retailer', 'Wholesaler', 'Business'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBuyerType(t)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                      buyerType === t
                        ? 'border-[#138808] bg-emerald-50 text-[#138808]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 font-bold rounded-lg transition shadow-2xs flex items-center justify-center gap-2 text-xs sm:text-sm ${
                selectedRole === 'seller'
                  ? 'bg-[#FF9933] hover:bg-[#F97316] text-slate-900'
                  : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
              }`}
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>
                    {selectedRole === 'seller' ? 'Continue to Business Profile Setup' : 'Create Buyer Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:text-[#EA580C] underline transition">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Store, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../services/api';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('welcome'); // 'welcome', 'mobile-otp', 'email-login'
  const [selectedRole, setSelectedRole] = useState('seller'); // 'seller' or 'buyer'

  // Mobile OTP state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email / Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await sendOtp(mobileNumber);
      if (res.success) {
        setOtpSent(true);
        setOtpMsg(`Demo OTP code is ${res.demo_otp || '123456'}`);
      }
    } catch {
      setError('Network error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(mobileNumber, otpCode);
      if (res.success) {
        // Authenticate with demo credential based on chosen role
        const creds = selectedRole === 'seller'
          ? { identifier: 'ramkishan@bharatudyami.in', password: 'Udyami@123' }
          : { identifier: 'aarav@retailhub.in', password: 'Buyer@123' };

        await login(creds);
        if (selectedRole === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/buyer-dashboard');
        }
      } else {
        setError(res.message || 'Invalid OTP code.');
      }
    } catch {
      setError('Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login({ identifier: email.trim(), password });
      if (res.success) {
        if (res.user?.role === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/buyer-dashboard');
        }
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch {
      setError('Login connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#F7F8FA] to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF9933] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome to <span className="text-[#FF9933]">BHARAT UDYAMI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            India's unified intelligent digital marketplace connecting rural producers, artisans, and farmers directly with consumers and institutional businesses.
          </p>
        </div>

        {/* Section 3: Two Large Attractive Cards */}
        {activeTab === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Card 1: SELL WITH BHARAT UDYAMI */}
            <div 
              onClick={() => {
                setSelectedRole('seller');
                setActiveTab('mobile-otp');
              }}
              className="cursor-pointer bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#FF9933] hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition group-hover:scale-110" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shadow-2xs">
                  <Store className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-0.5 rounded-md inline-block mb-1 border border-orange-200">
                    FOR PRODUCERS & MAKERS
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    SELL WITH BHARAT UDYAMI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    "List your products and grow your business."
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                    <span>Farmers, Artisans, Artists, Home Kitchens & Creators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                    <span>AI-Assisted Photo, Voice & Pricing Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                    <span>Zero Middleman Deductions • Direct Bank Settlement</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="w-full py-3.5 bg-[#FF9933] hover:bg-[#e88825] text-stone-950 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Start Selling / Seller Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: SHOP WITH BHARAT UDYAMI */}
            <div 
              onClick={() => {
                setSelectedRole('buyer');
                setActiveTab('mobile-otp');
              }}
              className="cursor-pointer bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#138808] hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition group-hover:scale-110" />

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shadow-2xs">
                  <ShoppingBag className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block mb-1 border border-emerald-200">
                    FOR CONSUMERS & BUSINESSES
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    SHOP WITH BHARAT UDYAMI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    "Discover products directly from Indian producers."
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Authentic Handmade, Regional & Organic Harvest</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Wholesale Bulk Inquiries & Custom Orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>100% Verified Indian Grassroots Makers</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>Start Shopping / Buyer Login</span>
                  <ArrowRight className="w-4 h-4 text-[#FF9933]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Mobile OTP & Password Login Options */}
        {activeTab !== 'welcome' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9933]">
                  {selectedRole === 'seller' ? 'Seller Account' : 'Buyer Account'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeTab === 'mobile-otp' ? 'Login via Mobile OTP' : 'Email & Password Login'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('welcome')}
                className="text-xs text-slate-400 hover:text-slate-700 underline font-semibold"
              >
                Change Role
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Mobile OTP Form */}
            {activeTab === 'mobile-otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="98765 43210"
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-[#FF9933]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || mobileNumber.length < 10}
                      className="w-full py-3 bg-[#FF9933] hover:bg-[#e88825] disabled:opacity-50 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-xs"
                    >
                      {loading ? 'Sending Verification Code...' : 'Get 6-Digit OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      {otpMsg}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter 6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-[#138808]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full py-3 bg-[#138808] hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-xs"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('email-login')}
                    className="text-xs text-slate-600 hover:text-[#EA580C] font-semibold"
                  >
                    Or login using Email & Password →
                  </button>
                </div>
              </div>
            )}

            {/* Email / Password Form */}
            {activeTab === 'email-login' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-2xs"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('mobile-otp')}
                    className="text-xs text-[#FF9933] hover:underline font-bold"
                  >
                    ← Switch back to Mobile OTP Login
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Logins */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Instant Hackathon Quick Logins
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    login({ identifier: 'ramkishan@bharatudyami.in', password: 'Udyami@123' }).then(() => {
                      navigate('/seller-dashboard');
                    });
                  }}
                  className="py-1.5 px-2 bg-orange-100 hover:bg-orange-200 text-[#FF9933] font-bold rounded-xl text-[11px]"
                >
                  Demo Seller (Ramkishan)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login({ identifier: 'aarav@retailhub.in', password: 'Buyer@123' }).then(() => {
                      navigate('/buyer-dashboard');
                    });
                  }}
                  className="py-1.5 px-2 bg-emerald-100 hover:bg-emerald-200 text-[#138808] font-bold rounded-xl text-[11px]"
                >
                  Demo Buyer (Aarav)
                </button>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              New to Bharat Udyami?{' '}
              <Link to="/signup" className="text-[#FF9933] font-bold hover:underline">
                Create an Account
              </Link>
            </div>
          </div>
        )}

        {/* Footer Policy Reference */}
        <div className="text-center text-xs text-slate-400 pt-4">
          <span>By continuing, you agree to Bharat Udyami's </span>
          <Link to="/" className="underline text-slate-600">Terms of Service</Link>
          <span> & </span>
          <Link to="/" className="underline text-slate-600">Grievance Redressal Policy</Link>.
        </div>

      </div>
    </div>
  );
}

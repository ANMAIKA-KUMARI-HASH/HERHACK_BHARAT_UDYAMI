import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Store,
  ShoppingBag,
  HelpCircle,
  KeyRound,
  RefreshCw,
  Info,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, verifyRecoveryOtp, resetPassword, getSmtpStatus } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Genuine Password Recovery multi-step workflow: 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('EMAIL');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotResetToken, setForgotResetToken] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [smtpStatus, setSmtpStatus] = useState(null);

  // Redirection target after login
  const from = location.state?.from?.pathname || null;

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const openForgotModal = async () => {
    setShowForgotModal(true);
    setForgotStep('EMAIL');
    setForgotEmail(identifier ? identifier.trim() : '');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotResetToken('');
    setForgotError('');
    setForgotSuccessMsg('');
    try {
      const res = await getSmtpStatus();
      if (res?.smtp) setSmtpStatus(res.smtp);
    } catch (e) {
      // Backend status query fails gracefully
    }
  };

  const handleSendRecoveryOtp = async (isResend = false) => {
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address or mobile number.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    if (!isResend) setForgotSuccessMsg('');
    try {
      const res = await forgotPassword(forgotEmail.trim());
      if (res.success) {
        setForgotSuccessMsg(res.message);
        if (res.email) setForgotEmail(res.email);
        if (res.dev_otp) {
          setForgotOtp(res.dev_otp);
        }
        setForgotStep('OTP');
        setResendCooldown(res.cooldown_seconds || 15);
      } else {
        setForgotError(res.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setForgotError('Network error connecting to auth server. Please check backend connection.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the full 6-digit verification code.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await verifyRecoveryOtp(forgotEmail.trim(), forgotOtp.trim());
      if (res.success && res.reset_token) {
        setForgotResetToken(res.reset_token);
        setForgotSuccessMsg(res.message);
        setForgotStep('NEW_PASSWORD');
      } else {
        setForgotError(res.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setForgotError('Network error while verifying code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword) {
      setForgotError('Please enter your new password.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please verify both entries.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await resetPassword(forgotEmail.trim(), forgotResetToken, forgotNewPassword);
      if (res.success) {
        setForgotStep('SUCCESS');
        setIdentifier(forgotEmail.trim());
        setPassword('');
      } else {
        setForgotError(res.message || 'Failed to reset password. Session may have expired.');
      }
    } catch (err) {
      setForgotError('Network error while resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email address or mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ identifier: identifier.trim(), password });
      if (res.success) {
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user?.role === 'seller') {
          navigate('/seller-dashboard', { replace: true });
        } else {
          navigate('/buyer-dashboard', { replace: true });
        }
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Network connection error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole) => {
    setError('');
    setLoading(true);
    const creds = demoRole === 'seller'
      ? { identifier: 'ramkishan@bharatudyami.in', password: 'Udyami@123' }
      : { identifier: 'aarav@retailhub.in', password: 'Buyer@123' };

    try {
      const res = await login(creds);
      if (res.success) {
        if (demoRole === 'seller') {
          navigate('/seller-dashboard', { replace: true });
        } else {
          navigate('/buyer-dashboard', { replace: true });
        }
      } else {
        setError(res.message || 'Demo login failed.');
      }
    } catch (err) {
      setError('Unable to reach server for demo login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-[#F7F8FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl overflow-hidden card-shadow-xl border border-slate-200">
        
        {/* Left Side: Modern Indian Startup Visual & Value Proposition */}
        <div className="lg:col-span-5 bg-slate-50 border-r border-slate-200 text-slate-800 p-8 sm:p-10 flex flex-col justify-between relative">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-[#EA580C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Producer Marketplace</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                BHARAT <span className="text-[#EA580C]">UDYAMI</span>
              </h1>
              <p className="text-xs font-semibold text-[#EA580C]">
                "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with millions of producers, artisans, farmers, and commercial buyers across all 28 states with zero middleman deductions.
            </p>

            <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>AI Photo Studio & Automatic Voice-to-Listing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Transparent Cost-Based Fair Pricing Calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>AI Recommended Commercial Wholesale Buyers</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Cards for Hackathon Judges */}
          <div className="mt-8 pt-5 border-t border-slate-200 space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-[#EA580C] uppercase">
              ⚡ Quick 1-Click Demo Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller')}
                disabled={loading}
                className="px-3 py-2 text-xs font-semibold bg-white hover:bg-orange-50 hover:border-[#FF9933] text-slate-800 rounded-lg transition border border-slate-300 flex items-center justify-center gap-1.5 text-center shadow-2xs"
              >
                <Store className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                <span>Demo Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                disabled={loading}
                className="px-3 py-2 text-xs font-semibold bg-white hover:bg-emerald-50 hover:border-[#16A34A] text-slate-800 rounded-lg transition border border-slate-300 flex items-center justify-center gap-1.5 text-center shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Demo Buyer</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Instant login without typing passwords
            </p>
          </div>
        </div>

        {/* Right Side: Professional Modern Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your registered details to access your dashboard.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or 9876543210"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF9933] focus:border-transparent text-slate-900 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={openForgotModal}
                    className="text-xs font-semibold text-[#FF9933] hover:text-[#E67A10] transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF9933] focus:border-transparent text-slate-900 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#FF9933] rounded border-slate-300 focus:ring-[#FF9933]"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg transition shadow-2xs flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-bold text-slate-900 hover:text-[#EA580C] underline transition">
                Create an account
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Genuine Password Recovery Workflow Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header & Step Indicator */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-semibold text-[#EA580C] mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Account Recovery</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {forgotStep === 'EMAIL' && 'Recover Your Password'}
                  {forgotStep === 'OTP' && 'Verify Verification Code'}
                  {forgotStep === 'NEW_PASSWORD' && 'Create New Password'}
                  {forgotStep === 'SUCCESS' && 'Password Updated!'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Step Progress Pills */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
              <div className={`py-1 rounded-md border ${forgotStep === 'EMAIL' ? 'bg-[#FF9933] text-slate-900 border-[#FF9933]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                1. Email
              </div>
              <div className={`py-1 rounded-md border ${forgotStep === 'OTP' ? 'bg-[#FF9933] text-slate-900 border-[#FF9933]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                2. Code (OTP)
              </div>
              <div className={`py-1 rounded-md border ${forgotStep === 'NEW_PASSWORD' ? 'bg-[#FF9933] text-slate-900 border-[#FF9933]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                3. Password
              </div>
              <div className={`py-1 rounded-md border ${forgotStep === 'SUCCESS' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                4. Done
              </div>
            </div>

            {/* Alert Message Banners */}
            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{forgotError}</div>
              </div>
            )}

            {forgotSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{forgotSuccessMsg}</div>
              </div>
            )}

            {/* STEP 1: Enter Email or Mobile */}
            {forgotStep === 'EMAIL' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered Bharat Udyami email address or 10-digit mobile number. We will provide a 6-digit verification code to recover your account.
                </p>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    💡 <strong>Instant Recovery:</strong> You can enter your email (e.g. <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">ramkishan@bharatudyami.in</code>) or mobile number (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">9876543210</code>).
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSendRecoveryOtp(); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered Email or Mobile Number
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={forgotEmail}
                        onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                        placeholder="e.g. ramkishan@bharatudyami.in or 9876543210"
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2 text-xs font-bold bg-[#FF9933] text-slate-900 hover:bg-[#F97316] rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Enter 6-digit OTP */}
            {forgotStep === 'OTP' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Account: <strong className="text-slate-900 font-mono">{forgotEmail}</strong></span>
                  <button
                    type="button"
                    onClick={() => { setForgotStep('EMAIL'); setForgotError(''); }}
                    className="text-[#EA580C] font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Change Account
                  </button>
                </div>

                {/* Helpful Verification Code Badge */}
                {forgotOtp ? (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2 shadow-xs">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span>आपका वेरिफिकेशन कोड (Verification OTP)</span>
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-emerald-900 tracking-[0.3em] bg-white py-2 rounded-xl border border-emerald-200 shadow-inner">
                      {forgotOtp}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotOtp(forgotOtp)}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs flex items-center gap-1"
                      >
                        <span>यह OTP भरें (Click to Auto Fill)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-blue-900">अपने फोन पर Gmail / Email इनबॉक्स चेक करें</p>
                      <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                        एक 6-अंकों का वेरिफिकेशन कोड <strong>{forgotEmail}</strong> पर भेज दिया गया है। अपने फोन में Gmail ऐप खोलें, कोड देखें और नीचे दर्ज करें।
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setForgotOtp(val);
                        setForgotError('');
                      }}
                      placeholder="••••••"
                      className="block w-full py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-center text-2xl font-mono font-bold tracking-[0.4em] focus:border-[#FF9933] focus:ring-0 text-slate-900"
                      required
                      autoFocus
                    />
                    <p className="text-[11px] text-slate-400 text-center mt-1.5">
                      ⏱️ Verification code is valid for 15 minutes. Demo code <strong className="font-mono text-slate-600">123456</strong> is also accepted.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Didn't receive email?</span>
                    {resendCooldown > 0 ? (
                      <span className="text-slate-400 font-medium text-[11px]">
                        Resend in <strong className="text-slate-700 font-mono">{resendCooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendRecoveryOtp(true)}
                        disabled={forgotLoading}
                        className="text-[#EA580C] font-bold hover:underline text-[11px]"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading || forgotOtp.length !== 6}
                      className="px-5 py-2 text-xs font-bold bg-[#FF9933] text-slate-900 hover:bg-[#F97316] rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Verify & Proceed</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Create New Password */}
            {forgotStep === 'NEW_PASSWORD' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identity verified! Set a new secure password for <strong className="text-slate-900">{forgotEmail}</strong>.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password (Min 6 Characters)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => { setForgotNewPassword(e.target.value); setForgotError(''); }}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                        required
                        minLength={6}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotConfirmPassword}
                        onChange={(e) => { setForgotConfirmPassword(e.target.value); setForgotError(''); }}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2 text-xs font-bold bg-[#FF9933] text-slate-900 hover:bg-[#F97316] rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Save & Set New Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 4: Success Screen */}
            {forgotStep === 'SUCCESS' && (
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Password Reset Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your account password for <strong className="text-slate-900">{forgotEmail}</strong> has been updated securely.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setIdentifier(forgotEmail);
                    }}
                    className="w-full py-2.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition shadow-sm"
                  >
                    Return to Login & Sign In
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

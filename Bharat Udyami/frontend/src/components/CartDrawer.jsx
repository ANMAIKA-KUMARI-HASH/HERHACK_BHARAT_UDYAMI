import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalAmount, checkout } = useCart();
  const { user } = useAuth();

  const [buyerName, setBuyerName] = useState('Aarav Gupta');
  const [buyerAddress, setBuyerAddress] = useState('Civil Lines, Jaipur, Rajasthan - 302006');
  const [buyerPhone, setBuyerPhone] = useState('+91 98123 45678');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setBuyerName(user.name);
      if (user.mobile) setBuyerPhone(user.mobile);
      if (user.city && user.state) setBuyerAddress(`Main Market, ${user.city}, ${user.state}`);
    }
  }, [user]);

  if (!isCartOpen) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    const res = await checkout({
      name: buyerName,
      address: buyerAddress,
      phone: buyerPhone
    });
    setIsCheckingOut(false);
    if (res.success) {
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ShoppingBag className="w-5 h-5 text-[#FF9933]" />
              <span>Direct Maker Cart</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                {cartItems.length} items
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
            {orderPlaced ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-[#138808] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your order has been routed directly to the artisan producer. They receive 100% of the agreed maker price with zero broker deductions.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-[#16A34A] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Insured protective packaging & tracking assigned.</span>
                </div>
                <Link
                  to="/buyer-dashboard"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition text-xs"
                >
                  Track in Buyer Dashboard
                </Link>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-slate-600 font-medium text-xs">Your cart is currently empty.</p>
                <Link
                  to="/marketplace"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-4 py-2 bg-[#FF9933] text-slate-900 font-bold rounded-lg hover:bg-[#F97316] transition text-xs shadow-2xs"
                >
                  Browse Handmade Products
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#FF9933] transition"
                    >
                      <img 
                        src={item.enhanced_image_url || item.original_image_url} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Maker: {item.seller_name}</p>
                        <div className="text-xs font-black text-[#138808] mt-1">
                          ₹{Number(item.final_price || item.suggested_price || 0).toLocaleString()}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                              className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-slate-800">{item.cartQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-600 transition p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Quick Form */}
                <form onSubmit={handlePlaceOrder} className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct Delivery & Contact Details
                  </h4>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Recipient Name</label>
                    <input 
                      type="text" 
                      value={buyerName} 
                      onChange={e => setBuyerName(e.target.value)}
                      required 
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={buyerPhone} 
                      onChange={e => setBuyerPhone(e.target.value)}
                      required 
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Address</label>
                    <textarea 
                      value={buyerAddress} 
                      onChange={e => setBuyerAddress(e.target.value)}
                      required 
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FF9933] text-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      {isCheckingOut ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Place Direct Maker Order • ₹{Number(totalAmount).toLocaleString()}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Subtotal */}
          {!orderPlaced && cartItems.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal (Direct Maker Rates):</span>
                <span className="font-bold text-[#138808] text-sm">₹{Number(totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Broker Commission:</span>
                <span className="text-[#138808] font-semibold">₹0 (Zero Markup)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

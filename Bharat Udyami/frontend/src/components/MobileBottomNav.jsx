import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Grid, 
  Heart, 
  ShoppingBag, 
  User, 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  MessageSquare, 
  Store 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav() {
  const { isAuthenticated, isSeller } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      {isSeller ? (
        // Seller Bottom Navigation
        <div className="grid grid-cols-5 items-center text-center">
          <Link
            to="/seller-dashboard"
            className={`flex flex-col items-center py-1.5 transition ${
              isActive('/seller-dashboard') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </Link>

          <Link
            to="/seller-dashboard?tab=inventory"
            className={`flex flex-col items-center py-1.5 transition ${
              location.search.includes('tab=inventory') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Products</span>
          </Link>

          <Link
            to="/product-studio"
            className="flex flex-col items-center py-1 transition group"
          >
            <div className="w-10 h-10 -mt-4 rounded-full bg-[#FF9933] text-stone-950 flex items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-[#FF9933] mt-0.5">Add Item</span>
          </Link>

          <Link
            to="/seller-dashboard?tab=enquiries"
            className={`flex flex-col items-center py-1.5 transition ${
              location.search.includes('tab=enquiries') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Enquiries</span>
          </Link>

          <Link
            to="/seller-setup"
            className={`flex flex-col items-center py-1.5 transition ${
              isActive('/seller-setup') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </Link>
        </div>
      ) : (
        // Buyer / Guest Bottom Navigation
        <div className="grid grid-cols-5 items-center text-center">
          <Link
            to="/"
            className={`flex flex-col items-center py-1.5 transition ${
              isActive('/') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          <Link
            to="/marketplace"
            className={`flex flex-col items-center py-1.5 transition ${
              isActive('/marketplace') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Categories</span>
          </Link>

          <Link
            to="/wishlist"
            className={`flex flex-col items-center py-1.5 relative transition ${
              isActive('/wishlist') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] mt-0.5">Wishlist</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center py-1.5 relative text-slate-500 hover:text-slate-800 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-5 bg-[#FF9933] text-slate-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
            <span className="text-[10px] mt-0.5">Cart</span>
          </button>

          <Link
            to={isAuthenticated ? '/buyer-dashboard' : '/login'}
            className={`flex flex-col items-center py-1.5 transition ${
              isActive('/buyer-dashboard') || isActive('/login') ? 'text-[#FF9933] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Account</span>
          </Link>
        </div>
      )}
    </div>
  );
}

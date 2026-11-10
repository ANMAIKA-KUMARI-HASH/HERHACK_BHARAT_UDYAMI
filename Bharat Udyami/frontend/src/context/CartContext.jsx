import React, { createContext, useContext, useState, useEffect } from 'react';
import { createOrder } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('marketlink_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNotification, setOrderNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('marketlink_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + quantity } : item
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, cartQuantity: newQty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.final_price || item.suggested_price || 0) * item.cartQuantity,
    0
  );

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);

  const checkout = async (buyerDetails) => {
    try {
      for (const item of cartItems) {
        await createOrder({
          product_id: item.id,
          product_name: item.name,
          buyer_name: buyerDetails.name || 'Verified Customer',
          buyer_address: buyerDetails.address || 'Civil Lines, Delhi',
          buyer_phone: buyerDetails.phone || '+91 98100 00000',
          quantity: item.cartQuantity,
          total_amount: (item.final_price || item.suggested_price) * item.cartQuantity,
          delivery_mode: 'Direct Producer Shipping'
        });
      }
      clearCart();
      setIsCartOpen(false);
      setOrderNotification('Order successfully placed! Direct notification sent to the producer.');
      setTimeout(() => setOrderNotification(null), 5000);
      return { success: true };
    } catch (err) {
      console.error('Checkout error:', err);
      return { success: false, message: err.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalAmount,
        totalItemsCount,
        checkout,
        orderNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

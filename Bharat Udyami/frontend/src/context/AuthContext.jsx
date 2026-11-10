import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser, updateSellerProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bu_auth_token'));
  const [loading, setLoading] = useState(true);

  // Check current session on mount if token exists
  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const res = await fetchCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            setProfile(res.profile);
          } else {
            // Token invalid or expired
            localStorage.removeItem('bu_auth_token');
            setToken(null);
            setUser(null);
            setProfile(null);
          }
        } catch (err) {
          console.error("Auth init error:", err);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success && res.token) {
      localStorage.setItem('bu_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success && res.token) {
      localStorage.setItem('bu_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('bu_auth_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const saveSellerProfile = async (profileData) => {
    const res = await updateSellerProfile(profileData);
    if (res.success && res.profile) {
      setProfile(res.profile);
    }
    return res;
  };

  const value = {
    user,
    profile,
    token,
    loading,
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller',
    isBuyer: user?.role === 'buyer',
    login,
    register,
    logout,
    saveSellerProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    tagline: "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।",
    subtagline: "Direct Market Linkage for India's Farmers, Artisans & Small Producers",
    home: "Home",
    explore: "Explore Products",
    howItWorks: "How It Works",
    aiTech: "AI Technology",
    buyerMatch: "AI Buyer Match",
    deliveryChecker: "Delivery Checker",
    sellWithUs: "Sell With Us",
    shopWithUs: "Shop With Us",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    dashboard: "Dashboard",
    sellerDashboard: "Seller Dashboard",
    buyerDashboard: "Buyer Dashboard",
    myProducts: "My Products",
    addNewProduct: "Add New Product",
    wishlist: "Wishlist",
    cart: "Cart",
    searchPlaceholder: "Search crops, pottery, handloom, paintings, homemade food...",
    deliverTo: "Deliver to",
    categories: "Categories",
    allCategories: "All Categories",
    farmersAgri: "Farmers & Agriculture",
    handicrafts: "Handicrafts & Handmade",
    artistsCreators: "Artists & Creators",
    homeBased: "Home-Based Businesses",
    smallManufacturers: "Small Manufacturers",
    otherCreators: "Other Creators",
    verifiedProducer: "Verified Producer",
    directPrice: "Direct Producer Price",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    sendEnquiry: "Send Bulk Enquiry",
    wholesaleQuote: "Request Quotation",
    reviews: "Genuine Reviews",
    noMiddlemen: "100% Direct Fair Maker Margins • Zero Middleman Deductions"
  },
  hi: {
    tagline: "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।",
    subtagline: "भारतीय किसानों, कारीगरों और छोटे उत्पादकों के लिए सीधा बाज़ार",
    home: "होम",
    explore: "उत्पाद देखें",
    howItWorks: "यह कैसे काम करता है",
    aiTech: "एआई तकनीक",
    buyerMatch: "खरीदार मिलान",
    deliveryChecker: "डिलीवरी जांचें",
    sellWithUs: "उत्पाद बेचें",
    shopWithUs: "खरीदारी करें",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    sellerDashboard: "विक्रेता डैशबोर्ड",
    buyerDashboard: "खरीदार डैशबोर्ड",
    myProducts: "मेरे उत्पाद",
    addNewProduct: "नया उत्पाद जोड़ें",
    wishlist: "पसंदीदा सूची",
    cart: "कार्ट",
    searchPlaceholder: "फसलें, मिट्टी के बर्तन, हथकरघा, पेंटिंग्स, घर का खाना खोजें...",
    deliverTo: "डिलीवरी स्थान",
    categories: "श्रेणियां",
    allCategories: "सभी श्रेणियां",
    farmersAgri: "किसान और कृषि उत्पाद",
    handicrafts: "हस्तशिल्प और हस्तनिर्मित",
    artistsCreators: "कलाकार और कृतियां",
    homeBased: "गृह उद्योग और घरेलू उत्पाद",
    smallManufacturers: "लघु उद्योग और विनिर्माता",
    otherCreators: "अन्य उत्पादक",
    verifiedProducer: "प्रमाणित उत्पादक",
    directPrice: "उत्पादक का सीधा मूल्य",
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें",
    sendEnquiry: "थोक पूछताछ भेजें",
    wholesaleQuote: "कोटेशन मांगें",
    reviews: "सत्यापित समीक्षाएं",
    noMiddlemen: "100% सीधा उत्पादक मुनाफा • बिचौलियों से पूरी तरह मुक्त"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('bu_language') || 'hi';
  });

  useEffect(() => {
    localStorage.setItem('bu_language', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('bu_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

// -------------------------------------------------------------
// Authentication & User Profile
// -------------------------------------------------------------
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function updateSellerProfile(profileData) {
  const res = await fetch(`${API_BASE}/auth/seller-profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return res.json();
}

export async function getSmtpStatus() {
  const res = await fetch(`${API_BASE}/auth/smtp-status`);
  return res.json();
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyRecoveryOtp(email, otp) {
  const res = await fetch(`${API_BASE}/auth/verify-recovery-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}

export async function resetPassword(email, reset_token, new_password) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, reset_token, new_password }),
  });
  return res.json();
}

export async function getStudioStatus() {
  const res = await fetch(`${API_BASE}/ai/studio/status`);
  return res.json();
}

// -------------------------------------------------------------
// Products
// -------------------------------------------------------------
export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.location && filters.location !== 'All') params.append('location', filters.location);
  if (filters.min_price) params.append('min_price', filters.min_price);
  if (filters.max_price) params.append('max_price', filters.max_price);
  if (filters.user_id) params.append('user_id', filters.user_id);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function toggleProductStatus(id, status) {
  const res = await fetch(`${API_BASE}/products/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// -------------------------------------------------------------
// Reviews & Ratings
// -------------------------------------------------------------
export async function fetchProductReviews(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
  return res.json();
}

export async function addProductReview(productId, reviewData) {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  });
  return res.json();
}

// -------------------------------------------------------------
// Wishlist
// -------------------------------------------------------------
export async function fetchWishlist() {
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function addToWishlist(productId) {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ product_id: productId }),
  });
  return res.json();
}

export async function removeFromWishlist(productId) {
  const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// -------------------------------------------------------------
// Trust & Safety: Reports
// -------------------------------------------------------------
export async function submitReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reportData),
  });
  return res.json();
}

// -------------------------------------------------------------
// Notifications
// -------------------------------------------------------------
export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// -------------------------------------------------------------
// Locations & Districts
// -------------------------------------------------------------
export async function fetchLocations() {
  const res = await fetch(`${API_BASE}/locations`);
  return res.json();
}

// -------------------------------------------------------------
// OTP Authentication
// -------------------------------------------------------------
export async function sendOtp(identifier) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  return res.json();
}

export async function verifyOtp(identifier, otp) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, otp }),
  });
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

// -------------------------------------------------------------
// AI Pricing Engine
// -------------------------------------------------------------
export async function calculatePricing(pricingData) {
  const res = await fetch(`${API_BASE}/pricing/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pricingData),
  });
  return res.json();
}

// -------------------------------------------------------------
// AI Recommended Buyers
// -------------------------------------------------------------
export async function recommendBuyers(queryData) {
  const res = await fetch(`${API_BASE}/buyers/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryData),
  });
  return res.json();
}

export async function fetchAllBuyers() {
  const res = await fetch(`${API_BASE}/buyers`);
  return res.json();
}

// -------------------------------------------------------------
// Sourcing Requirements (Buyer Postings)
// -------------------------------------------------------------
export async function fetchSourcingRequirements() {
  const res = await fetch(`${API_BASE}/sourcing-requirements`);
  return res.json();
}

export async function createSourcingRequirement(data) {
  const res = await fetch(`${API_BASE}/sourcing-requirements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// -------------------------------------------------------------
// Enquiries
// -------------------------------------------------------------
export async function fetchEnquiries() {
  const res = await fetch(`${API_BASE}/enquiries`);
  return res.json();
}

export async function createEnquiry(enquiryData) {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });
  return res.json();
}

export async function updateEnquiryStatus(id, status) {
  const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// -------------------------------------------------------------
// Orders
// -------------------------------------------------------------
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

// -------------------------------------------------------------
// Dashboards
// -------------------------------------------------------------
export async function fetchSellerMetrics() {
  const res = await fetch(`${API_BASE}/seller/metrics`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchBuyerMetrics() {
  const res = await fetch(`${API_BASE}/buyer/metrics`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// -------------------------------------------------------------
// AI Services
// -------------------------------------------------------------
export async function parseVoiceTranscript(text) {
  const res = await fetch(`${API_BASE}/ai/voice-parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function generateProductDescription(payload) {
  const res = await fetch(`${API_BASE}/ai/generate-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('bu_auth_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/upload-image`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return res.json();
}

export async function enhanceProductImage(imageUrl) {
  const res = await fetch(`${API_BASE}/ai/enhance-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  return res.json();
}

export async function checkDeliveryFeasibility(payload) {
  const res = await fetch(`${API_BASE}/delivery/feasibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function askSellerAssistant(question) {
  const res = await fetch(`${API_BASE}/ai/seller-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  return res.json();
}

// -------------------------------------------------------------
// Advanced AI Studio & Aesthetic Scene Recommendation Services
// -------------------------------------------------------------
export async function fetchSceneLibrary() {
  const res = await fetch(`${API_BASE}/ai/studio/scene-library`);
  return res.json();
}

export async function fetchEnvironmentStyles() {
  const res = await fetch(`${API_BASE}/ai/studio/environment-styles`);
  return res.json();
}

export async function fetchStudioStyles() {
  const res = await fetch(`${API_BASE}/ai/studio/styles`);
  return res.json();
}

export async function getEnvironmentStatus() {
  const res = await fetch(`${API_BASE}/ai/studio/environment-status`);
  return res.json();
}

export async function fetchStagingProviders() {
  const res = await fetch(`${API_BASE}/ai/studio/providers`);
  return res.json();
}

export async function stageProductWithProvider(payload) {
  const res = await fetch(`${API_BASE}/ai/studio/stage-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function recommendStudioScenes(payload) {
  const res = await fetch(`${API_BASE}/ai/studio/recommend-scenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function generateMoreScenes(payload) {
  const res = await fetch(`${API_BASE}/ai/studio/generate-more-scenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function transformStudioEnvironment(payload) {
  return stageProductWithProvider(payload);
}

export async function renderAestheticScene(payload) {
  return stageProductWithProvider(payload);
}

export async function enhanceStudioPhoto(payload) {
  return stageProductWithProvider(payload);
}

export async function analyzeStudioScene(imageUrl) {
  const res = await fetch(`${API_BASE}/ai/studio/analyze-scene`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  return res.json();
}

export async function analyzeStudioPhoto(imageUrl) {
  return analyzeStudioScene(imageUrl);
}

export async function fetchSupportedLanguages() {
  const res = await fetch(`${API_BASE}/ai/languages`);
  return res.json();
}

export async function parseMultilingualVoice(payload) {
  const res = await fetch(`${API_BASE}/ai/multilingual-parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function calculateSmartPricing(payload) {
  const res = await fetch(`${API_BASE}/ai/smart-pricing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function generateFullListing(payload) {
  const res = await fetch(`${API_BASE}/ai/generate-full-listing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

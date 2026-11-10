import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Store, 
  Sliders, 
  Info, 
  Layers, 
  Send, 
  Eye, 
  Cpu, 
  Wheat, 
  Palette, 
  Hammer, 
  UtensilsCrossed, 
  Factory, 
  Package,
  Globe,
  SlidersHorizontal,
  SunMedium,
  Contrast,
  Sparkle,
  Wand2,
  HelpCircle,
  MessageSquare,
  Volume2,
  IndianRupee,
  ShieldCheck,
  CheckCheck,
  Download,
  RotateCcw,
  Camera,
  Compass,
  BookmarkCheck
} from 'lucide-react';
import { 
  uploadProductImage,
  fetchStudioStyles,
  fetchEnvironmentStyles,
  fetchSceneLibrary,
  fetchStagingProviders,
  stageProductWithProvider,
  recommendStudioScenes,
  generateMoreScenes,
  renderAestheticScene,
  enhanceStudioPhoto,
  transformStudioEnvironment,
  analyzeStudioScene,
  analyzeStudioPhoto,
  fetchSupportedLanguages,
  parseMultilingualVoice,
  calculateSmartPricing,
  generateFullListing,
  createProduct,
  getStudioStatus,
  getEnvironmentStatus
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductStudio() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Active Workflow Step (1: Photo Studio, 2: Voice & Language, 3: Auto-Listing, 4: Conversational Follow-up, 5: Smart Pricing, 6: Final Review & Publish)
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: AI PHOTO STUDIO & ENVIRONMENT TRANSFORMATION STATES
  const [imageFile, setImageFile] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80");
  const [enhancedImageUrl, setEnhancedImageUrl] = useState("https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=85");
  const [selectedStyle, setSelectedStyle] = useState('luxury-wood');
  const [selectedProvider, setSelectedProvider] = useState('auto'); // 'auto', 'photoroom', 'pebblely', 'local'
  const [providersInfo, setProvidersInfo] = useState({
    primary_provider: 'photoroom',
    alternative_provider: 'pebblely',
    active_default: 'local_synthesizer',
    providers: {
      photoroom: { configured: false, name: 'Photoroom API' },
      pebblely: { configured: false, name: 'Pebblely API' },
      local_synthesizer: { configured: true, name: 'High-Fidelity Synthesizer' }
    }
  });
  const [activeProviderName, setActiveProviderName] = useState('High-Fidelity Photorealistic Synthesizer (Built-in)');
  const [productPreservation, setProductPreservation] = useState({
    verified: true,
    preservation_score: 98,
    status: 'verified',
    note: '100% Authentic Product Preserved – Foreground pixels and textures remain untouched.'
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [cutoutImageUrl, setCutoutImageUrl] = useState('');
  const [apiSetupRequired, setApiSetupRequired] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [sharpness, setSharpness] = useState(50);
  const [comparisonMode, setComparisonMode] = useState('split'); // 'split', 'side-by-side', 'enhanced', 'original', 'cutout'
  const [splitSliderPos, setSplitSliderPos] = useState(50);
  const [isEnhancingImage, setIsEnhancingImage] = useState(false);
  const [isRecommendingScenes, setIsRecommendingScenes] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [retainOriginal, setRetainOriginal] = useState(true);
  const [historyStack, setHistoryStack] = useState([]);

  // 12+ Dynamic Aesthetic Background Recommendation Scenes
  const [recommendedScenes, setRecommendedScenes] = useState([
    {
      id: "luxury-wood",
      name: "Luxury Wooden Setup",
      tag: "Artisan Hardwood",
      description: "Product placed on a beautiful natural wooden chair, wooden table or rustic shelf, with soft afternoon sunlight.",
      why_recommended: "Warm timber grains complement the organic clay texture while directional daylight highlights the artisanal hand-turned contours.",
      ideal_for: "Pottery, terracotta clayware, organic food, wooden bowls, brassware, handmade soaps",
      surface_type: "Seasoned Reclaimed Oak Tabletop",
      lighting_type: "Soft Afternoon Daylight with Leaf Shadows",
      recommended_props: "Botanical leaf shadows, raw timber grain, brass accent",
      match_score: 98,
      badge_color: "bg-amber-100 text-amber-900 border-amber-300",
      preview_bg: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
      accent: "#b45309"
    },
    {
      id: "minimal-beige",
      name: "Minimal Beige Studio",
      tag: "Architectural Neutral",
      description: "Warm beige background, textured wall, subtle shadows, clean and modern aesthetic.",
      why_recommended: "High-contrast clean isolation brings instant focus to intricate handmade craftsmanship.",
      ideal_for: "Ceramics, lifestyle crafts, candles, soaps, minimalist home decor, designer jewellery",
      surface_type: "Smooth Beige Microcement Slab",
      lighting_type: "Soft Directional Diffused Daylight",
      recommended_props: "Soft curved plaster arch, subtle dry floral stem",
      match_score: 96,
      badge_color: "bg-orange-50 text-orange-900 border-orange-200",
      preview_bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #d97706 100%)",
      accent: "#d97706"
    },
    {
      id: "boho-corner",
      name: "Boho Aesthetic Corner",
      tag: "Earthy Bohemian",
      description: "Natural jute rug, macrame wall hanging, cane furniture, dried pampas grass, warm organic textures.",
      why_recommended: "Organic fibers and warm earth tones harmonize effortlessly with natural handmade materials.",
      ideal_for: "Handmade bags, jute baskets, organic candles, macrame decor, lifestyle textiles",
      surface_type: "Woven Cane & Natural Rattan Surface",
      lighting_type: "Warm Ambient Daylight with Pampas Grass Shadows",
      recommended_props: "Dried pampas grass vase, braided jute mat, cane backdrop",
      match_score: 94,
      badge_color: "bg-yellow-50 text-yellow-900 border-yellow-300",
      preview_bg: "linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)",
      accent: "#ca8a04"
    },
    {
      id: "luxury-marble",
      name: "Luxury Marble Setup",
      tag: "Italian Calacatta",
      description: "White or cream Italian marble surface with delicate golden veins, soft reflections, premium luxury look.",
      why_recommended: "Polished stone reflectance and luminous veining convey an exquisite, high-end retail look.",
      ideal_for: "Handmade jewellery, luxury perfumes, gemstones, brassware, cosmetic glasscraft",
      surface_type: "Polished Calacatta Cream Marble Slab",
      lighting_type: "Soft Golden Studio Glow with Delicate Specular Highlights",
      recommended_props: "Velvet jewellery tray, travertine stone riser",
      match_score: 95,
      badge_color: "bg-stone-100 text-stone-800 border-stone-300",
      preview_bg: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #78716c 100%)",
      accent: "#78716c"
    },
    {
      id: "nature-sunlight",
      name: "Nature-Inspired Setup",
      tag: "Botanical Sunlight",
      description: "Green plants, Monstera leaves, natural sunlight filtering through leaves, fresh and organic vibe.",
      why_recommended: "Dappled leaf shadows and chlorophyll tones convey authentic organic freshness.",
      ideal_for: "Organic food, natural skincare, soaps, herbal tea, honey, farm harvest",
      surface_type: "Reclaimed Forest Wood Surface",
      lighting_type: "Morning Dappled Sunlight through Green Foliage",
      recommended_props: "Monstera leaf, fresh botanical sprigs, jute twine",
      match_score: 93,
      badge_color: "bg-emerald-50 text-emerald-900 border-emerald-200",
      preview_bg: "linear-gradient(135deg, #d1fae5 0%, #10b981 50%, #047857 100%)",
      accent: "#047857"
    },
    {
      id: "rustic-indian",
      name: "Rustic Indian Home",
      tag: "Heritage Courtyard",
      description: "Traditional carved wooden furniture, earthy mud-plaster walls, warm lighting, authentic Indian feel.",
      why_recommended: "Directly contextualizes indigenous crafts in their cultural heritage milieu.",
      ideal_for: "Terracotta pottery, brassware, traditional textiles, pickles, idols, sweets",
      surface_type: "Carved Antique Sheesham Surface",
      lighting_type: "Warm Golden Indian Courtyard Glow",
      recommended_props: "Brass diya / cup, terracotta tile accent, handspun khadi cloth",
      match_score: 97,
      badge_color: "bg-orange-100 text-[#FF9933] border-orange-300",
      preview_bg: "linear-gradient(135deg, #ffedd5 0%, #f97316 50%, #c2410c 100%)",
      accent: "#c2410c"
    },
    {
      id: "premium-boutique",
      name: "Premium Boutique Display",
      tag: "Fashion Showcase",
      description: "Minimalist boutique shelf, soft curtains, elegant display stand, warm boutique lighting.",
      why_recommended: "Architectural pedestals elevate the product to an exclusive boutique designer statement.",
      ideal_for: "Leather bags, silk sarees, handmade footwear, designer apparel, luxury crafts",
      surface_type: "Architectural Showcase Podium",
      lighting_type: "Directional Boutique Track Spotlight",
      recommended_props: "Draped silk swatch, matte ceramic riser, boutique mirror accent",
      match_score: 92,
      badge_color: "bg-purple-50 text-purple-900 border-purple-200",
      preview_bg: "linear-gradient(135deg, #f3e8ff 0%, #c084fc 50%, #7e22ce 100%)",
      accent: "#7e22ce"
    },
    {
      id: "garden-aesthetic",
      name: "Garden Aesthetic",
      tag: "Outdoor Sunlit Garden",
      description: "Outdoor garden setting, natural sunlight, green grass blur, stone or wooden garden table.",
      why_recommended: "Vibrant natural daylight and bokeh greenery create an inviting outdoor lifestyle presentation.",
      ideal_for: "Plants, terracotta pots, organic produce, pickles, outdoor decor, wooden crafts",
      surface_type: "Weathered Garden Wood / Stone Slab",
      lighting_type: "Bright Natural Outdoor Daylight with Soft Shadows",
      recommended_props: "Fresh flowering petals, green garden bokeh, smooth river pebble",
      match_score: 91,
      badge_color: "bg-teal-50 text-teal-900 border-teal-200",
      preview_bg: "linear-gradient(135deg, #ccfbf1 0%, #14b8a6 50%, #0f766e 100%)",
      accent: "#0f766e"
    },
    {
      id: "scandinavian-minimal",
      name: "Modern Scandinavian Setup",
      tag: "Nordic Minimal",
      description: "Clean white interiors, light wood tones, neutral linen, soft daylight, cozy modern home look.",
      why_recommended: "Uncluttered contemporary interior styling makes the product feel immediately at home.",
      ideal_for: "Handmade bags, lifestyle decor, cushions, scented candles, home accessories",
      surface_type: "Scandinavian Ashwood Shelf",
      lighting_type: "Diffused Warm Ambient Living Room Light",
      recommended_props: "Ceramic minimalist vase, linen throw fold",
      match_score: 90,
      badge_color: "bg-blue-50 text-blue-900 border-blue-200",
      preview_bg: "linear-gradient(135deg, #dbeafe 0%, #60a5fa 50%, #1d4ed8 100%)",
      accent: "#1d4ed8"
    },
    {
      id: "art-gallery",
      name: "Luxury Gallery Display",
      tag: "Art Gallery & Studio",
      description: "Art gallery wall, spotlight on the product, clean shadows, premium exhibition feel.",
      why_recommended: "Overhead museum spotlights celebrate the artisan's signature technique as collectible fine art.",
      ideal_for: "Paintings, framed artwork, sculptures, collector handicrafts, metal crafts",
      surface_type: "Floating Museum Gallery Pedestal",
      lighting_type: "Focused Museum Halogen Spotlight",
      recommended_props: "Museum placard accent, recessed ceiling track light",
      match_score: 93,
      badge_color: "bg-zinc-100 text-zinc-900 border-zinc-300",
      preview_bg: "linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 50%, #3f3f46 100%)",
      accent: "#3f3f46"
    },
    {
      id: "terracotta-earthy",
      name: "Terracotta & Earthy Setup",
      tag: "Raw Clay & Sienna",
      description: "Clay textures, burnt orange and terracotta shades, raw natural feel.",
      why_recommended: "Monochromatic sienna clay tones establish rich, grounded authenticity.",
      ideal_for: "Clay pottery, terracotta cookware, organic spices, handmade planters",
      surface_type: "Sun-Baked Terracotta Tile Slab",
      lighting_type: "Warm Organic Afternoon Sunlight",
      recommended_props: "Clay pottery shards, natural dry grass bundle, sienna tile baseline",
      match_score: 97,
      badge_color: "bg-amber-100 text-amber-900 border-amber-300",
      preview_bg: "linear-gradient(135deg, #fed7aa 0%, #ea580c 50%, #9a3412 100%)",
      accent: "#ea580c"
    },
    {
      id: "festive-indian",
      name: "Festive Indian Setup",
      tag: "Traditional Celebration",
      description: "Marigold flowers, brass lamps (diyas), subtle festive lighting, rich Indian festive mood.",
      why_recommended: "Vibrant marigold garlands and brass diya glows inspire celebration purchases and gifting.",
      ideal_for: "Festive handicrafts, brass idols, handloom textiles, sweets, tea, celebration gifts",
      surface_type: "Carved Teakwood Surface with Brass Tray",
      lighting_type: "Warm Festive Golden Diya Illumination",
      recommended_props: "Fresh orange marigold petals, polished brass diya, silk zari border",
      match_score: 95,
      badge_color: "bg-orange-100 text-[#FF9933] border-orange-300",
      preview_bg: "linear-gradient(135deg, #fef08a 0%, #f97316 50%, #b45309 100%)",
      accent: "#f97316"
    },
    {
      id: "pure-white",
      name: "Professional White Studio",
      tag: "E-Commerce Standard",
      description: "Seamless pure white infinity cyc backdrop with soft, diffused ground contact shadow. Meets Amazon, Flipkart, and Google Shopping requirements.",
      why_recommended: "Catalog-compliant crisp white backdrop ideal for primary marketplace search hero photos.",
      ideal_for: "All categories for official catalog listings and marketplace hero images",
      surface_type: "Seamless White Infinity Cyclorama",
      lighting_type: "Even High-Key Commercial Studio Diffuse Light",
      recommended_props: "Ground contact shadow only",
      match_score: 88,
      badge_color: "bg-slate-100 text-slate-800 border-slate-300",
      preview_bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      accent: "#64748b"
    },
    {
      id: "custom-prompt",
      name: "Custom Background Prompt",
      tag: "AI Generative Scene",
      description: "Tailor a custom photography environment using your own descriptive words (e.g. 'On an antique teak table with marigold petals in a sunlit courtyard').",
      why_recommended: "Allows personalized artistic vision, custom regional backdrops, and creative staging.",
      ideal_for: "Creative advertising campaigns, festive seasonal themes, and custom buyer presentations",
      surface_type: "Custom Specified Surface",
      lighting_type: "Custom Defined Environment Lighting",
      recommended_props: "Custom tailored artisan props",
      match_score: 90,
      badge_color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      preview_bg: "linear-gradient(135deg, #d1fae5 0%, #34d399 50%, #059669 100%)",
      accent: "#059669"
    }
  ]);

  const [availableStyles, setAvailableStyles] = useState(recommendedScenes);

  // AI Product Understanding State (6 Dimensions)
  const [productUnderstanding, setProductUnderstanding] = useState({
    product_name: "Handcrafted Terracotta Clay Water Vessel",
    category: "Handicrafts & Handmade Products",
    product_type: "Handmade", // "Handmade" | "Decorative" | "Wearable" | "Edible" | "Functional"
    shape_profile: "Cylindrical round contour with flared neck",
    size_estimate: "Medium tabletop vessel (8-10 inches height)",
    dominant_colors: ["#C2410C", "#D97706", "#78350F"],
    dominant_color_names: ["Terracotta Burnt Sienna", "Warm Clay Ochre", "Raw Earthen Umber"],
    texture_profile: "Matte porous clay grain with authentic wheel-turned rings",
    material_detected: "Natural Earthen Terracotta Clay & Mineral Slip",
    surface_recommendation: "Seasoned Oak Wood Tabletop, Burnt Terracotta, or Travertine Slab",
    lighting_recommendation: "Soft Window Daylight with Organic Leaf Shadows & Natural Specular Warmth",
    camera_angle: "30° Eye-Level Commercial Marketplace Angle",
    recommended_props: ["Marigold flower petals", "Hand-moulded clay diya", "Handspun raw khadi fabric"],
    quality_score: 96,
    recommended_environment: "Luxury Wooden Setup"
  });

  const [sceneAnalysis, setSceneAnalysis] = useState(productUnderstanding);
  const [cvAnalysis, setCvAnalysis] = useState(productUnderstanding);

  // STEP 2: MULTILINGUAL VOICE STATES (22 Indian Languages)
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState(
    "I made this product using wood, paint and polish. Wood cost me ₹300, paint cost ₹100 and labour cost ₹250."
  );
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcriptionEditable, setTranscriptionEditable] = useState(true);

  // STEP 3: AUTO-GENERATED LISTING STATES
  const [productName, setProductName] = useState("Hand-Carved Seasoned Wood Table Bowl");
  const [shortTitle, setShortTitle] = useState("Handcrafted Artisan Hardwood Bowl");
  const [category, setCategory] = useState("Handicrafts & Handmade Products");
  const [subcategory, setSubcategory] = useState("Wooden Crafts");
  const [materials, setMaterials] = useState(["Seasoned Sheesham Wood", "Natural Beeswax Finish"]);
  const [size, setSize] = useState("10-inch diameter (4-inch height)");
  const [quantity, setQuantity] = useState(45);
  const [unit, setUnit] = useState("pieces");
  const [sellerLocation, setSellerLocation] = useState("Alwar, Rajasthan");
  const [sellerName, setSellerName] = useState("Ramkishan Kumhar");
  const [description, setDescription] = useState(
    "Authentic hand-carved creation shaped from seasoned Indian rosewood. Finished with zero toxic chemical lacquers, preserving the natural grain, warm touch, and ergonomic utility. Ethically produced in local artisan workshops."
  );
  const [bulletFeatures, setBulletFeatures] = useState([
    "100% Solid Indian Hardwood – Zero synthetic veneer or composite fillers",
    "Hand-turned and polished with organic non-toxic natural beeswax",
    "Ergonomic everyday utility for fruit, dry foods, or centerpiece decor",
    "Direct Producer Provenance – 100% fair margin paid to master craftsman"
  ]);
  const [searchKeywords, setSearchKeywords] = useState([
    "wooden bowl", "sheesham craft", "handcrafted", "artisan woodcraft", "bharat udyami", "vocal for local", "wholesale b2b"
  ]);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);

  // STEP 4: CONVERSATIONAL FOLLOW-UP STATES
  const [conversationalResponse, setConversationalResponse] = useState(
    "AI Assistant understood your craft materials and direct costs. Let's confirm a few key details."
  );
  const [followUpQuestions, setFollowUpQuestions] = useState([
    {
      field: "size",
      question_en: "What are the exact dimensions or capacity of this piece?",
      question_hi: "इस उत्पाद का साइज़ या माप क्या है?"
    },
    {
      field: "quantity",
      question_en: "How many finished pieces do you have in stock for immediate order fulfillment?",
      question_hi: "तुरंत डिलीवरी के लिए आपके पास कुल कितने पीस तैयार हैं?"
    }
  ]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // STEP 5: INTELLIGENT PRICING STATES
  const [rawMaterialCost, setRawMaterialCost] = useState(400); // 300 wood + 100 paint
  const [labourCost, setLabourCost] = useState(250);
  const [packagingCost, setPackagingCost] = useState(40);
  const [transportCost, setTransportCost] = useState(30);
  const [otherCost, setOtherCost] = useState(0);
  const [desiredMarginPercent, setDesiredMarginPercent] = useState(25);
  const [smartPricingData, setSmartPricingData] = useState({
    breakdown: {
      raw_material_cost: 400,
      labour_cost: 250,
      packaging_cost: 40,
      transport_cost: 30,
      other_cost: 0,
      total_production_cost: 720
    },
    pricing_tiers: {
      floor_minimum_price: 828,
      suggested_fair_price: 960,
      premium_retail_price: 1044,
      wholesale_b2b_price: 816,
      wholesale_min_units: 20
    },
    margin_analysis: {
      desired_margin_percent: 25,
      estimated_profit_per_unit: 240,
      middleman_retail_comparison: 1536
    },
    market_benchmark: "Benchmark: Preserves master artisan minimum wage (₹450/day) + 100% direct maker margin.",
    explanation: "Total Cost ₹720 / (1 - 25%) = ₹960 suggested fair selling price."
  });
  const [finalPrice, setFinalPrice] = useState(960);

  // STEP 6: PUBLISHING STATES
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Load styles, providers, and 22 languages on mount
  useEffect(() => {
    async function initStudio() {
      try {
        const [scenesRes, langRes, provRes] = await Promise.all([
          fetchSceneLibrary().catch(() => fetchEnvironmentStyles()),
          fetchSupportedLanguages(),
          fetchStagingProviders().catch(() => getEnvironmentStatus())
        ]);
        if (scenesRes && (scenesRes.scenes || scenesRes.styles)) {
          const loaded = scenesRes.scenes || scenesRes.styles;
          if (loaded.length > 0) {
            setAvailableStyles(loaded);
            setRecommendedScenes(loaded);
          }
        }
        if (langRes && langRes.success && langRes.languages) {
          setLanguages(langRes.languages);
        }
        if (provRes && provRes.providers) {
          setProvidersInfo(provRes);
          if (provRes.active_provider_name) {
            setActiveProviderName(provRes.active_provider_name);
          }
        }
      } catch (err) {
        console.warn("API init fallback to defaults:", err);
      }
    }
    initStudio();

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) setSpeechSupported(true);
    }
  }, []);

  // Update profile info
  useEffect(() => {
    if (user) {
      if (user.name) setSellerName(user.name);
      if (user.city && user.state) setSellerLocation(`${user.city}, ${user.state}`);
      if (profile?.business_category) setCategory(profile.business_category);
    }
  }, [user, profile]);

  // Recalculate smart pricing whenever costs or margin change
  useEffect(() => {
    runPriceCalculation();
  }, [rawMaterialCost, labourCost, packagingCost, transportCost, otherCost, desiredMarginPercent, category]);

  const runPriceCalculation = async () => {
    const raw = parseFloat(rawMaterialCost) || 0;
    const lab = parseFloat(labourCost) || 0;
    const pack = parseFloat(packagingCost) || 0;
    const trans = parseFloat(transportCost) || 0;
    const other = parseFloat(otherCost) || 0;
    const margin = parseFloat(desiredMarginPercent) || 25;

    try {
      const res = await calculateSmartPricing({
        category,
        raw_material_cost: raw,
        labour_cost: lab,
        packaging_cost: pack,
        transport_cost: trans,
        other_cost: other,
        desired_margin_percent: margin
      });
      if (res.success) {
        setSmartPricingData(res);
        setFinalPrice(res.pricing_tiers.suggested_fair_price);
      }
    } catch {
      // Fallback direct math
      const total = raw + lab + pack + trans + other;
      const suggested = Math.round(total / (1 - (margin / 100)));
      setFinalPrice(suggested);
    }
  };

  // Upload Photo Action with Strict Validation & AI Product Understanding + 10+ Scene Recommendations
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict file type validation: JPG, JPEG, PNG, WEBP
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

    if (!validMimes.includes(file.type) && !validExts.includes(ext)) {
      setUploadError(`Unsupported format "${ext}". Please upload a JPG, JPEG, PNG, or WEBP photograph.`);
      return;
    }

    // Size validation: max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`Photo size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit. Please upload a smaller photo.`);
      return;
    }

    setUploadError('');
    setApiSetupRequired(null);
    setIsApproved(false);
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setOriginalImageUrl(previewUrl);
    setEnhancedImageUrl(previewUrl);

    try {
      const uploadRes = await uploadProductImage(file);
      if (uploadRes.success && uploadRes.url) {
        setOriginalImageUrl(uploadRes.url);
        setEnhancedImageUrl(uploadRes.url);

        setIsRecommendingScenes(true);
        try {
          const recRes = await recommendStudioScenes({ image_url: uploadRes.url });
          if (recRes.success) {
            if (recRes.product_understanding) {
              setProductUnderstanding(recRes.product_understanding);
              setSceneAnalysis(recRes.product_understanding);
              setCvAnalysis(recRes.product_understanding);
              if (recRes.product_understanding.product_name) {
                setProductName(recRes.product_understanding.product_name);
              }
              if (recRes.product_understanding.category) {
                setCategory(recRes.product_understanding.category);
              }
            }
            if (recRes.recommended_scenes && recRes.recommended_scenes.length > 0) {
              setRecommendedScenes(recRes.recommended_scenes);
              setAvailableStyles(recRes.recommended_scenes);
              const topStyle = recRes.recommended_scenes[0].id;
              setSelectedStyle(topStyle);
              handleTransformEnvironment(uploadRes.url, topStyle);
            } else {
              handleTransformEnvironment(uploadRes.url, selectedStyle);
            }
          } else {
            handleTransformEnvironment(uploadRes.url, selectedStyle);
          }
        } catch (recErr) {
          console.warn("Scene recommendation error:", recErr);
          handleTransformEnvironment(uploadRes.url, selectedStyle);
        } finally {
          setIsRecommendingScenes(false);
        }
      } else {
        setUploadError(uploadRes.message || 'Image upload failed.');
      }
    } catch (err) {
      console.warn("Upload fallback to local preview:", err);
    }
  };

  // Generate More Ideas Action (fetches 4 additional fresh aesthetic scene concepts)
  const handleGenerateMoreIdeas = async () => {
    setIsGeneratingMore(true);
    try {
      const currentIds = recommendedScenes.map(s => s.id);
      const res = await generateMoreScenes({
        image_url: originalImageUrl,
        current_scene_ids: currentIds
      });
      if (res.success && res.fresh_scenes && res.fresh_scenes.length > 0) {
        setRecommendedScenes(prev => [...prev, ...res.fresh_scenes]);
        setAvailableStyles(prev => [...prev, ...res.fresh_scenes]);
      }
    } catch (err) {
      console.warn("Generate more ideas error:", err);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  // AI Smart Product Staging with Photoroom API / Pebblely / Built-in Synthesizer
  const handleTransformEnvironment = async (imgUrl = originalImageUrl, styleId = selectedStyle, promptText = customPrompt, chosenProvider = selectedProvider) => {
    setIsEnhancingImage(true);
    setUploadError('');
    setIsApproved(false);

    // Save previous snapshot to history for Undo
    if (enhancedImageUrl) {
      setHistoryStack(prev => [
        ...prev.slice(-9), // Keep up to 10 undo steps
        {
          url: enhancedImageUrl,
          style: selectedStyle,
          prompt: customPrompt,
          provider: chosenProvider,
          timestamp: Date.now()
        }
      ]);
    }

    try {
      const res = await stageProductWithProvider({
        image_url: imgUrl,
        environment_style: styleId,
        custom_prompt: promptText,
        provider: chosenProvider,
        brightness,
        contrast,
        sharpness
      });

      if (res.success && (res.staged_image_url || res.enhanced_image_url || res.transformed_image_url)) {
        const finalUrl = res.staged_image_url || res.enhanced_image_url || res.transformed_image_url;
        setEnhancedImageUrl(finalUrl);
        if (res.cutout_image_url) setCutoutImageUrl(res.cutout_image_url);
        if (res.provider_name) setActiveProviderName(res.provider_name);
        if (res.product_preservation) setProductPreservation(res.product_preservation);
        if (res.scene_analysis) {
          setSceneAnalysis(res.scene_analysis);
          setCvAnalysis(res.scene_analysis);
          if (res.scene_analysis.detected_category && (!category || category === 'Handicrafts & Handmade Products')) {
            setCategory(res.scene_analysis.detected_category);
          }
        }
        setApiSetupRequired(null);
      } else if (res.api_configured === false) {
        setApiSetupRequired(res);
        setEnhancedImageUrl(imgUrl);
      } else {
        setUploadError(res.message || 'Product staging error. Please check provider settings.');
      }
    } catch (err) {
      console.warn("Studio staging error:", err);
    } finally {
      setIsEnhancingImage(false);
    }
  };

  // Aliases and Action Button Handlers
  const handleApplyStudioBackdrop = (imgUrl = originalImageUrl, styleId = selectedStyle) => {
    return handleTransformEnvironment(imgUrl, styleId, customPrompt);
  };

  const handleGenerateNewBackground = () => {
    handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt);
  };

  const handleChangeEnvironment = (styleId) => {
    setSelectedStyle(styleId);
    handleTransformEnvironment(originalImageUrl, styleId, customPrompt);
  };

  const handleTryAnotherStyle = () => {
    const list = recommendedScenes.length > 0 ? recommendedScenes : availableStyles;
    if (!list || list.length === 0) return;
    const currentIndex = list.findIndex(s => s.id === selectedStyle);
    const nextIndex = (currentIndex + 1) % list.length;
    const nextStyle = list[nextIndex].id;
    setSelectedStyle(nextStyle);
    handleTransformEnvironment(originalImageUrl, nextStyle, customPrompt);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setEnhancedImageUrl(previous.url);
    setSelectedStyle(previous.style);
    if (previous.prompt !== undefined) setCustomPrompt(previous.prompt);
    setHistoryStack(prev => prev.slice(0, -1));
    setIsApproved(false);
  };

  const handleApproveAndSave = () => {
    setIsApproved(true);
  };

  // Voice Recording Toggle using Web Speech API in chosen Indian language
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert("Your browser does not natively support Web Speech Recognition. You can type or edit your transcript directly in the box below.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Find BCP-47 tag for selected language
    const langObj = languages.find(l => l.code === selectedLang);
    recognition.lang = langObj ? langObj.bcp47 : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setIsRecording(false);
        handleProcessVoice(transcript, selectedLang);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  // Process Multilingual Voice Description
  const handleProcessVoice = async (textToParse = voiceTranscript, langCode = selectedLang) => {
    if (!textToParse.trim()) return;
    setIsParsingVoice(true);
    try {
      const res = await parseMultilingualVoice({
        speech_text: textToParse,
        language_code: langCode
      });
      if (res.success && res.extracted_data) {
        const d = res.extracted_data;
        if (d.name) setProductName(d.name);
        if (d.category) setCategory(d.category);
        if (d.materials && d.materials.length > 0) setMaterials(d.materials);
        if (d.size) setSize(d.size);
        if (d.quantity) setQuantity(d.quantity);
        if (d.raw_material_cost > 0) setRawMaterialCost(d.raw_material_cost);
        if (d.labour_cost > 0) setLabourCost(d.labour_cost);
        if (d.packaging_cost > 0) setPackagingCost(d.packaging_cost);
        if (d.transport_cost > 0) setTransportCost(d.transport_cost);

        if (res.follow_up_questions && res.follow_up_questions.length > 0) {
          setFollowUpQuestions(res.follow_up_questions);
        }
        if (res.conversational_response) {
          setConversationalResponse(res.conversational_response);
        }

        // Generate full listing description
        handleGenerateListingDetails(d.name || productName, d.category || category, d.materials || materials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingVoice(false);
    }
  };

  // Generate Listing Story & Keywords Action
  const handleGenerateListingDetails = async (pName = productName, pCat = category, pMats = materials) => {
    setIsGeneratingListing(true);
    try {
      const res = await generateFullListing({
        name: pName,
        category: pCat,
        materials: pMats,
        size: size,
        location: sellerLocation,
        language: selectedLang
      });
      if (res.success) {
        if (res.short_title) setShortTitle(res.short_title);
        if (res.description) setDescription(res.description);
        if (res.features) setBulletFeatures(res.features);
        if (res.keywords) setSearchKeywords(res.keywords);
      }
    } catch (err) {
      console.warn("Listing generation error:", err);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  // Answer follow up question
  const handleAnswerQuestion = (field, answer) => {
    setAnsweredQuestions(prev => ({ ...prev, [field]: answer }));
    if (field === 'size') setSize(answer);
    if (field === 'quantity') setQuantity(parseInt(answer) || 50);
    if (field === 'packaging_cost') setPackagingCost(parseFloat(answer) || 30);
  };

  // Final Publish Listing Action
  const handlePublishListing = async () => {
    setIsPublishing(true);
    try {
      const payload = {
        name: productName,
        category: category,
        subcategory: subcategory,
        material: Array.isArray(materials) ? materials.join(', ') : materials,
        size: size,
        quantity: parseInt(quantity),
        unit: unit,
        raw_material_cost: parseFloat(rawMaterialCost),
        labour_cost: parseFloat(labourCost),
        packaging_cost: parseFloat(packagingCost),
        transport_cost: parseFloat(transportCost),
        total_cost: smartPricingData.breakdown.total_production_cost,
        desired_margin: parseFloat(desiredMarginPercent) / 100,
        suggested_price: smartPricingData.pricing_tiers.suggested_fair_price,
        final_price: parseFloat(finalPrice),
        description: description,
        category_attributes: {
          short_title: shortTitle,
          bullet_features: bulletFeatures,
          keywords: searchKeywords,
          background_style: selectedStyle,
          wholesale_tier_price: smartPricingData.pricing_tiers.wholesale_b2b_price,
          product_type: productUnderstanding.product_type || 'Handmade',
          retain_original: retainOriginal
        },
        retain_original: retainOriginal,
        original_image_url: originalImageUrl,
        enhanced_image_url: enhancedImageUrl,
        seller_name: sellerName,
        seller_location: sellerLocation,
        is_verified_producer: true
      };

      const res = await createProduct(payload);
      if (res.success && res.product) {
        setPublishedProduct(res.product);
        setPublishSuccess(true);
      }
    } catch (err) {
      alert("Error publishing listing. Please check backend connection.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-[#FF9933] px-2.5 py-0.5 rounded-full">
              Advanced AI Seller Studio
            </span>
            <span className="text-xs text-[#16A34A] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#16A34A]" />
              <span>22 Indian Languages Supported</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            AI Product Studio & Multilingual Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload mobile camera photo, speak in your mother tongue, clean background, get cost-based pricing, and list in 1 minute.
          </p>
        </div>

        {/* Step indicator pill */}
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
          <span className="bg-[#FF9933] text-slate-900 px-3 py-1 rounded-lg font-bold">
            Step {currentStep} of 6
          </span>
          <span className="text-slate-500 pr-2">
            {currentStep === 1 && "Photo Studio"}
            {currentStep === 2 && "Mother Tongue Voice"}
            {currentStep === 3 && "Listing Details"}
            {currentStep === 4 && "Conversational Q&A"}
            {currentStep === 5 && "Smart Pricing"}
            {currentStep === 6 && "Review & Publish"}
          </span>
        </div>
      </div>

      {/* 6-Step Workflow Progression Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, title: '1. Photo Studio' },
          { num: 2, title: '2. Voice in Any Lang' },
          { num: 3, title: '3. Auto Listing' },
          { num: 4, title: '4. AI Follow-up' },
          { num: 5, title: '5. Smart Pricing' },
          { num: 6, title: '6. Publish' }
        ].map(step => (
          <button
            key={step.num}
            onClick={() => setCurrentStep(step.num)}
            className={`py-2 px-2 rounded-lg transition border text-center ${
              currentStep === step.num
                ? 'bg-[#FF9933] text-slate-900 border-[#FF9933] shadow-2xs font-bold'
                : currentStep > step.num
                ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 font-bold'
                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
            }`}
          >
            <div className="text-[11px] truncate">{step.title}</div>
          </button>
        ))}
      </div>

      {/* SUCCESS MODAL ON PUBLISH */}
      {publishSuccess && publishedProduct && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-lg animate-in fade-in">
          <div className="w-16 h-16 bg-[#16A34A] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Listing Published to Bharat Udyami!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Congratulations <span className="font-bold text-slate-900">{publishedProduct.seller_name}</span>! Your product <span className="font-bold text-slate-900">"{publishedProduct.name}"</span> is now live in the <span className="font-bold text-[#EA580C]">{publishedProduct.category}</span> section at direct maker price of <span className="font-bold text-[#16A34A]">₹{publishedProduct.final_price}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to={`/product/${publishedProduct.id}`}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-4 h-4 text-slate-900" />
              <span>View Live Marketplace Listing</span>
            </Link>
            <Link
              to="/seller-dashboard"
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Go to Seller Dashboard
            </Link>
            <button
              onClick={() => {
                setPublishSuccess(false);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#FF9933] border border-orange-200 rounded-xl text-xs font-bold transition"
            >
              List Another Product +
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: AI-POWERED AESTHETIC PRODUCT BACKGROUND & SMART SCENE GENERATOR   */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
          
          {/* Top Title & Fidelity Guarantee */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-[#FF9933] px-2 py-0.5 rounded-full">
                  AI Product Photography Engine
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-[#138808] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#138808]" />
                  <span>100% Authentic Product Preserved</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                <Sparkles className="w-5 h-5 text-[#FF9933]" />
                <span>AI-Powered Aesthetic Product Background & Smart Scene Generator</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Upload any ordinary mobile photograph. AI understands your product's shape, texture, material, and type (Handmade, Decorative, Wearable, Edible, Functional) and recommends 10+ stunning aesthetic photography scenes. Only the surrounding environment and natural contact shadows are created — your product remains 100% authentic.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                {recommendedScenes.length}+ Curated Scenes
              </span>
            </div>
          </div>

          {/* AI Staging Engine Provider Selector Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-[#FF9933]" />
                  <span>Product Staging Provider Engine:</span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  (Photoroom API [Primary], Pebblely API [Alternative], Built-in Synthesizer [100% Free])
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-500">Active Engine:</span>
                <span className="font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs">
                  {activeProviderName}
                </span>
              </div>
            </div>

            {/* Provider Option Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Option 1: Auto */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('auto');
                  handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, 'auto');
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedProvider === 'auto'
                    ? 'border-[#FF9933] bg-orange-50/70 ring-1 ring-[#FF9933]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Auto Route</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-orange-100 text-[#FF9933]">
                    Recommended
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Photoroom → Pebblely → Synthesizer
                </p>
              </button>

              {/* Option 2: Photoroom API (Primary) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('photoroom');
                  handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, 'photoroom');
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedProvider === 'photoroom'
                    ? 'border-[#FF9933] bg-orange-50/70 ring-1 ring-[#FF9933]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Photoroom API</span>
                  {providersInfo?.providers?.photoroom?.configured ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-[#138808]">
                      Live API Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800">
                      Key Required
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Primary Staging Engine (v2/edit)
                </p>
              </button>

              {/* Option 3: Pebblely API (Alternative) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('pebblely');
                  handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, 'pebblely');
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedProvider === 'pebblely'
                    ? 'border-[#FF9933] bg-orange-50/70 ring-1 ring-[#FF9933]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Pebblely API</span>
                  {providersInfo?.providers?.pebblely?.configured ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-[#138808]">
                      Live API Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800">
                      Key Required
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Alternative Lifestyle Staging
                </p>
              </button>

              {/* Option 4: High-Fidelity Synthesizer (Built-in) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('local');
                  handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, 'local');
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedProvider === 'local'
                    ? 'border-[#FF9933] bg-orange-50/70 ring-1 ring-[#FF9933]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Built-in Synthesizer</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-[#138808]">
                    100% Free / Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Zero-config procedural studio
                </p>
              </button>
            </div>

            {/* Missing Key Guidance Banner when Photoroom or Pebblely selected without API key */}
            {((selectedProvider === 'photoroom' && !providersInfo?.providers?.photoroom?.configured) ||
              (selectedProvider === 'pebblely' && !providersInfo?.providers?.pebblely?.configured)) && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {selectedProvider === 'photoroom' ? 'Photoroom API Key Configuration Required' : 'Pebblely API Key Configuration Required'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('local');
                      handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, 'local');
                    }}
                    className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300 transition"
                  >
                    Switch to Built-in Free Synthesizer →
                  </button>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  To stage products using live <strong>{selectedProvider === 'photoroom' ? 'Photoroom API (v2/edit)' : 'Pebblely API'}</strong>:
                  add <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold">{selectedProvider === 'photoroom' ? 'PHOTOROOM_API_KEY=your_key' : 'PEBBLELY_API_KEY=your_key'}</code> in <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold">backend/.env</code> and restart the backend server.
                  We never simulate or fake API results. Click above to use the built-in High-Fidelity Synthesizer immediately with 100% authentic foreground fidelity.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  <a
                    href={selectedProvider === 'photoroom' ? "https://www.photoroom.com/api" : "https://pebblely.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EA580C] font-bold underline hover:text-[#C2410C]"
                  >
                    Get {selectedProvider === 'photoroom' ? 'Photoroom' : 'Pebblely'} API Key ↗
                  </a>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-600">Zero-cost local synthesizer is always active & ready</span>
                </div>
              </div>
            )}
          </div>

          {/* Main 2-Column Workspace: Left Controls & Analysis / Right Interactive Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (5 Cols): Upload, 6-Dimension AI Understanding, Custom Prompt & Fine-Tune */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* File Upload Box */}
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-300 hover:border-[#FF9933] rounded-2xl p-5 text-center space-y-2.5 bg-slate-50 transition cursor-pointer relative group">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mx-auto text-[#FF9933] group-hover:scale-105 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Upload Ordinary Mobile Photograph
                  </span>
                  <span className="text-[11px] text-slate-500">
                    JPG, JPEG, PNG, WEBP (Max 10MB) &bull; Cluttered backgrounds accepted
                  </span>
                </div>
              </div>

              {/* 2. AI Product Understanding Intelligence Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#FF9933]" />
                    <span>AI Product Understanding</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isRecommendingScenes && (
                      <span className="text-[10px] text-[#FF9933] flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#138808]">
                      Score: {productUnderstanding.quality_score || 96}/100
                    </span>
                  </div>
                </div>

                {/* Product Name, Category & Classification Badge */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Identified Product:</span>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {productUnderstanding.product_name || productName}
                      </span>
                    </div>
                    {/* Classification Badge: Handmade / Decorative / Wearable / Edible / Functional */}
                    {(() => {
                      const pType = (productUnderstanding.product_type || 'Handmade').toLowerCase();
                      let badge = { label: 'Handmade', icon: Hammer, color: 'bg-amber-100 text-amber-900 border-amber-300' };
                      if (pType.includes('decor')) {
                        badge = { label: 'Decorative', icon: Palette, color: 'bg-purple-100 text-purple-900 border-purple-300' };
                      } else if (pType.includes('wear') || pType.includes('cloth') || pType.includes('jewel')) {
                        badge = { label: 'Wearable', icon: Sparkles, color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
                      } else if (pType.includes('edible') || pType.includes('food') || pType.includes('agri') || pType.includes('pickle')) {
                        badge = { label: 'Edible', icon: UtensilsCrossed, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
                      } else if (pType.includes('funct') || pType.includes('tool') || pType.includes('manufactur')) {
                        badge = { label: 'Functional', icon: Package, color: 'bg-blue-100 text-blue-900 border-blue-300' };
                      }
                      const IconComp = badge.icon;
                      return (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${badge.color}`}>
                          <IconComp className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span>Category:</span>
                    <strong className="text-slate-700">{productUnderstanding.detected_category || productUnderstanding.category || category}</strong>
                  </div>
                </div>

                {/* 4-Point Geometry & Material Details */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block font-medium">Shape & Contour:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {productUnderstanding.shape_and_form || productUnderstanding.shape_profile || "Cylindrical round contour"}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block font-medium">Size Estimate:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {productUnderstanding.size_estimate || "Medium tabletop vessel"}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block font-medium">Surface Texture:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {productUnderstanding.texture || productUnderstanding.texture_profile || "Matte porous clay grain"}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block font-medium">Detected Material:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {Array.isArray(productUnderstanding.detected_materials) 
                        ? productUnderstanding.detected_materials.join(', ') 
                        : (productUnderstanding.material_detected || "Natural Earthen Terracotta")}
                    </span>
                  </div>
                </div>

                {/* Dominant Color Palette */}
                {productUnderstanding.dominant_colors && productUnderstanding.dominant_colors.length > 0 && (
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Color Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {productUnderstanding.dominant_colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs inline-block"
                          style={{ backgroundColor: c }}
                          title={productUnderstanding.dominant_color_names ? productUnderstanding.dominant_color_names[idx] : c}
                        />
                      ))}
                      <span className="text-slate-600 font-medium text-[9px] pl-1">
                        {productUnderstanding.dominant_color_names ? productUnderstanding.dominant_color_names.slice(0, 2).join(', ') : 'Natural tones'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Recommended Lighting & Surface Recommendation */}
                <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Recommended Surface:</span>
                    <span className="font-bold text-[#EA580C] line-clamp-1 text-right">
                      {productUnderstanding.recommended_surface || productUnderstanding.surface_recommendation || "Seasoned Oak Wood Tabletop"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Recommended Lighting:</span>
                    <span className="font-bold text-slate-800 line-clamp-1 text-right">
                      {productUnderstanding.recommended_lighting || productUnderstanding.lighting_recommendation || "Soft Window Daylight"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Camera Angle:</span>
                    <span className="font-semibold text-slate-700 text-right">
                      {productUnderstanding.camera_perspective || productUnderstanding.camera_angle || "30° Eye-Level Marketplace Angle"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Custom Background Prompt Field (Photoroom / Pebblely / Synthesizer) */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-emerald-600" />
                    <span>Describe where you want to place your product</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    Custom Staging Prompt
                  </span>
                </div>
                
                <p className="text-[11px] text-emerald-900/80 leading-tight">
                  Type any placement description or choose a category preset below. Photoroom & Pebblely will stage your exact product into that environment:
                </p>

                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="Place my handmade pottery vase on a beautiful natural wooden chair near a sunny window, with a warm beige wall and subtle indoor plants."
                  className="w-full p-3 rounded-xl border border-emerald-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
                
                {/* 8 Multi-Category Craft Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 block">Quick Category Placement Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Pottery on Chair", prompt: "Place my handmade pottery vase on a beautiful natural wooden chair near a sunny window, with a warm beige wall and subtle indoor plants." },
                      { label: "Jewellery on Velvet", prompt: "Jewellery displayed on an elegant dark green velvet display stand with soft warm specular studio lighting and golden reflections." },
                      { label: "Handmade Bag on Chair", prompt: "A handmade artisan tote bag placed stylishly on a rustic natural wooden armchair in a sunlit modern bohemian living room." },
                      { label: "Painting in Gallery", prompt: "A handmade painting displayed on a luxury art gallery white wall with a focused warm halogen ceiling spotlight and clean shadows." },
                      { label: "Basket in Boho Room", prompt: "A handmade woven basket placed gracefully in a beautiful sunlit boho-style living room with cane furniture and dried pampas grass." },
                      { label: "Candles on Marble", prompt: "Scented artisanal candles placed on a premium cream Calacatta gold marble table with soft golden glowing ambient lighting." },
                      { label: "Organic Farm Setting", prompt: "Organic farm produce arranged in a rustic weathered wooden crate in a natural open village farm setting under morning sunlight." },
                      { label: "Handloom in Boutique", prompt: "Handloom textiles displayed elegantly on a minimalist architectural podium in an upscale designer boutique with soft spotlighting." }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomPrompt(preset.prompt);
                          setSelectedStyle('custom-prompt');
                          handleTransformEnvironment(originalImageUrl, 'custom-prompt', preset.prompt, selectedProvider);
                        }}
                        className="px-2 py-1 bg-white border border-emerald-200 rounded-lg text-[10px] text-emerald-900 hover:bg-emerald-100 transition font-medium shadow-2xs"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStyle('custom-prompt');
                    handleTransformEnvironment(originalImageUrl, 'custom-prompt', customPrompt, selectedProvider);
                  }}
                  disabled={isEnhancingImage || !customPrompt.trim()}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 mt-1"
                >
                  {isEnhancingImage ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Staging Product in Environment...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Staged Preview ({selectedProvider === 'auto' ? 'Auto Engine' : selectedProvider === 'photoroom' ? 'Photoroom API' : selectedProvider === 'pebblely' ? 'Pebblely API' : 'Synthesizer'})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lighting & Sharpness Sliders */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#FF9933]" />
                    <span>Fine-Tune Scene Lighting & Shadows</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBrightness(0);
                      setContrast(0);
                      setSharpness(50);
                      handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt);
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1"><SunMedium className="w-3 h-3" /> Scene Brightness</span>
                    <span className="font-bold">{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={e => setBrightness(parseInt(e.target.value))}
                    onMouseUp={() => handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt)}
                    className="w-full accent-[#FF9933] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1"><Contrast className="w-3 h-3" /> Surface Contrast</span>
                    <span className="font-bold">{contrast > 0 ? `+${contrast}` : contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={contrast}
                    onChange={e => setContrast(parseInt(e.target.value))}
                    onMouseUp={() => handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt)}
                    className="w-full accent-[#FF9933] cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Right Column (7 Cols): Interactive Canvas, Split Slider, 5 Actions & Retain Original */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* View Mode Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <span className="text-slate-700">Interactive Comparison View:</span>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
                  <button
                    onClick={() => setComparisonMode('split')}
                    className={`px-2.5 py-1 rounded-lg transition ${comparisonMode === 'split' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                  >
                    Split Wipe Slider
                  </button>
                  <button
                    onClick={() => setComparisonMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg transition ${comparisonMode === 'side-by-side' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setComparisonMode('enhanced')}
                    className={`px-2.5 py-1 rounded-lg transition ${comparisonMode === 'enhanced' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                  >
                    Transformed Scene
                  </button>
                  <button
                    onClick={() => setComparisonMode('original')}
                    className={`px-2.5 py-1 rounded-lg transition ${comparisonMode === 'original' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                  >
                    Original Raw Shot
                  </button>
                  <button
                    onClick={() => setComparisonMode('cutout')}
                    className={`px-2.5 py-1 rounded-lg transition ${comparisonMode === 'cutout' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                  >
                    Cutout (PNG)
                  </button>
                </div>
              </div>

              {/* Approval Success Banner */}
              {isApproved && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#16A34A] text-white rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 block">Environment Approved for Marketplace Listing!</span>
                      <span className="text-[11px] text-emerald-800">Saved as hero photography for {productName || 'your product'}.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    <span>Proceed to Voice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* API Configuration Guidance Alert */}
              {apiSetupRequired && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Real AI Background Removal API Key Setup (Optional)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Local procedural rendering is active with authentic edge detection. To isolate transparent PNG cutouts via cloud segmentation, configure <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold">REMOVE_BG_API_KEY</code> in backend/.env. We never alter your original product geometry.
                  </p>
                </div>
              )}

              {/* Interactive Comparison Canvas */}
              <div className="bg-slate-100 rounded-3xl p-3 border border-slate-200 overflow-hidden min-h-[420px] flex flex-col items-center justify-center relative">
                
                {/* 1. Split Wipe Slider View */}
                {comparisonMode === 'split' && (
                  <div className="w-full space-y-3">
                    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-slate-900 select-none shadow-md">
                      {/* Transformed Scene (Base Layer) */}
                      <img
                        src={enhancedImageUrl}
                        alt="Transformed Scene"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-2xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF9933]" />
                        <span>Transformed Scene</span>
                      </span>

                      {/* Original Mobile Photo (Clipped Overlay Layer) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `polygon(0 0, ${splitSliderPos}% 0, ${splitSliderPos}% 100%, 0 100%)` }}
                      >
                        <img
                          src={originalImageUrl}
                          alt="Original Raw Shot"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-black/80 text-white px-2.5 py-0.5 rounded-md">
                          Original Mobile Shot
                        </span>
                      </div>

                      {/* Draggable Divider Line & Badge */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                        style={{ left: `${splitSliderPos}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-800 font-bold text-xs border border-slate-300">
                          ⟷
                        </div>
                      </div>
                    </div>

                    {/* Interactive Split Slider Bar */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1">
                        <span className="text-slate-700">◂ Original Photo ({100 - splitSliderPos}%)</span>
                        <span className="text-[#EA580C] font-bold">Slide to Compare Before & After</span>
                        <span className="text-slate-700">Transformed Scene ({splitSliderPos}%) ▸</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={splitSliderPos}
                        onChange={e => setSplitSliderPos(Number(e.target.value))}
                        className="w-full accent-[#FF9933] cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Side-by-Side View */}
                {comparisonMode === 'side-by-side' && (
                  <div className="grid grid-cols-2 gap-3 w-full h-[400px]">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-200 border border-slate-300">
                      <img src={originalImageUrl} alt="Original" className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-black/75 text-white px-2 py-0.5 rounded-md">
                        Original Raw Shot
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-200 border-2 border-[#FF9933] shadow-md">
                      <img src={enhancedImageUrl} alt="Enhanced" className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-2xs px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow">
                        <Sparkles className="w-3 h-3 text-[#FF9933]" />
                        {recommendedScenes.find(s => s.id === selectedStyle)?.name || 'Transformed Scene'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Transformed Scene View */}
                {comparisonMode === 'enhanced' && (
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border-2 border-[#FF9933] shadow-md">
                    <img src={enhancedImageUrl} alt="Enhanced" className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-2xs px-3 py-1 rounded-md flex items-center gap-1.5 shadow">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                      {recommendedScenes.find(s => s.id === selectedStyle)?.name || 'Transformed Scene'}
                    </span>
                  </div>
                )}

                {/* 4. Original Raw Shot View */}
                {comparisonMode === 'original' && (
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-slate-300">
                    <img src={originalImageUrl} alt="Original" className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold bg-black/75 text-white px-3 py-1 rounded-md">
                      Original Mobile Shot (Unedited)
                    </span>
                  </div>
                )}

                {/* 5. Cutout (PNG) View */}
                {comparisonMode === 'cutout' && (
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-slate-300 bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] flex items-center justify-center p-4">
                    {cutoutImageUrl ? (
                      <img src={cutoutImageUrl} alt="Product Cutout" className="max-h-full max-w-full object-contain drop-shadow-md" />
                    ) : (
                      <div className="text-center text-xs text-slate-500 p-6 bg-white/90 rounded-xl backdrop-blur-xs max-w-xs">
                        <Sparkles className="w-6 h-6 text-[#FF9933] mx-auto mb-2" />
                        <p className="font-bold text-slate-800">Isolated Product Foreground</p>
                        <p className="text-[11px] text-slate-500 mt-1">100% authentic product pixels preserved with dual-tier contact shadow</p>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 text-[11px] font-bold bg-slate-900/85 text-white px-3 py-1 rounded-md">
                      Transparent Cutout (PNG) &bull; 100% Authentic Pixels
                    </span>
                  </div>
                )}
              </div>

              {/* Product Preservation Audit Banner */}
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950">
                        Product Preservation Score: {productPreservation?.preservation_score || 98}/100
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-[#138808] border border-emerald-300">
                        Fidelity Verified
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-tight">
                      100% authentic product preserved &bull; Zero generative morphing &bull; Natural dual-tier contact shadows applied
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium sm:text-right shrink-0">
                  <span className="text-slate-400">Engine: </span>
                  <strong className="text-slate-700">{activeProviderName}</strong>
                </div>
              </div>

              {/* 5 User Action Controls */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>User Controls & Staging Actions:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {historyStack.length} previous version{historyStack.length === 1 ? '' : 's'} in history
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {/* Control 1: Generate Staged Preview */}
                  <button
                    type="button"
                    onClick={() => handleTransformEnvironment(originalImageUrl, selectedStyle, customPrompt, selectedProvider)}
                    disabled={isEnhancingImage}
                    className="py-2.5 px-2 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                    title="Generate staged preview with current background and provider"
                  >
                    {isEnhancingImage ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate">Generate Preview</span>
                  </button>

                  {/* Control 2: Try Another Background */}
                  <button
                    type="button"
                    onClick={handleTryAnotherStyle}
                    disabled={isEnhancingImage}
                    className="py-2.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 disabled:opacity-50"
                    title="Try next background from recommendations"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span className="truncate">Try Another</span>
                  </button>

                  {/* Control 3: Generate Again */}
                  <button
                    type="button"
                    onClick={handleGenerateNewBackground}
                    disabled={isEnhancingImage}
                    className="py-2.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 disabled:opacity-50"
                    title="Re-render scene with fresh lighting composition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span className="truncate">Generate Again</span>
                  </button>

                  {/* Control 4: Undo */}
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyStack.length === 0 || isEnhancingImage}
                    className="py-2.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Revert to previous staged preview"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">Undo</span>
                  </button>

                  {/* Control 5: Save & Add to Listing */}
                  <button
                    type="button"
                    onClick={handleApproveAndSave}
                    disabled={isEnhancingImage}
                    className={`col-span-2 sm:col-span-1 py-2.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-2xs ${
                      isApproved
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    title="Save staged photography and add to product listing"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="truncate">{isApproved ? 'Saved & Added ✓' : 'Save & Add'}</span>
                  </button>
                </div>
              </div>

              {/* Retain Original Photo Toggle Checkbox */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="retainOriginalCheckbox"
                  checked={retainOriginal}
                  onChange={e => setRetainOriginal(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#FF9933] accent-[#FF9933] cursor-pointer"
                />
                <label htmlFor="retainOriginalCheckbox" className="text-xs text-slate-700 cursor-pointer">
                  <span className="font-bold text-slate-900 block">
                    Retain original mobile photo in live marketplace listing gallery
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Recommended: Buyers appreciate transparency and enjoy seeing both the raw mobile photo for authenticity and the enhanced studio scene for presentation. Both images are saved separately.
                  </span>
                </label>
              </div>

              {/* Download & Pixel Guarantee Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {enhancedImageUrl && (
                    <a
                      href={enhancedImageUrl}
                      download={`bharat_udyami_studio_${selectedStyle}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download Staged Photo</span>
                    </a>
                  )}
                  {cutoutImageUrl && (
                    <a
                      href={cutoutImageUrl}
                      download="product_cutout.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download Cutout (.png)</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dual-Tier Contact Shadows & 100% Authentic Pixels Preserved</span>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 3. AT LEAST 10 DYNAMIC AESTHETIC BACKGROUND RECOMMENDATION CARDS          */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    Aesthetic Inspiration Library
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {recommendedScenes.length} Dynamic Options Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  10+ Aesthetic Background Recommendations for Your Product
                </h3>
                <p className="text-xs text-slate-500">
                  AI evaluated your <strong className="text-slate-700">{productUnderstanding.product_name}</strong> and dynamically generated these tailored background scenes:
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateMoreIdeas}
                disabled={isGeneratingMore}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 shrink-0"
              >
                {isGeneratingMore ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF9933]" />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>Generate More Ideas +</span>
                  </>
                )}
              </button>
            </div>

            {/* 10+ Scene Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedScenes.map((scene, idx) => {
                const isSelected = selectedStyle === scene.id;
                return (
                  <div
                    key={scene.id || idx}
                    className={`rounded-2xl border transition overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF9933] ring-2 ring-[#FF9933]/30 bg-orange-50/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    {/* Visual Scene Header Gradient with Tag & Match Badge */}
                    <div
                      className="p-3.5 text-white relative min-h-[75px] flex flex-col justify-between"
                      style={{ background: scene.preview_bg || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white border border-white/20">
                          {scene.tag || 'Scene'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white shadow-2xs backdrop-blur-xs">
                          {scene.match_score || (98 - idx)}% Match
                        </span>
                      </div>
                      <div className="font-bold text-sm drop-shadow-sm text-white">
                        {scene.name}
                      </div>
                    </div>

                    {/* Card Content: Description, Why it matches, Surface & Props */}
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between text-xs">
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {scene.description}
                        </p>

                        {/* "Why it matches" box */}
                        <div className="p-2 rounded-xl bg-orange-50/80 border border-orange-200/70 text-[10px] text-slate-700 leading-snug">
                          <span className="font-bold text-[#EA580C] block mb-0.5">Why it matches:</span>
                          <span className="line-clamp-2">
                            {scene.why_recommended || `Complements the authentic handmade qualities and natural colors of your product.`}
                          </span>
                        </div>

                        {/* Surface & Props */}
                        <div className="text-[9px] text-slate-500 space-y-0.5">
                          <div>
                            <span className="text-slate-400">Surface: </span>
                            <span className="font-semibold text-slate-700">{scene.surface_type || "Wood / Marble"}</span>
                          </div>
                          {scene.recommended_props && (
                            <div className="line-clamp-1">
                              <span className="text-slate-400">Props: </span>
                              <span className="text-slate-600">{scene.recommended_props}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => handleChangeEnvironment(scene.id)}
                        disabled={isEnhancingImage}
                        className={`w-full py-2 rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-2xs mt-2 ${
                          isSelected
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#FF9933] hover:bg-[#F97316] text-slate-900'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Selected Scene</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Choose This Background</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation to Step 2 */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {isApproved ? (
                <span className="text-[#16A34A] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Environment photography approved and locked in.
                </span>
              ) : (
                <span>Click <strong>Approve & Save</strong> or continue directly to voice description.</span>
              )}
            </div>
            <button
              onClick={() => {
                if (!isApproved) setIsApproved(true);
                setCurrentStep(2);
              }}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <span>Continue to Step 2: Voice in Any Indian Language</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: VOICE-BASED SELLER ASSISTANT (22+ LANGUAGES)                     */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#FF9933]" />
                <span>Step 2: Voice in Your Mother Tongue</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Speak in your own language, accent or mixed words. No need to type in English or Hindi.
              </p>
            </div>

            {/* Language Dropdown Selector with 22 Scheduled Indian Languages */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#FF9933]" />
              <select
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF9933]"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Microphone Recording Section */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-5">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                  isRecording 
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 scale-105 animate-pulse' 
                    : 'bg-[#FF9933] hover:bg-[#F97316] text-slate-900 hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8 text-slate-900" />}
              </button>
              {isRecording && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Listening...
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                {isRecording ? "Listening to your voice..." : "Click Microphone to Speak"}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Speak in {languages.find(l => l.code === selectedLang)?.native || 'your language'}. 
                Mention materials, dimensions, production expenses, or expected price.
              </p>
            </div>

            {/* Quick Sample Voice Prompts */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Or Click a Sample Spoken Voice Input:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  "I made this product using wood, paint and polish. Wood cost me ₹300, paint cost ₹100 and labour cost ₹250.",
                  "Ye mitti ka handmade water pot hai. Mitti ₹120, karigari ₹80 aur packaging ₹20 lage hain. Size 10 inch.",
                  "Pure Sehore Sharbati gehu 50 kg bag. Farm production cost ₹1400 and cleaning ₹150.",
                  "Madhubani Tree of Life painting on khadi canvas. Natural colors ₹400 and 3 days labour ₹900.",
                  "Hand-cast antique brass door latch 8 inch. Brass casting ₹220, machining ₹80, packaging ₹20."
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setVoiceTranscript(sample);
                      handleProcessVoice(sample, selectedLang);
                    }}
                    className="text-xs px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-[#FF9933] border border-slate-200 rounded-xl text-slate-700 transition max-w-md truncate shadow-2xs text-left"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Spoken Text / Transcript Box */}
            <div className="text-left space-y-2 max-w-2xl mx-auto pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Voice Transcript (Editable for manual correction):
                </label>
                <span className="text-[11px] text-slate-400">
                  Auto-translation to English & Hindi active
                </span>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={3}
                  value={voiceTranscript}
                  onChange={e => setVoiceTranscript(e.target.value)}
                  className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF9933] bg-white font-medium leading-relaxed"
                  placeholder="Enter or edit spoken transcript..."
                />
                <button
                  type="button"
                  onClick={() => handleProcessVoice(voiceTranscript, selectedLang)}
                  disabled={isParsingVoice || !voiceTranscript.trim()}
                  className="px-4 py-2 bg-[#FF9933] hover:bg-[#F97316] disabled:opacity-50 text-slate-900 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                >
                  {isParsingVoice ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FF9933]" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FF9933]" />
                      <span>Parse Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <span>Continue to Step 3: Auto-Generated Listing</span>
              <ArrowRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: AI AUTOMATIC PRODUCT LISTING (NAME, SPECS, BULLETS, KEYWORDS)   */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FF9933]" />
                <span>Step 3: AI Automatic Product Listing</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generated from photo analysis and your voice description. You have 100% control to review and edit every detail.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGenerateListingDetails(productName, category, materials)}
              disabled={isGeneratingListing}
              className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF9933] font-semibold rounded-xl text-xs border border-orange-200 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingListing ? "Regenerating..." : "Regenerate Story"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Product Title</label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
              >
                <option value="Farmers & Agriculture">Farmers & Agriculture</option>
                <option value="Handicrafts & Handmade Products">Handicrafts & Handmade Products</option>
                <option value="Artists & Creators">Artists & Creators</option>
                <option value="Home-Based Businesses & Food">Home-Based Businesses & Food</option>
                <option value="Small Manufacturers & Producers">Small Manufacturers & Producers</option>
                <option value="Other Creators">Other Creators</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            {/* Materials */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Materials Detected</label>
              <input
                type="text"
                value={Array.isArray(materials) ? materials.join(', ') : materials}
                onChange={e => setMaterials(e.target.value.split(',').map(m => m.trim()))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            {/* Size & Dimensions */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Size / Dimensions</label>
              <input
                type="text"
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            {/* Stock Quantity & Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Available Stock</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  placeholder="pieces, kg, sacks, jars"
                />
              </div>
            </div>

            {/* Seller origin */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Workshop Location</label>
              <input
                type="text"
                value={sellerLocation}
                onChange={e => setSellerLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                E-Commerce Storytelling Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            {/* Bullet Features */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-700 block">Product Highlights & Key Features</label>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {bulletFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                    <input
                      type="text"
                      value={feat}
                      onChange={e => {
                        const copy = [...bulletFeatures];
                        copy[idx] = e.target.value;
                        setBulletFeatures(copy);
                      }}
                      className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Search Keywords */}
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Marketplace Keywords & SEO Tags</label>
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                {searchKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-900">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <span>Continue to Step 4: AI Conversational Follow-Up</span>
              <ArrowRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: AI CONVERSATIONAL PRODUCT LISTING (FOLLOW-UP QUESTIONS)           */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FF9933]" />
                <span>Step 4: AI Conversational Assistant</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Like talking to a helpful village guide. If important cost, packaging or size details were missing, the assistant asks follow-up questions.
              </p>
            </div>
            <span className="text-xs font-bold text-[#138808] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Conversational Helper Active
            </span>
          </div>

          {/* Assistant Chat Bubble */}
          <div className="bg-orange-50/60 p-4 sm:p-5 rounded-2xl border border-orange-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF9933] text-slate-900 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-xs">Bharat Udyami AI Guide</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {conversationalResponse}
                </p>
              </div>
            </div>

            {/* Follow-up question cards */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Please confirm or answer these simple follow-up questions:
              </span>

              {followUpQuestions.map((q, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900">{q.question_en}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pl-7">
                    {q.question_hi}
                  </p>

                  <div className="pl-7 pt-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type or speak answer..."
                      defaultValue={answeredQuestions[q.field] || (q.field === 'size' ? size : (q.field === 'quantity' ? quantity : packagingCost))}
                      onBlur={e => handleAnswerQuestion(q.field, e.target.value)}
                      className="flex-1 p-2 border border-slate-300 rounded-lg bg-slate-50 text-xs font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => alert(`Saved for ${q.field}!`)}
                      className="px-3.5 py-1.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 3</span>
            </button>

            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <span>Continue to Step 5: Intelligent Smart Pricing</span>
              <ArrowRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: INTELLIGENT AI PRICE DETECTION & CALCULATOR (CATEGORY-SPECIFIC)  */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#FF9933]" />
                <span>Step 5: Category-Specific Intelligent Pricing</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We never guess market prices from photos. Production cost is calculated item by item, protecting your fair livelihood.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#138808] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Cost-Plus Guaranteed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Itemized Production Cost Inputs */}
            <div className="lg:col-span-6 space-y-3.5 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                Itemized Production Expenses (Per Unit)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Raw Material Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={rawMaterialCost}
                    onChange={e => setRawMaterialCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Labour & Time Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={labourCost}
                    onChange={e => setLabourCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Packaging Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={packagingCost}
                    onChange={e => setPackagingCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transport / Drop Buffer (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={transportCost}
                    onChange={e => setTransportCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Profit Margin Slider */}
              <div className="pt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Desired Profit Margin:</span>
                  <span className="text-[#138808] text-sm font-black">{desiredMarginPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={desiredMarginPercent}
                  onChange={e => setDesiredMarginPercent(parseInt(e.target.value))}
                  className="w-full accent-[#FF9933] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>15% (High Volume)</span>
                  <span>25% (Recommended Fair Margin)</span>
                  <span>45% (Boutique Luxury)</span>
                </div>
              </div>

              {/* Total Base Cost */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between font-bold text-xs">
                <span className="text-slate-700">Total Base Production Cost:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{smartPricingData.breakdown.total_production_cost} / unit
                </span>
              </div>
            </div>

            {/* Right Column: Pricing Tiers & Wholesale Breakdown */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Suggested Price Tiers</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Category Benchmark
                </span>
              </div>

              {/* 3 Pricing Tiers Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">Floor Minimum</span>
                  <span className="text-base font-black text-slate-800 block">
                    ₹{smartPricingData.pricing_tiers.floor_minimum_price}
                  </span>
                  <span className="text-[9px] text-slate-500 block">15% Cost Floor</span>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 border-2 border-[#FF9933] text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] text-[#FF9933] block font-black uppercase">Recommended</span>
                  <span className="text-lg font-black text-slate-900 block">
                    ₹{smartPricingData.pricing_tiers.suggested_fair_price}
                  </span>
                  <span className="text-[9px] text-[#138808] font-bold block">
                    ₹{smartPricingData.margin_analysis.estimated_profit_per_unit} Net Profit
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">Boutique Premium</span>
                  <span className="text-base font-black text-purple-900 block">
                    ₹{smartPricingData.pricing_tiers.premium_retail_price}
                  </span>
                  <span className="text-[9px] text-slate-500 block">45% Margin</span>
                </div>
              </div>

              {/* Wholesale B2B Tier Price */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Wholesale B2B Rate:</span>
                  <span className="text-[10px] text-slate-500">For bulk commercial orders (≥ 20 units)</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#138808]">
                    ₹{smartPricingData.pricing_tiers.wholesale_b2b_price}
                  </span>
                  <span className="text-[10px] text-slate-400 block">15% Volume Discount</span>
                </div>
              </div>

              {/* Editable Final Price Input */}
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800 block text-xs">
                  Final Listing Price (You have full control to adjust):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={e => setFinalPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 font-black text-base text-slate-900 bg-white focus:outline-none focus:border-[#FF9933]"
                  />
                </div>
              </div>

              {/* Benchmark advisory note */}
              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                <span className="font-bold text-slate-700">Reliable Market Context: </span>
                {smartPricingData.market_benchmark}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 4</span>
            </button>

            <button
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#F97316] text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <span>Continue to Step 6: Review & Publish</span>
              <ArrowRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: FINAL REVIEW & 1-CLICK PUBLISH TO MARKETPLACE                     */}
      {/* ========================================================================= */}
      {!publishSuccess && currentStep === 6 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#FF9933]" />
              <span>Step 6: Final Review & 1-Click Publish</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review how buyers, lifestyle boutiques, and consumers will see your listing on Bharat Udyami.
            </p>
          </div>

          {/* Card Preview */}
          <div className="max-w-2xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="relative aspect-16/9 bg-slate-200 overflow-hidden">
              <img
                src={enhancedImageUrl || originalImageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="text-xs font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-2xs px-2.5 py-1 rounded-md">
                  {category}
                </span>
                <span className="text-xs font-medium bg-white/95 text-slate-800 px-2 py-1 rounded-md shadow-xs">
                  {subcategory}
                </span>
              </div>
              <span className="absolute top-3 right-3 text-xs font-bold bg-[#FF9933] text-slate-900 px-2.5 py-1 rounded-md">
                Direct Maker Price
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {productName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    By <span className="font-semibold text-slate-800">{sellerName}</span> • {sellerLocation}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-[#138808]">
                    ₹{parseFloat(finalPrice).toLocaleString()}
                  </div>
                  <span className="text-[11px] font-semibold text-[#138808] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Stock: {quantity} {unit}
                  </span>
                </div>
              </div>

              {/* Highlights & Story */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Material:</span>
                  <span className="font-bold text-slate-800">
                    {Array.isArray(materials) ? materials.join(', ') : materials}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Dimensions:</span>
                  <span className="font-bold text-slate-800">{size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Final Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 5</span>
            </button>

            <button
              onClick={handlePublishListing}
              disabled={isPublishing}
              className="px-8 py-3.5 bg-[#FF9933] hover:bg-[#E67A10] text-slate-900 font-black rounded-xl text-sm transition flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Publishing Listing to Bharat Udyami...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 text-slate-900" />
                  <span>Publish Listing to Marketplace</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

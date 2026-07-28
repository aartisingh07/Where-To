import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiNavigation, FiAlertCircle, FiRefreshCw, FiArrowRight, FiArrowLeft, FiSearch, FiCompass } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useGeolocation from '../hooks/useGeolocation';
import { placeService } from '../services/placeService';
import PlaceCard from '../components/places/PlaceCard';

// ─── Config Data ────────────────────────────────────────────────
const groupCategories = [
  {
    id: 'friends',
    emoji: '👥',
    label: 'Friends',
    tagline: 'Squad Outings & Fun',
    desc: 'Malls, concerts, trekking, sports & street food crawls',
  },
  {
    id: 'couples',
    emoji: '❤️',
    label: 'Couples',
    tagline: 'Romantic Getaways',
    desc: 'Beaches, cozy cafes, fine dining & sunset viewpoints',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧‍👦',
    label: 'Family',
    tagline: 'Quality Family Time',
    desc: 'Family beaches, theme parks, malls, zoos & picnic spots',
  },
];

const vibeOptions = {
  couples: [
    { id: 'beaches',          emoji: '🏖️', label: 'Beaches & Sunsets',     desc: 'Sandy shorelines, ocean waves, and romantic sunset walks' },
    { id: 'cafes',            emoji: '☕', label: 'Cozy Cafes & Bakery',  desc: 'Aromatic coffee, sweet pastries, and quiet conversations' },
    { id: 'romantic_dining',  emoji: '🍷', label: 'Fine Dining',          desc: 'Candlelight dinners and premium gourmet restaurants' },
    { id: 'scenic_spots',     emoji: '🌄', label: 'Scenic Viewpoints',     desc: 'Panoramic skyline views, lush gardens, and photo spots' },
    { id: 'nature',           emoji: '🌟', label: 'Stargazing & Nature',    desc: 'Quiet lakesides, parks, and starry outdoor escapes' },
  ],
  family: [
    { id: 'beaches',          emoji: '🏖️', label: 'Family Beaches',       desc: 'Safe, clean beaches with watersports and sunset views' },
    { id: 'parks',            emoji: '🎢', label: 'Amusement & Parks',     desc: 'Theme parks, green gardens, and fun outdoor play areas' },
    { id: 'malls',            emoji: '🛍️', label: 'Malls & Shopping',     desc: 'Spacious malls with kid zones, gaming arcades, and food courts' },
    { id: 'zoos',             emoji: '🦁', label: 'Zoos & Aquariums',      desc: 'Exciting wildlife, aquariums, and animal parks' },
    { id: 'museums',          emoji: '🏛️', label: 'Museums & Monuments',   desc: 'Historical heritage, science centers, and art galleries' },
    { id: 'picnic',           emoji: '🍉', label: 'Picnic Spots',          desc: 'Lush botanical gardens, lakes, and relaxing lawns' },
  ],
  friends: [
    { id: 'malls',            emoji: '🛍️', label: 'Malls & Arcades',      desc: 'Shopping malls, bowling, arcade gaming, and food courts' },
    { id: 'concerts',         emoji: '🎵', label: 'Concerts & Clubs',     desc: 'Live music venues, bars, pubs, and high-energy nightlife' },
    { id: 'trekking',         emoji: '🧗', label: 'Adventurous Trekking', desc: 'Mountain peaks, forest trails, and hiking adventures' },
    { id: 'sports',           emoji: '⚽', label: 'Sports & Turf Games',  desc: 'Turf grounds, sports arenas, and action activities' },
    { id: 'food_crawl',       emoji: '🍕', label: 'Street Food Crawl',    desc: 'Local street food, junk food hubs, and popular cafes' },
    { id: 'camping',          emoji: '⛺', label: 'Camping & Outdoors',   desc: 'Outdoor bonfires, lakeside camping, and nature trails' },
  ],
};

const distances = [
  { id: 2000,  label: 'Nearby',    desc: 'Within 2 km',   emoji: '🚶' },
  { id: 5000,  label: 'Mid-range', desc: 'Within 5 km',   emoji: '🛵' },
  { id: 10000, label: 'Anywhere',  desc: 'Within 10 km',  emoji: '🚗' },
];

const featuredVibePlaces = {
  // Couples
  beaches: [
    { name: 'Marine Drive', city: 'Mumbai', query: 'Marine Drive, Mumbai, India', emoji: '🌅' },
    { name: 'Baga Beach', city: 'Goa', query: 'Baga Beach, Goa, India', emoji: '🏖️' },
    { name: 'Radhanagar Beach', city: 'Andaman', query: 'Radhanagar Beach, Andaman, India', emoji: '🌊' },
    { name: 'Palolem Beach', city: 'Goa', query: 'Palolem Beach, Goa, India', emoji: '🏝️' },
  ],
  cafes: [
    { name: 'Bandra Coffee House', city: 'Mumbai', query: 'Bandra, Mumbai, India', emoji: '☕' },
    { name: 'Cyber Hub Cafes', city: 'Gurugram', query: 'Cyber Hub, Gurugram, India', emoji: '🥐' },
    { name: 'Koregaon Park Cafes', city: 'Pune', query: 'Koregaon Park, Pune, India', emoji: '🍩' },
  ],
  romantic_dining: [
    { name: 'Aer Rooftop Lounge', city: 'Mumbai', query: 'Aer Rooftop, Mumbai, India', emoji: '🍷' },
    { name: 'Olive Bar & Kitchen', city: 'Delhi', query: 'Olive Bar Kitchen, Delhi, India', emoji: '🕯️' },
    { name: 'Thalassa Waterfront', city: 'Goa', query: 'Thalassa, Goa, India', emoji: '🌅' },
  ],
  scenic_spots: [
    { name: 'Bandra Fort Sunset', city: 'Mumbai', query: 'Bandra Fort, Mumbai, India', emoji: '🌄' },
    { name: 'Tiger Point Views', city: 'Lonavala', query: 'Tiger Point, Lonavala, India', emoji: '⛰️' },
    { name: 'Nandi Hills Viewpoint', city: 'Bangalore', query: 'Nandi Hills, Bangalore, India', emoji: '🌅' },
  ],

  // Family
  parks: [
    { name: 'Wonderla Amusement Park', city: 'Bangalore', query: 'Wonderla, Bangalore, India', emoji: '🎢' },
    { name: 'Imagicaa World Theme Park', city: 'Lonavala', query: 'Imagicaa, Lonavala, India', emoji: '🎠' },
    { name: 'Sanjay Gandhi National Park', city: 'Mumbai', query: 'Sanjay Gandhi National Park, Mumbai, India', emoji: '🌳' },
  ],
  malls: [
    { name: 'Phoenix Palladium Mall', city: 'Mumbai', query: 'Phoenix Palladium, Mumbai, India', emoji: '🛍️' },
    { name: 'DLF Mall of India', city: 'Noida', query: 'DLF Mall of India, Noida, India', emoji: '🏬' },
    { name: 'Lulu International Mall', city: 'Kochi', query: 'Lulu Mall, Kochi, India', emoji: '🍿' },
  ],
  zoos: [
    { name: 'Mysore Zoo & Sanctuary', city: 'Karnataka', query: 'Mysore Zoo, Karnataka, India', emoji: '🦁' },
    { name: 'Veermata Jijabai Zoo', city: 'Mumbai', query: 'Byculla Zoo, Mumbai, India', emoji: '🦒' },
  ],

  // Friends
  concerts: [
    { name: 'Hard Rock Cafe', city: 'Mumbai', query: 'Hard Rock Cafe, Mumbai, India', emoji: '🎸' },
    { name: 'Hauz Khas Social Pub', city: 'Delhi', query: 'Hauz Khas Social, Delhi, India', emoji: '🎧' },
    { name: 'Tito’s Nightclub Lane', city: 'Goa', query: 'Titos Lane, Goa, India', emoji: '🍹' },
  ],
  trekking: [
    { name: 'Sinhagad Fort Trek', city: 'Pune', query: 'Sinhagad Fort, Pune, India', emoji: '🧗' },
    { name: 'Rajmachi Fort Trail', city: 'Lonavala', query: 'Rajmachi, Lonavala, India', emoji: '🎒' },
    { name: 'Triund Hill Trek', city: 'Himachal', query: 'Triund, Dharamshala, India', emoji: '🏔️' },
  ],
  sports: [
    { name: 'Padel & Turf Arena', city: 'Mumbai', query: 'Turf Arena, Mumbai, India', emoji: '⚽' },
    { name: 'Smaaash Arcade', city: 'Gurugram', query: 'Smaaash, Gurugram, India', emoji: '🎳' },
  ],
  food_crawl: [
    { name: 'Mohammad Ali Road Street Food', city: 'Mumbai', query: 'Mohammad Ali Road, Mumbai, India', emoji: '🍕' },
    { name: 'Chandni Chowk Food Crawl', city: 'Delhi', query: 'Chandni Chowk, Delhi, India', emoji: '🥙' },
    { name: 'VV Puram Food Street', city: 'Bangalore', query: 'VV Puram, Bangalore, India', emoji: '🥞' },
  ],
};

// ─── Step Indicator ─────────────────────────────────────────────
const StepIndicator = ({ step, currentStep }) => (
  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300
    ${step < currentStep ? 'bg-primary-500 text-white shadow-glow-purple-sm' :
      step === currentStep ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-300' :
      'bg-white/5 text-white/30'}`}
  >
    {step < currentStep ? '✓' : step}
  </div>
);

// ─── Skeleton Loader ─────────────────────────────────────────────
const PlaceSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="h-2 bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 skeleton rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="h-3 skeleton rounded w-1/4" />
        </div>
      </div>
      <div className="h-3 skeleton rounded w-1/2" />
      <div className="h-10 skeleton rounded-xl" />
    </div>
  </div>
);

// ─── Main Explore Page ───────────────────────────────────────────
const Explore = () => {
  const [step, setStep] = useState(1);                      // 1 = Group, 2 = Vibe, 3 = Location, 4 = Results
  const [groupCategory, setGroupCategory] = useState(null);  // 'friends' | 'couples' | 'family'
  const [vibe, setVibe] = useState(null);                   // e.g. 'beaches', 'cafes', 'malls'
  const [distance, setDistance] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [resolvedLocationText, setResolvedLocationText] = useState('');
  const [locationMode, setLocationMode] = useState('current'); // 'current' (GPS) or 'custom' (Search)

  // Autocomplete states & refs
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeInputId, setActiveInputId] = useState(null);
  const typingTimeoutRef = useRef(null);

  const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation();

  // Handle Autocomplete Input
  const handleInputChange = (val, inputId) => {
    setLocationQuery(val);
    setActiveInputId(inputId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setSuggestionsLoading(true);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await placeService.getAutocompleteSuggestions(val, location?.lat, location?.lng);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);
  };

  const handleInputFocus = (inputId) => {
    setActiveInputId(inputId);
    if (locationQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSelectSuggestion = async (suggestion) => {
    setLocationQuery(suggestion.formatted);
    setShowSuggestions(false);
    setSuggestions([]);
    setLocationMode('custom');
    setStep(4);
    await fetchPlaces(location?.lat, location?.lng, suggestion.formatted);
  };

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Step 1: Select Group Category (Friends / Couples / Family)
  const handleGroupSelect = (groupId) => {
    setGroupCategory(groupId);
    setVibe(null); // Reset vibe when group changes
    setStep(2);
  };

  // Step 2: Select Vibe / Sub-category
  const handleVibeSelect = (vibeId) => {
    setVibe(vibeId);
    setLocationMode('current');
    setStep(3);
  };

  // Step 4: Automatically fetch places when Step 4 is reached and GPS location is available
  useEffect(() => {
    if (step === 4 && locationMode === 'current') {
      if (location.lat && location.lng) {
        fetchPlaces(location.lat, location.lng);
      } else if (geoError) {
        setError(geoError);
        setLoading(false);
      } else if (!geoLoading && !location.lat) {
        getLocation();
      }
    }
  }, [step, location.lat, location.lng, geoError, geoLoading, locationMode, distance, groupCategory, vibe]);

  // Core API call
  const fetchPlaces = async (lat, lng, searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const targetLat = lat || location?.lat;
      const targetLng = lng || location?.lng;
      const data = await placeService.getNearbyPlaces({
        lat: targetLat,
        lng: targetLng,
        locationQuery: searchQuery,
        groupCategory,
        vibe,
        distance,
      });
      setPlaces(data.places || []);
      
      if (data.resolvedLocation) {
        setResolvedLocationText(data.resolvedLocation.address);
      } else {
        setResolvedLocationText('');
      }

      if ((data.places || []).length === 0) {
        setError('No places found. Try selecting another vibe or searching a broader city area!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch places. Please try again.');
      toast.error('Could not load places. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search from Step 3
  const handleFindPlacesClick = async () => {
    setStep(4);
    setLoading(true);
    setError(null);

    if (locationMode === 'current') {
      if (location.lat) {
        await fetchPlaces(location.lat, location.lng);
      } else {
        getLocation();
      }
    } else {
      await fetchPlaces(location?.lat, location?.lng, locationQuery);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setLocationMode('custom');
    fetchPlaces(location?.lat, location?.lng, locationQuery);
  };

  const handleReset = () => {
    setStep(1);
    setGroupCategory(null);
    setVibe(null);
    setDistance(5000);
    setPlaces([]);
    setLocationQuery('');
    setResolvedLocationText('');
    setLocationMode('current');
    setError(null);
    setLoading(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionsLoading(false);
    setActiveInputId(null);
  };

  const handleFeaturedSpotClick = async (spot) => {
    setLocationQuery(spot.query);
    setLocationMode('custom');
    setStep(4);
    await fetchPlaces(location?.lat, location?.lng, spot.query);
  };

  const selectedGroup = groupCategories.find((g) => g.id === groupCategory);
  const currentVibeList = vibeOptions[groupCategory] || [];
  const selectedVibe = currentVibeList.find((v) => v.id === vibe);
  const selectedDist = distances.find((d) => d.id === distance);
  const currentFeaturedList = (selectedVibe && featuredVibePlaces[selectedVibe.id]) || [];

  return (
    <div className="min-h-screen bg-dark-900 bg-grid pt-24 pb-12 px-4">
      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-neon-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
            <FiCompass size={14} />
            Place Explorer & Recommendations
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-3">
            Where are you heading?
          </h1>
          <p className="text-slate-600 dark:text-white/40 text-lg">
            Discover incredible spots curated for Friends, Couples, and Family.
          </p>
        </div>

        {/* Step Progress Tracker */}
        {step <= 3 && (
          <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
            {['Group', 'Vibe', 'Location'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <StepIndicator step={i + 1} currentStep={step} />
                  <span className={`text-sm font-semibold ${i + 1 === step ? 'text-primary-400 font-bold' : i + 1 < step ? 'text-slate-600 dark:text-white/40' : 'text-slate-400 dark:text-white/20'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`w-12 sm:w-20 h-px ${i + 1 < step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'} mb-4 transition-colors`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Choose Group Category ── */}
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="text-center text-slate-700 dark:text-white/60 text-base font-medium mb-6">
              Who are you planning this outing for?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {groupCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleGroupSelect(cat.id)}
                  className="glass-card p-6 text-center group cursor-pointer border border-slate-200 dark:border-white/10 hover:border-primary-500/50 hover:shadow-glow-purple-sm transition-all duration-300 rounded-3xl"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {cat.emoji}
                  </div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-xl mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-neon-teal text-xs font-semibold uppercase tracking-wider mb-2">
                    {cat.tagline}
                  </p>
                  <p className="text-slate-600 dark:text-white/40 text-xs leading-relaxed">
                    {cat.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Choose Activity / Vibe Sub-Category ── */}
        {step === 2 && (
          <div className="animate-slide-up max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
              >
                <FiArrowLeft size={14} /> Back to Groups
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-bold">
                <span>{selectedGroup?.emoji} {selectedGroup?.label}</span>
              </div>
            </div>

            <h2 className="text-center font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2">
              Select a Vibe or Search Any Place for {selectedGroup?.label}
            </h2>
            <p className="text-center text-slate-600 dark:text-white/40 text-sm mb-6">
              Search a landmark directly or pick a specific activity category
            </p>

            {/* Direct Place Search Bar outside sub-filters */}
            <div className="mb-6 relative z-30 bg-slate-100 dark:bg-dark-800/90 p-4 border border-slate-200 dark:border-white/10 rounded-2xl shadow-md">
              <label className="block text-slate-700 dark:text-white/70 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiSearch size={14} className="text-primary-400" />
                <span>Search Any Specific Place, Landmark, or City (No Category Restrictions)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type landmark or place (e.g. Marine Drive, Juhu Beach, Bandra Fort)..."
                  value={locationQuery}
                  onChange={(e) => handleInputChange(e.target.value, 'step2')}
                  onFocus={() => handleInputFocus('step2')}
                  onBlur={handleInputBlur}
                  className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-primary-500/50 transition-all shadow-xs"
                />
                {showSuggestions && activeInputId === 'step2' && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-dark-800/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                    {suggestionsLoading ? (
                      <div className="p-3.5 text-sm text-slate-500 dark:text-white/40 text-center flex items-center justify-center gap-2">
                        <FiRefreshCw size={14} className="animate-spin text-primary-400" />
                        <span>Searching locations...</span>
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-3.5 text-sm text-slate-500 dark:text-white/40 text-center">No matching locations found</div>
                    ) : (
                      suggestions.map((s) => (
                        <button
                          key={s.placeId}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setVibe('all');
                            handleSelectSuggestion(s);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer block"
                        >
                          <div className="text-slate-900 dark:text-white font-semibold text-sm">
                            {s.name || s.formatted.split(',')[0]}
                          </div>
                          <div className="text-slate-500 dark:text-white/40 text-xs mt-0.5 truncate">
                            {s.formatted}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* "Explore All Spots & Landmarks (No Filter)" Card */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setVibe('all');
                  setStep(3);
                }}
                className="w-full glass-card p-5 text-left group cursor-pointer border-2 border-primary-500/40 hover:border-primary-500 bg-primary-500/5 hover:bg-primary-500/15 hover:shadow-glow-purple-sm transition-all duration-300 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                    🧭
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-1 flex items-center gap-2">
                      <span>Explore All Spots & Landmarks in City</span>
                      <span className="px-2 py-0.5 rounded-md bg-neon-teal/20 text-neon-teal text-[10px] font-extrabold uppercase tracking-wider">Unfiltered</span>
                    </h4>
                    <p className="text-slate-600 dark:text-white/60 text-xs font-medium leading-relaxed">
                      Discover all top places, landmarks, beaches, parks, malls, cafes & viewpoints without activity restrictions
                    </p>
                  </div>
                </div>
                <div className="text-primary-400 group-hover:translate-x-1 transition-transform pl-4">
                  <FiArrowRight size={20} />
                </div>
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-4 pl-1">
              OR Filter By Specific Category:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentVibeList.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVibeSelect(v.id)}
                  className="glass-card p-5 text-left group cursor-pointer border border-slate-200 dark:border-white/10 hover:border-primary-500/50 hover:shadow-glow-purple-sm transition-all duration-300 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {v.emoji}
                    </div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-base mb-1">
                      {v.label}
                    </h4>
                    <p className="text-slate-600 dark:text-white/40 text-xs leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end text-primary-400 group-hover:translate-x-1 transition-transform">
                    <FiArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Location Selection (2 Main Options) ── */}
        {step === 3 && (
          <div className="animate-slide-up text-center max-w-2xl mx-auto glass-card p-8 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
              >
                <FiArrowLeft size={14} /> Back to Vibes
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-xs font-bold">
                <span>{selectedGroup?.emoji} {selectedGroup?.label}</span>
                <span>·</span>
                <span>{selectedVibe?.emoji} {selectedVibe?.label}</span>
              </div>
            </div>

            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
              Where should we look?
            </h3>
            <p className="text-slate-600 dark:text-white/40 text-sm mb-6">
              Choose how you want to discover spots for your outing
            </p>

            {/* Featured / Famous Spots in India Quick Selector */}
            {currentFeaturedList.length > 0 && (
              <div className="mb-6 text-left animate-slide-up bg-slate-100 dark:bg-dark-800/80 p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white/80 flex items-center gap-1.5">
                    <span>🌟 Featured Iconic Spots in India</span>
                  </span>
                  <span className="text-[11px] text-primary-600 dark:text-neon-teal font-bold">1-Click Instant Search</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentFeaturedList.map((spot) => (
                    <button
                      key={spot.name}
                      type="button"
                      onClick={() => handleFeaturedSpotClick(spot)}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-700 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/20 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <span>{spot.emoji}</span>
                      <span>{spot.name}</span>
                      <span className="text-slate-500 dark:text-white/40 text-[10px] font-semibold">({spot.city})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2 Main Location Options Toggle (Only when vibe is 'all') */}
            {vibe === 'all' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setLocationMode('current')}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between
                    ${locationMode === 'current'
                      ? 'bg-primary-500/10 dark:bg-primary-500/20 border-2 border-primary-500 shadow-glow-purple-sm'
                      : 'bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-dark-700'}`}
                >
                  <div>
                    <div className="text-3xl mb-2">📍</div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-base mb-1">
                      Suggest Nearby Places
                    </h4>
                    <p className="text-slate-600 dark:text-white/60 text-xs font-medium leading-relaxed">
                      Uses your browser's live GPS coordinates to find places near your current position.
                    </p>
                  </div>
                  {locationMode === 'current' && <span className="text-primary-600 dark:text-neon-teal font-bold text-xs mt-3 block">✓ Selected</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setLocationMode('custom')}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between
                    ${locationMode === 'custom'
                      ? 'bg-primary-500/10 dark:bg-primary-500/20 border-2 border-primary-500 shadow-glow-purple-sm'
                      : 'bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-dark-700'}`}
                >
                  <div>
                    <div className="text-3xl mb-2">🔍</div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-base mb-1">
                      Search Specific Place or City
                    </h4>
                    <p className="text-slate-600 dark:text-white/60 text-xs font-medium leading-relaxed">
                      Type any city, area, or landmark (e.g. Goa, Mumbai, Paris, Juhu Beach).
                    </p>
                  </div>
                  {locationMode === 'custom' && <span className="text-primary-600 dark:text-neon-teal font-bold text-xs mt-3 block">✓ Selected</span>}
                </button>
              </div>
            ) : null}

            {/* Config Option A: GPS Search Radius */}
            {locationMode === 'current' && (
              <div className="text-left mb-8 animate-slide-up">
                <label className="block text-slate-700 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-3 text-center">
                  Select Search Radius
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {distances.map((d) => {
                    const isSelected = distance === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDistance(d.id)}
                        className={`p-4 text-center cursor-pointer border transition-all duration-300 rounded-2xl
                          ${isSelected
                            ? 'bg-primary-500/10 dark:bg-primary-500/20 border-2 border-primary-500 shadow-glow-purple-sm text-slate-900 dark:text-white'
                            : 'bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-dark-700'}`}
                      >
                        <div className="text-2xl mb-1">{d.emoji}</div>
                        <p className="font-display font-bold text-slate-900 dark:text-white text-sm">{d.label}</p>
                        <p className="text-slate-600 dark:text-white/50 text-[11px] font-medium">{d.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Config Option B: Area/City Autocomplete Input */}
            {locationMode === 'custom' && (
              <div className="mb-8 text-left animate-slide-up">
                <label className="block text-slate-700 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-2 pl-1">
                  Type Specific Place, Area, or City
                </label>
                <div className="relative z-30">
                  <input
                    type="text"
                    placeholder="e.g. Goa, Mumbai, Juhu Beach, Paris"
                    value={locationQuery}
                    onChange={(e) => handleInputChange(e.target.value, 'step3')}
                    onFocus={() => handleInputFocus('step3')}
                    onBlur={handleInputBlur}
                    className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-primary-500/50 focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm"
                  />
                  {showSuggestions && activeInputId === 'step3' && (
                    <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-dark-800/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                      {suggestionsLoading ? (
                        <div className="p-3.5 text-sm text-slate-500 dark:text-white/40 text-center flex items-center justify-center gap-2">
                          <FiRefreshCw size={14} className="animate-spin text-primary-400" />
                          <span>Searching locations...</span>
                        </div>
                      ) : suggestions.length === 0 ? (
                        <div className="p-3.5 text-sm text-slate-500 dark:text-white/40 text-center">No matching locations found</div>
                      ) : (
                        suggestions.map((s) => (
                          <button
                            key={s.placeId}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(s);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer block"
                          >
                            <div className="text-slate-900 dark:text-white font-semibold text-sm">
                              {s.name || s.formatted.split(',')[0]}
                            </div>
                            <div className="text-slate-500 dark:text-white/40 text-xs mt-0.5 truncate">
                              {s.formatted}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Find Places Action Button */}
            <button
              type="button"
              onClick={handleFindPlacesClick}
              disabled={locationMode === 'custom' && !locationQuery.trim()}
              className="w-full btn-primary py-3.5 rounded-xl text-base font-bold shadow-glow-purple transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Explore Spots for {selectedGroup?.label}</span>
              <FiArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 4: Results Display ── */}
        {step === 4 && (
          <div className="animate-fade-in">
            {/* Filter Summary Header */}
            <div className="glass-card relative z-30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 animate-slide-up border border-slate-200 dark:border-white/10 rounded-2xl shadow-md">
              <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-slate-700 dark:text-white/60">
                <span>{selectedGroup?.emoji} <span className="text-slate-900 dark:text-white font-bold">{selectedGroup?.label}</span></span>
                <span className="text-slate-400 dark:text-white/20">·</span>
                <span>{selectedVibe?.emoji} <span className="text-slate-900 dark:text-white font-bold">{selectedVibe?.label}</span></span>
                {locationMode === 'current' && selectedDist && (
                  <>
                    <span className="text-slate-400 dark:text-white/20">·</span>
                    <span>{selectedDist?.emoji} <span className="text-slate-900 dark:text-white font-bold">{selectedDist?.label}</span></span>
                  </>
                )}
                {resolvedLocationText && (
                  <>
                    <span className="text-slate-400 dark:text-white/20">·</span>
                    <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">📍 {resolvedLocationText}</span>
                  </>
                )}
                {places.length > 0 && (
                  <>
                    <span className="text-slate-400 dark:text-white/20">·</span>
                    <span className="text-neon-teal font-bold">{places.length} places found</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-48">
                    <input
                      type="text"
                      placeholder="Search new location..."
                      value={locationQuery}
                      onChange={(e) => handleInputChange(e.target.value, 'step4')}
                      onFocus={() => handleInputFocus('step4')}
                      onBlur={handleInputBlur}
                      className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-primary-500/40 transition-all"
                    />
                    {showSuggestions && activeInputId === 'step4' && (
                      <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-dark-800/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 md:w-64 md:left-auto md:right-0">
                        {suggestionsLoading ? (
                          <div className="p-3 text-xs text-slate-500 dark:text-white/40 text-center flex items-center justify-center gap-2">
                            <FiRefreshCw size={12} className="animate-spin text-primary-400" />
                            <span>Searching locations...</span>
                          </div>
                        ) : suggestions.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 dark:text-white/40 text-center">No locations found</div>
                        ) : (
                          suggestions.map((s) => (
                            <button
                              key={s.placeId}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(s);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer block"
                            >
                              <div className="text-slate-900 dark:text-white font-semibold text-xs truncate">
                                {s.name || s.formatted.split(',')[0]}
                              </div>
                              <div className="text-slate-500 dark:text-white/40 text-[10px] mt-0.5 truncate">
                                {s.formatted}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!locationQuery.trim()}
                    className="bg-primary-500/20 border border-primary-500/25 hover:bg-primary-500/35 text-primary-300 font-bold px-3 py-1.5 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Go
                  </button>
                </form>
                <button onClick={handleReset} className="btn-ghost text-sm flex items-center gap-1.5 !px-3 !py-2 font-bold cursor-pointer">
                  <FiRefreshCw size={12} />
                  Start over
                </button>
              </div>
            </div>

            {/* Empty state placeholder if no places found and not loading */}
            {!loading && places.length === 0 && !error && (
              <div className="glass-card p-8 text-center animate-slide-up">
                <p className="text-base text-slate-600 dark:text-white/70">No places loaded yet.</p>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div>
                <p className="text-center text-slate-600 dark:text-white/40 text-base mb-6 animate-pulse font-semibold">
                  📡 Finding curated spots for {selectedGroup?.label}...
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <PlaceSkeleton key={i} />)}
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="glass-card p-8 text-center animate-slide-up border border-slate-200 dark:border-white/10">
                <FiAlertCircle className="text-accent-400 mx-auto mb-3" size={32} />
                <p className="text-base text-slate-700 dark:text-white/70 mb-4">{error}</p>
                <button onClick={handleFindPlacesClick} className="btn-secondary flex items-center gap-2 mx-auto text-sm font-bold">
                  <FiRefreshCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {/* Places grid */}
            {!loading && places.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => (
                  <PlaceCard key={place.osmId} place={place} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;

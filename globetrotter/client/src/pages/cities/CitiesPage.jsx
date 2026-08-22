import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, RefreshCw, X, Plus, Calendar, Compass } from 'lucide-react';
import { fetchCities, setFilter, clearFilters, selectCities, selectCityFilters, selectCitiesLoading } from '../../store/slices/citiesSlice.js';
import { fetchTrips, selectTrips } from '../../store/slices/tripsSlice.js';
import CityCard from '../../components/features/CityCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import api from '../../services/api.js';
import { mockCities, mockTrips } from '../../utils/mockData.js';

export default function CitiesPage() {
  const dispatch = useDispatch();
  const apiCities = useSelector(selectCities);
  const filters = useSelector(selectCityFilters);
  const isLoading = useSelector(selectCitiesLoading);
  const trips = useSelector(selectTrips);

  // Fallback to mock data if empty or backend offline
  const [citiesList, setCitiesList] = useState([]);
  const [tripsList, setTripsList] = useState([]);

  // Modal states
  const [selectedCity, setSelectedCity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [notes, setNotes] = useState('');
  const [accName, setAccName] = useState('');
  const [accAddress, setAccAddress] = useState('');
  const [accCost, setAccCost] = useState('0');
  const [isAdding, setIsAdding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Local search state for instant UI feedback (debounced before hitting Redux)
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const searchDebounceRef = useRef(null);

  // Dynamic API states for global countries and cities
  const [countriesOfWorld, setCountriesOfWorld] = useState([]);
  const [citiesOfSelectedCountry, setCitiesOfSelectedCountry] = useState([]);
  const [isFetchingCountries, setIsFetchingCountries] = useState(false);
  const [isFetchingCities, setIsFetchingCities] = useState(false);

  // Searchable combobox states
  const [countrySearchText, setCountrySearchText] = useState('');
  const [citySearchText, setCitySearchText] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const countryDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const filterCardRef = useRef(null);

  // Price range local states (typed inputs)
  const [minCostInput, setMinCostInput] = useState('');
  const [maxCostInput, setMaxCostInput] = useState('');
  const priceDebounceRef = useRef(null);

  // Filtered lists for comboboxes
  const filteredCountries = countrySearchText
    ? countriesOfWorld.filter(c => c.toLowerCase().includes(countrySearchText.toLowerCase()))
    : countriesOfWorld;
  const filteredCities = citySearchText
    ? citiesOfSelectedCountry.filter(c => c.toLowerCase().includes(citySearchText.toLowerCase()))
    : citiesOfSelectedCountry;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterCardRef.current && !filterCardRef.current.contains(e.target)) {
        setShowFilters(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch trips once on mount only
  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  // Re-fetch cities when non-search filters change (country, region, maxCost, sortBy)
  useEffect(() => {
    dispatch(fetchCities(filters));
  }, [dispatch, filters.country, filters.region, filters.maxCost, filters.sortBy]);

  // Load all countries of the world on mount
  useEffect(() => {
    const fetchCountriesOfWorld = async () => {
      setIsFetchingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const json = await response.json();
        if (json && !json.error && Array.isArray(json.data)) {
          const names = json.data.map(c => c.country).sort((a, b) => a.localeCompare(b));
          setCountriesOfWorld(names);
          window.countriesNowData = json.data; // Cache locally
        } else {
          setCountriesOfWorld(['India', 'France', 'Japan', 'Indonesia', 'United States', 'Germany', 'United Kingdom', 'Italy', 'Spain', 'Canada']);
        }
      } catch (err) {
        console.error('Failed to fetch countries of world, using fallback list', err);
        setCountriesOfWorld(['India', 'France', 'Japan', 'Indonesia', 'United States', 'Germany', 'United Kingdom', 'Italy', 'Spain', 'Canada']);
      } finally {
        setIsFetchingCountries(false);
      }
    };
    fetchCountriesOfWorld();
  }, []);

  // Country dynamic helpers
  const getCountryImageFallback = (country) => {
    const map = {
      'United States': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
      'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=800',
      'Italy': 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800',
      'Spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800',
      'Canada': 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800',
      'Australia': 'https://images.unsplash.com/photo-1523482596682-cd93a6e94dd4?w=800',
      'Japan': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
      'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
    };
    return map[country] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  };

  const getCountryAverageCost = (country) => {
    const map = {
      'India': 3000,
      'Indonesia': 2000,
      'Thailand': 2500,
      'Vietnam': 2000,
      'Japan': 8000,
      'France': 10000,
      'Germany': 9500,
      'Italy': 9000,
      'Spain': 8000,
      'United Kingdom': 11000,
      'United States': 12000,
      'Canada': 10500,
      'Australia': 11500
    };
    return map[country] || 5000;
  };

  // Currency settings for dynamic price range slider
  const currencySettings = {
    'India': { symbol: '₹', max: 15000, step: 500, rate: 1 },
    'France': { symbol: '€', max: 200, step: 5, rate: 0.011 },
    'Germany': { symbol: '€', max: 200, step: 5, rate: 0.011 },
    'Italy': { symbol: '€', max: 200, step: 5, rate: 0.011 },
    'Spain': { symbol: '€', max: 200, step: 5, rate: 0.011 },
    'United Kingdom': { symbol: '£', max: 200, step: 5, rate: 0.0094 },
    'United States': { symbol: '$', max: 250, step: 5, rate: 0.012 },
    'Canada': { symbol: 'CA$', max: 300, step: 10, rate: 0.016 },
    'Australia': { symbol: 'A$', max: 300, step: 10, rate: 0.018 },
    'Japan': { symbol: '¥', max: 20000, step: 500, rate: 1.8 },
    'Indonesia': { symbol: 'Rp', max: 2000000, step: 50000, rate: 188 }
  };

  const activeCurrency = currencySettings[filters.country] || currencySettings['India'];

  // Set local state based on API or Mock fallbacks
  useEffect(() => {
    if (apiCities && apiCities.length > 0) {
      setCitiesList(apiCities);
    } else {
      // Filter mock cities locally based on active filters
      let filtered = [...mockCities];
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(query) || 
          c.country.toLowerCase().includes(query) || 
          c.region.toLowerCase().includes(query)
        );
      }
      if (filters.country) {
        filtered = filtered.filter(c => c.country.toLowerCase() === filters.country.toLowerCase());
      }
      if (filters.region) {
        filtered = filtered.filter(c => c.name.toLowerCase() === filters.region.toLowerCase());
      }
      if (filters.maxCost) {
        filtered = filtered.filter(c => (c.avgDailyCost || c.costIndex) <= Number(filters.maxCost));
      }

      // Dynamic city generation if country is selected but no seeded city matches
      if (filtered.length === 0 && filters.country) {
        const cityName = filters.region || filters.search || 'Explore Destination';
        const dynamicCity = {
          _id: `city-dynamic-${cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
          country: filters.country,
          region: filters.country,
          description: `Plan your dream trip stop. Explore popular attractions, local food, and culture in ${cityName}, ${filters.country}!`,
          image: getCountryImageFallback(filters.country),
          costIndex: 3,
          popularity: 85,
          avgDailyCost: getCountryAverageCost(filters.country),
          tags: ['explore', 'destination'],
          bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Oct', 'Nov'],
          isCustomDynamic: true
        };
        filtered = [dynamicCity];
      }

      // Sort mock cities
      if (filters.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters.sortBy === 'cost') {
        filtered.sort((a, b) => (a.avgDailyCost || a.costIndex) - (b.avgDailyCost || b.costIndex));
      } else {
        filtered.sort((a, b) => b.popularity - a.popularity);
      }
      setCitiesList(filtered);
    }
  }, [apiCities, filters]);

  useEffect(() => {
    if (trips && trips.length > 0) {
      setTripsList(trips);
    } else {
      // Fallback to localstorage or mock
      const localTrips = localStorage.getItem('globetrotter_trips');
      if (localTrips) {
        setTripsList(JSON.parse(localTrips));
      } else {
        localStorage.setItem('globetrotter_trips', JSON.stringify(mockTrips));
        setTripsList(mockTrips);
      }
    }
  }, [trips]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val); // update local state immediately for smooth typing
    // Debounce: only update Redux (and trigger filter logic) after 350ms idle
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      dispatch(setFilter({ search: val }));
    }, 350);
  };

  // Sync local search value if filters.search is cleared externally (e.g. Reset Filters)
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleCountryChange = async (countryName) => {
    // If changing country, reset maxCost/region to empty
    dispatch(setFilter({
      country: countryName,
      region: '', // Clear city/region filter
      maxCost: '' // Clear cost filter to show full range
    }));

    if (!countryName) {
      setCitiesOfSelectedCountry([]);
      return;
    }

    setIsFetchingCities(true);
    try {
      if (window.countriesNowData) {
        const found = window.countriesNowData.find(c => c.country.toLowerCase() === countryName.toLowerCase());
        if (found && Array.isArray(found.cities)) {
          setCitiesOfSelectedCountry(found.cities.sort((a, b) => a.localeCompare(b)));
          setIsFetchingCities(false);
          return;
        }
      }

      // Fetch from API if not cached
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName })
      });
      const json = await response.json();
      if (json && !json.error && Array.isArray(json.data)) {
        setCitiesOfSelectedCountry(json.data.sort((a, b) => a.localeCompare(b)));
      } else {
        setCitiesOfSelectedCountry([]);
      }
    } catch (err) {
      console.error('Failed to fetch cities for country', err);
      setCitiesOfSelectedCountry([]);
    } finally {
      setIsFetchingCities(false);
    }
  };

  const handleResetFilters = () => {
    dispatch(clearFilters());
  };

  const openAddModal = (city) => {
    setSelectedCity(city);
    setIsAddModalOpen(true);
    if (tripsList.length > 0) {
      setSelectedTripId(tripsList[0]._id);
      setArrivalDate(tripsList[0].startDate ? tripsList[0].startDate.split('T')[0] : '');
      setDepartureDate(tripsList[0].endDate ? tripsList[0].endDate.split('T')[0] : '');
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedCity(null);
    setNotes('');
    setAccName('');
    setAccAddress('');
    setAccCost('0');
  };

  const handleAddToTripSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) {
      toast.error('Please select or create a trip first');
      return;
    }

    const payload = {
      cityId: selectedCity._id.startsWith('city-') ? null : selectedCity._id, // Only send valid DB mongo object ids to backend
      customCityName: selectedCity._id.startsWith('city-') ? selectedCity.name : '',
      arrivalDate,
      departureDate,
      notes,
      accommodation: {
        name: accName,
        address: accAddress,
        cost: Number(accCost) || 0
      }
    };

    setIsAdding(true);
    try {
      // Try calling API first
      await api.post(`/trips/${selectedTripId}/stops`, payload);
      toast.success(`Successfully added ${selectedCity.name} to your itinerary!`);
      dispatch(fetchTrips());
      closeAddModal();
    } catch (err) {
      console.warn('API call failed, falling back to local simulation', err);
      // Simulate locally in localStorage
      let allLocalTrips = [];
      const saved = localStorage.getItem('globetrotter_trips');
      if (saved) {
        allLocalTrips = JSON.parse(saved);
      }
      
      const tripIdx = allLocalTrips.findIndex(t => t._id === selectedTripId);
      if (tripIdx !== -1) {
        const newStop = {
          _id: `stop-${Date.now()}`,
          trip: selectedTripId,
          city: selectedCity,
          customCityName: '',
          arrivalDate,
          departureDate,
          notes,
          accommodation: {
            name: accName,
            address: accAddress,
            cost: Number(accCost) || 0
          },
          activities: []
        };
        
        allLocalTrips[tripIdx].stops = [...(allLocalTrips[tripIdx].stops || []), newStop];
        localStorage.setItem('globetrotter_trips', JSON.stringify(allLocalTrips));
        setTripsList(allLocalTrips);
        toast.success(`${selectedCity.name} added to Trip locally (Demo Mode)`);
      } else {
        toast.error('Failed to add stop: Select a valid trip.');
      }
      closeAddModal();
    } finally {
      setIsAdding(false);
    }
  };

  // activeFiltersCount for badge display
  const activeFiltersCount = [filters.country, filters.region, filters.maxCost].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Premium Hero Banner */}
      <div 
        style={{
          backgroundImage: "linear-gradient(120deg, rgba(24, 45, 101, 0.82), rgba(27, 99, 114, 0.72)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className="relative text-white py-16 px-6 sm:px-12 rounded-3xl mb-8 shadow-card-md"
      >
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-teal-light via-transparent to-brand-blue-light"></div>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-brand-teal-medium/25 blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
          <Compass className="w-12 h-12 text-brand-teal-light mb-4 animate-spin-slow" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Find Your Next Adventure
          </h1>
          <p className="text-base text-white/90 max-w-xl mb-8 leading-relaxed font-sans font-medium">
            Discover historic landmarks, coastal resorts, and bustling metropolises. Filter by cost, location, or popularity to plan your perfect escape.
          </p>

          {/* Floating Search Bar */}
          <div className="w-full max-w-xl relative flex items-center bg-white rounded-2xl p-1.5 shadow-card-lg border border-white/20">
            <Search className="w-5 h-5 text-surface-400 ml-3" />
            <input
              type="text"
              placeholder="Search by city, country, or region..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-surface-900 placeholder-surface-400 text-sm px-3 focus:outline-none"
            />
            {searchValue && (
              <button 
                onClick={() => {
                  setSearchValue('');
                  if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                  dispatch(setFilter({ search: '' }));
                }}
                className="p-1 hover:bg-surface-100 rounded-full text-surface-400 hover:text-surface-600 transition-colors mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ml-2 border ${
                showFilters 
                  ? 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/40 font-bold' 
                  : 'bg-surface-50 text-surface-500 border-surface-200 hover:bg-surface-100 hover:text-surface-800'
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-semibold max-sm:hidden">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-teal-dark text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Premium Filter Card */}
            {showFilters && (
              <div
                ref={filterCardRef}
                className="absolute top-full right-0 sm:right-auto sm:left-full sm:top-0 sm:ml-3 mt-3 sm:mt-0 bg-white border border-surface-100 rounded-2xl shadow-2xl z-50 text-left w-[340px] max-w-[92vw] overflow-hidden"
                style={{ animation: 'slideDownFade 0.18s ease' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-brand-blue-navy to-brand-teal-dark">
                  <span className="font-display font-bold text-sm text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filter Options
                  </span>
                  <div className="flex items-center gap-2">
                    {(filters.country || filters.region || filters.maxCost) && (
                      <button
                        onClick={() => {
                          handleResetFilters();
                          setCountrySearchText('');
                          setCitySearchText('');
                          setMinCostInput('');
                          setMaxCostInput('');
                        }}
                        className="text-[11px] text-white/70 hover:text-white font-semibold transition-colors px-2 py-0.5 rounded-lg hover:bg-white/10"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

                  {/* Country Searchable Combobox ── */}
                  <div ref={countryDropdownRef} className="relative">
                    <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">
                      Country
                    </label>
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 bg-white cursor-text transition-all ${
                        showCountryDropdown ? 'border-brand-teal-medium ring-2 ring-brand-teal-light/30' : 'border-surface-200 hover:border-surface-300'
                      }`}
                      onClick={() => setShowCountryDropdown(true)}
                    >
                      <Search className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder={filters.country || 'Search country...'}
                        value={countrySearchText}
                        onChange={(e) => {
                          setCountrySearchText(e.target.value);
                          setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        className="flex-1 text-sm bg-transparent outline-none text-surface-900 placeholder-surface-400 min-w-0"
                      />
                      {filters.country && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCountryChange(''); setCountrySearchText(''); setCitySearchText(''); }}
                          className="text-surface-300 hover:text-surface-600 transition-colors flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {/* Selected badge */}
                    {filters.country && !showCountryDropdown && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-teal-pale text-brand-teal-dark text-xs font-semibold rounded-full">
                          {filters.country}
                          <button onClick={() => { handleCountryChange(''); setCountrySearchText(''); setCitySearchText(''); }}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    )}
                    {/* Dropdown list */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        {isFetchingCountries ? (
                          <div className="flex items-center gap-2 px-4 py-3 text-sm text-surface-400">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading countries...
                          </div>
                        ) : (
                          <>
                            <div
                              className="px-4 py-2.5 text-sm text-surface-500 hover:bg-surface-50 cursor-pointer border-b border-surface-100"
                              onClick={() => { handleCountryChange(''); setCountrySearchText(''); setShowCountryDropdown(false); }}
                            >
                              All Countries
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-surface-400 text-center">No countries found</div>
                              ) : filteredCountries.slice(0, 80).map(country => (
                                <div
                                  key={country}
                                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                    filters.country === country
                                      ? 'bg-brand-teal-pale text-brand-teal-dark font-semibold'
                                      : 'text-surface-700 hover:bg-surface-50'
                                  }`}
                                  onClick={() => {
                                    handleCountryChange(country);
                                    setCountrySearchText('');
                                    setShowCountryDropdown(false);
                                  }}
                                >
                                  <span>{country}</span>
                                  {filters.country === country && <Check className="w-3.5 h-3.5 text-brand-teal-dark" />}
                                </div>
                              ))}
                              {filteredCountries.length > 80 && (
                                <div className="px-4 py-2 text-[11px] text-surface-400 text-center border-t border-surface-100">
                                  Type to narrow down {filteredCountries.length - 80} more...
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* City Searchable Combobox ── */}
                  <div ref={cityDropdownRef} className="relative">
                    <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">
                      City
                    </label>
                    {filters.country ? (
                      <>
                        <div
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 bg-white cursor-text transition-all ${
                            showCityDropdown ? 'border-brand-teal-medium ring-2 ring-brand-teal-light/30' : 'border-surface-200 hover:border-surface-300'
                          } ${isFetchingCities ? 'opacity-60' : ''}`}
                          onClick={() => !isFetchingCities && setShowCityDropdown(true)}
                        >
                          {isFetchingCities
                            ? <RefreshCw className="w-3.5 h-3.5 text-brand-teal-dark animate-spin flex-shrink-0" />
                            : <Search className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                          }
                          <input
                            type="text"
                            placeholder={isFetchingCities ? 'Loading cities...' : (filters.region || 'Search city...')}
                            value={citySearchText}
                            onChange={(e) => { setCitySearchText(e.target.value); setShowCityDropdown(true); }}
                            onFocus={() => setShowCityDropdown(true)}
                            disabled={isFetchingCities}
                            className="flex-1 text-sm bg-transparent outline-none text-surface-900 placeholder-surface-400 min-w-0 disabled:cursor-not-allowed"
                          />
                          {filters.region && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleFilterChange('region', ''); setCitySearchText(''); }}
                              className="text-surface-300 hover:text-surface-600 transition-colors flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {/* Selected city badge */}
                        {filters.region && !showCityDropdown && (
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue-light/20 text-brand-blue-navy text-xs font-semibold rounded-full">
                              {filters.region}
                              <button onClick={() => { handleFilterChange('region', ''); setCitySearchText(''); }}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          </div>
                        )}
                        {/* City dropdown list */}
                        {showCityDropdown && !isFetchingCities && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div
                              className="px-4 py-2.5 text-sm text-surface-500 hover:bg-surface-50 cursor-pointer border-b border-surface-100"
                              onClick={() => { handleFilterChange('region', ''); setCitySearchText(''); setShowCityDropdown(false); }}
                            >
                              All Cities in {filters.country}
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCities.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-surface-400 text-center">No cities found</div>
                              ) : filteredCities.slice(0, 80).map(city => (
                                <div
                                  key={city}
                                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                    filters.region === city
                                      ? 'bg-brand-blue-light/20 text-brand-blue-navy font-semibold'
                                      : 'text-surface-700 hover:bg-surface-50'
                                  }`}
                                  onClick={() => {
                                    handleFilterChange('region', city);
                                    setCitySearchText('');
                                    setShowCityDropdown(false);
                                  }}
                                >
                                  <span>{city}</span>
                                  {filters.region === city && <Check className="w-3.5 h-3.5 text-brand-blue-navy" />}
                                </div>
                              ))}
                              {filteredCities.length > 80 && (
                                <div className="px-4 py-2 text-[11px] text-surface-400 text-center border-t border-surface-100">
                                  Type to narrow down {filteredCities.length - 80} more...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-dashed border-surface-200 px-3 py-2.5 bg-surface-50/50 text-surface-400 text-sm">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Select a country first</span>
                      </div>
                    )}
                  </div>

                  {/* ── Price Range ── */}
                  <div>
                    <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">
                      💰 Budget / Daily Cost ({activeCurrency.symbol})
                    </label>

                    {/* Min / Max typed inputs */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[10px] text-surface-400 mb-1 block">Min</label>
                        <div className="flex items-center gap-1 rounded-xl border border-surface-200 px-2.5 py-2 bg-white focus-within:border-brand-teal-medium focus-within:ring-2 focus-within:ring-brand-teal-light/20 transition-all">
                          <span className="text-xs text-surface-400 font-semibold">{activeCurrency.symbol}</span>
                          <input
                            type="number"
                            min="0"
                            max={activeCurrency.max}
                            placeholder="0"
                            value={minCostInput}
                            onChange={(e) => {
                              const v = e.target.value;
                              setMinCostInput(v);
                              if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
                              priceDebounceRef.current = setTimeout(() => {
                                dispatch(setFilter({ minCost: v ? Math.round(Number(v) / activeCurrency.rate) : '' }));
                              }, 400);
                            }}
                            className="w-full text-sm bg-transparent outline-none text-surface-900 min-w-0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-surface-400 mb-1 block">Max</label>
                        <div className="flex items-center gap-1 rounded-xl border border-surface-200 px-2.5 py-2 bg-white focus-within:border-brand-teal-medium focus-within:ring-2 focus-within:ring-brand-teal-light/20 transition-all">
                          <span className="text-xs text-surface-400 font-semibold">{activeCurrency.symbol}</span>
                          <input
                            type="number"
                            min="0"
                            max={activeCurrency.max}
                            placeholder="Any"
                            value={maxCostInput}
                            onChange={(e) => {
                              const v = e.target.value;
                              setMaxCostInput(v);
                              if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
                              priceDebounceRef.current = setTimeout(() => {
                                handleFilterChange('maxCost', v ? Math.round(Number(v) / activeCurrency.rate) : '');
                              }, 400);
                            }}
                            className="w-full text-sm bg-transparent outline-none text-surface-900 min-w-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Range slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={activeCurrency.max}
                        step={activeCurrency.step}
                        value={maxCostInput ? Math.min(Number(maxCostInput), activeCurrency.max) : activeCurrency.max}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const displayVal = val >= activeCurrency.max ? '' : String(val);
                          setMaxCostInput(displayVal);
                          if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
                          priceDebounceRef.current = setTimeout(() => {
                            handleFilterChange('maxCost', displayVal ? Math.round(val / activeCurrency.rate) : '');
                          }, 200);
                        }}
                        className="w-full accent-brand-teal-dark h-1.5 rounded-full cursor-pointer"
                        style={{ background: `linear-gradient(to right, #2a6d64 0%, #2a6d64 ${
                          maxCostInput ? (Math.min(Number(maxCostInput), activeCurrency.max) / activeCurrency.max) * 100 : 100
                        }%, #e2e8f0 ${
                          maxCostInput ? (Math.min(Number(maxCostInput), activeCurrency.max) / activeCurrency.max) * 100 : 100
                        }%, #e2e8f0 100%)` }}
                      />
                      <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                        <span>{activeCurrency.symbol}0</span>
                        <span className="font-semibold text-brand-teal-dark">
                          {maxCostInput ? `Up to ${activeCurrency.symbol}${Number(maxCostInput).toLocaleString()}` : `${activeCurrency.symbol}${activeCurrency.max.toLocaleString()}+ (Any)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By ── */}
                  <div>
                    <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">
                      Sort By
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: 'popularity', label: 'Popular' },
                        { val: 'name', label: '🔤 Name' },
                        { val: 'cost', label: '💵 Cost' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => handleFilterChange('sortBy', opt.val)}
                          className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                            filters.sortBy === opt.val
                              ? 'bg-brand-teal-dark text-white border-brand-teal-dark shadow-sm'
                              : 'bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t border-surface-100 bg-surface-50 flex items-center justify-between">
                  <span className="text-xs text-surface-400">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active` : 'No filters active'}
                  </span>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-5 py-2 bg-brand-teal-dark text-white rounded-xl text-xs font-bold hover:bg-brand-teal-medium transition-colors shadow-sm"
                  >
                    Apply & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Right Main Grid */}
          <main className="flex-grow min-h-[500px]">
            <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {citiesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {citiesList.map(city => (
                  <CityCard
                    key={city._id}
                    city={city}
                    onAddToTrip={openAddModal}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-surface-100 p-12 text-center shadow-sm">
                {/* Animated globe icon */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-teal-pale to-brand-blue-light flex items-center justify-center shadow-inner">
                    <Compass className="w-12 h-12 text-brand-teal-dark" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                </div>

                {filters.country && filters.region ? (
                  <>
                    <h3 className="text-xl font-display font-bold text-brand-blue-navy mb-2">
                      ✈️ No trips available for {filters.region}
                    </h3>
                    <p className="text-sm text-surface-500 max-w-sm mx-auto mb-2 leading-relaxed">
                      We don't have pre-planned routes for <strong>{filters.region}, {filters.country}</strong> yet — but you can still add it as a custom stop!
                    </p>
                    <p className="text-xs text-brand-teal-dark font-semibold mb-6">Click the button below to create a new trip and plan your adventure.</p>
                  </>
                ) : filters.country ? (
                  <>
                    <h3 className="text-xl font-display font-bold text-brand-blue-navy mb-2">
                      🌍 Exploring {filters.country}
                    </h3>
                    <p className="text-sm text-surface-500 max-w-sm mx-auto mb-2 leading-relaxed">
                      Select a specific city from the <strong>City</strong> filter, or search by name to discover available destinations.
                    </p>
                    <p className="text-xs text-surface-400 mb-6">Our curated list grows every week — check back for new routes!</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-display font-bold text-brand-blue-navy mb-2">
                      No Destinations Found
                    </h3>
                    <p className="text-sm text-surface-500 max-w-sm mx-auto mb-6 leading-relaxed">
                      We couldn't find cities matching your search. Try different keywords or clear your filters to browse all destinations.
                    </p>
                  </>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-pale"
                  >
                    Clear Filters
                  </Button>
                  <a
                    href="/trips/create"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-teal-dark text-white text-sm font-semibold hover:bg-brand-teal-medium transition-colors shadow-sm"
                  >
                    + Create a New Trip
                  </a>
                </div>
              </div>
            )}
            </div>
          </main>

        </div>
      </div>

      {/* Add stop to trip modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={`Add ${selectedCity?.name} to Trip`}
        size="md"
      >
        <form onSubmit={handleAddToTripSubmit} className="space-y-4">
          <div>
            <label className="input-label">Select Trip</label>
            {tripsList.length > 0 ? (
              <select
                value={selectedTripId}
                onChange={(e) => {
                  const trip = tripsList.find(t => t._id === e.target.value);
                  setSelectedTripId(e.target.value);
                  if (trip) {
                    setArrivalDate(trip.startDate ? trip.startDate.split('T')[0] : '');
                    setDepartureDate(trip.endDate ? trip.endDate.split('T')[0] : '');
                  }
                }}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none focus:ring-1 focus:ring-brand-teal-light"
                required
              >
                {tripsList.map(trip => (
                  <option key={trip._id} value={trip._id}>{trip.name}</option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-xs text-amber-700 mb-2">No active trips found. Create a trip on the dashboard first.</p>
                <a href="/trips/create" className="text-xs font-bold text-brand-blue-medium hover:underline">
                  Create a New Trip →
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-teal-dark" /> Arrival Date
              </label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="input-label flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-teal-dark" /> Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Accommodation fields */}
          <div className="p-4 bg-brand-teal-pale/50 border border-brand-teal-light/20 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-brand-blue-navy uppercase tracking-wider">
              🏡 Accommodation Details (Optional)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Hotel / Stay Name"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Address"
                  value={accAddress}
                  onChange={(e) => setAccAddress(e.target.value)}
                  className="w-full text-xs rounded-xl border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-surface-400 font-semibold block mb-1">Accommodation Cost</label>
                <input
                  type="number"
                  placeholder="Cost (₹)"
                  value={accCost}
                  onChange={(e) => setAccCost(e.target.value)}
                  className="w-full text-xs rounded-xl border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="input-label">Notes</label>
            <textarea
              placeholder="e.g. Flight schedules, packing notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button type="button" variant="ghost" onClick={closeAddModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={isAdding}
              disabled={tripsList.length === 0}
              className="bg-brand-teal-dark hover:bg-brand-teal-medium text-white px-6"
            >
              Add to Stop
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

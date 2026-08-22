import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, RefreshCw, X, Calendar, Clock, DollarSign, Check, MapPin } from 'lucide-react';
import { fetchActivities, setFilter, clearFilters, selectActivities, selectActivityFilters, selectActivitiesLoading } from '../../store/slices/activitiesSlice.js';
import { fetchTrips, selectTrips } from '../../store/slices/tripsSlice.js';
import ActivityCard from '../../components/features/ActivityCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';
import { mockActivities, mockTrips } from '../../utils/mockData.js';

export default function ActivitiesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiActivities = useSelector(selectActivities);
  const filters = useSelector(selectActivityFilters);
  const isLoading = useSelector(selectActivitiesLoading);
  const trips = useSelector(selectTrips);

  // States
  const [activitiesList, setActivitiesList] = useState([]);
  const [tripsList, setTripsList] = useState([]);

  // Modal states
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [selectedTripId, setSelectedTripId] = useState('');
  const [stopsList, setStopsList] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('planned');
  const [notes, setNotes] = useState('');
  const [openItineraryAfterAdd, setOpenItineraryAfterAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterCardRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const [countrySearchText, setCountrySearchText] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const fallbackCountries = [...new Set(mockActivities.map((a) => a.city?.country).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  const [countriesOfWorld, setCountriesOfWorld] = useState(fallbackCountries);

  // Fetch activities and trips on load
  useEffect(() => {
    dispatch(fetchActivities(filters));
    dispatch(fetchTrips());
  }, [dispatch, filters]);

  // Close filter panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterCardRef.current && !filterCardRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showFilters) {
      setShowCountryDropdown(false);
      setCountrySearchText('');
    }
  }, [showFilters]);

  // Load global countries list for the filter dropdown
  useEffect(() => {
    const fetchCountriesOfWorld = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const json = await response.json();

        if (json && !json.error && Array.isArray(json.data)) {
          const names = json.data.map((countryData) => countryData.country).sort((a, b) => a.localeCompare(b));
          setCountriesOfWorld(names);
        }
      } catch (err) {
        console.error('Failed to fetch countries of world for activities filter, using fallback list', err);
      }
    };

    fetchCountriesOfWorld();
  }, []);

  // Currency settings for dynamic price range slider
  const currencySettings = {
    'India': { symbol: '₹', max: 10000, step: 500, rate: 1 },
    'France': { symbol: '€', max: 150, step: 5, rate: 0.011 },
    'Japan': { symbol: '¥', max: 15000, step: 500, rate: 1.8 },
    'Indonesia': { symbol: 'Rp', max: 1500000, step: 50000, rate: 188 }
  };

  const activeCurrency = currencySettings[filters.country] || currencySettings['India'];

  // Handle local state / mock fallbacks
  useEffect(() => {
    if (apiActivities && apiActivities.length > 0) {
      setActivitiesList(apiActivities);
    } else {
      // Filter mock activities locally
      let filtered = [...mockActivities];
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(query) || 
          a.description.toLowerCase().includes(query)
        );
      }
      if (filters.category) {
        filtered = filtered.filter(a => a.category === filters.category);
      }
      if (filters.country) {
        filtered = filtered.filter(a => a.city?.country?.toLowerCase() === filters.country.toLowerCase());
      }
      if (filters.maxCost) {
        filtered = filtered.filter(a => a.estimatedCost <= Number(filters.maxCost));
      }
      if (filters.duration) {
        filtered = filtered.filter(a => a.duration?.value <= Number(filters.duration));
      }
      setActivitiesList(filtered);
    }
  }, [apiActivities, filters]);

  useEffect(() => {
    if (trips && trips.length > 0) {
      setTripsList(trips);
    } else {
      const saved = localStorage.getItem('globetrotter_trips');
      if (saved) {
        setTripsList(JSON.parse(saved));
      } else {
        localStorage.setItem('globetrotter_trips', JSON.stringify(mockTrips));
        setTripsList(mockTrips);
      }
    }
  }, [trips]);

  // Update stops dropdown when trip changes
  useEffect(() => {
    if (selectedTripId) {
      const trip = tripsList.find(t => t._id === selectedTripId);
      if (trip && trip.stops) {
        setStopsList(trip.stops);
        if (trip.stops.length > 0) {
          const activityCityName = selectedActivity?.city?.name?.toLowerCase();
          const matchingStop = activityCityName
            ? trip.stops.find((stop) => {
                const stopCityName = (stop.city?.name || stop.customCityName || '').toLowerCase();
                return stopCityName === activityCityName;
              })
            : null;
          const defaultStop = matchingStop || trip.stops[0];

          setSelectedStopId(defaultStop._id);
          setScheduledDate(defaultStop.arrivalDate ? defaultStop.arrivalDate.split('T')[0] : '');
        } else {
          setSelectedStopId('');
          setScheduledDate('');
        }
      }
    }
  }, [selectedTripId, tripsList, selectedActivity]);

  const handleSearchChange = (e) => {
    dispatch(setFilter({ search: e.target.value }));
  };

  const handleCategorySelect = (category) => {
    const current = filters.category === category ? '' : category;
    dispatch(setFilter({ category: current }));
  };

  const handleFilterSliderChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleResetFilters = () => {
    dispatch(clearFilters());
  };

  const openAddModal = (activity) => {
    setSelectedActivity(activity);
    setIsAddModalOpen(true);
    if (tripsList.length > 0) {
      const activityCityName = activity.city?.name?.toLowerCase();
      const tripWithMatchingStop = activityCityName
        ? tripsList.find((trip) =>
            (trip.stops || []).some((stop) => {
              const stopCityName = (stop.city?.name || stop.customCityName || '').toLowerCase();
              return stopCityName === activityCityName;
            })
          )
        : null;

      const defaultTrip = tripWithMatchingStop || tripsList[0];
      setSelectedTripId(defaultTrip._id);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedActivity(null);
    setScheduledDate('');
    setStartTime('');
    setEndTime('');
    setStatus('planned');
    setNotes('');
    setOpenItineraryAfterAdd(false);
  };

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !selectedStopId) {
      toast.error('Please select a trip and a stop first');
      return;
    }

    const payload = {
      activityId: selectedActivity._id.startsWith('act-') ? null : selectedActivity._id,
      customName: selectedActivity._id.startsWith('act-') ? selectedActivity.name : '',
      customDescription: selectedActivity.description,
      customCost: selectedActivity.estimatedCost,
      scheduledDate,
      startTime,
      endTime,
      status,
      notes
    };

    setIsAdding(true);
    try {
      await api.post(`/trips/${selectedTripId}/stops/${selectedStopId}/activities`, payload);
      const selectedTrip = tripsList.find((trip) => trip._id === selectedTripId);
      const selectedStop = stopsList.find((stop) => stop._id === selectedStopId);
      const stopName = selectedStop?.city?.name || selectedStop?.customCityName || 'selected stop';
      toast.success(`Added "${selectedActivity.name}" to ${selectedTrip?.name || 'trip'} → ${stopName}`);
      dispatch(fetchTrips());
      closeAddModal();
      if (openItineraryAfterAdd) {
        navigate(`/trips/${selectedTripId}/itinerary`);
      }
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
        const stopIdx = allLocalTrips[tripIdx].stops?.findIndex(s => s._id === selectedStopId);
        if (stopIdx !== -1 && stopIdx !== undefined) {
          const newAct = {
            _id: `trip-act-${Date.now()}`,
            tripStop: selectedStopId,
            trip: selectedTripId,
            activity: selectedActivity,
            customName: '',
            customDescription: '',
            customCost: 0,
            scheduledDate,
            startTime,
            endTime,
            status,
            order: allLocalTrips[tripIdx].stops[stopIdx].activities?.length || 0,
            notes
          };
          
          allLocalTrips[tripIdx].stops[stopIdx].activities = [
            ...(allLocalTrips[tripIdx].stops[stopIdx].activities || []),
            newAct
          ];
          
          localStorage.setItem('globetrotter_trips', JSON.stringify(allLocalTrips));
          setTripsList(allLocalTrips);
          const selectedTrip = allLocalTrips[tripIdx];
          const selectedStop = allLocalTrips[tripIdx].stops[stopIdx];
          const stopName = selectedStop?.city?.name || selectedStop?.customCityName || 'selected stop';
          toast.success(`Added "${selectedActivity.name}" to ${selectedTrip?.name || 'trip'} → ${stopName} (Demo Mode)`);
          if (openItineraryAfterAdd) {
            navigate(`/trips/${selectedTripId}/itinerary`);
          }
        } else {
          toast.error('Stop not found in selected trip.');
        }
      } else {
        toast.error('Trip not found.');
      }
      closeAddModal();
    } finally {
      setIsAdding(false);
    }
  };

  const categories = [
    { value: 'sightseeing', label: '🏛 Sightseeing' },
    { value: 'food', label: '🍕 Food' },
    { value: 'adventure', label: '🧗 Adventure' },
    { value: 'culture', label: '🎨 Culture' },
    { value: 'shopping', label: '🛍 Shopping' },
    { value: 'nature', label: '🌿 Nature' },
    { value: 'entertainment', label: '🎭 Entertainment' },
    { value: 'nightlife', label: '🍻 Nightlife' },
  ];

  const countries = [...new Set([
    ...countriesOfWorld,
    ...fallbackCountries,
    ...apiActivities.map((activity) => activity.city?.country).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));
  const selectedTrip = tripsList.find((trip) => trip._id === selectedTripId);
  const selectedStop = stopsList.find((stop) => stop._id === selectedStopId);
  const quickTripId = selectedTripId || tripsList[0]?._id || '';
  const quickTripName = selectedTrip?.name || tripsList[0]?.name || '';
  const selectedStopName = selectedStop?.city?.name || selectedStop?.customCityName || 'Selected stop';
  const selectedStopDate = selectedStop?.arrivalDate ? selectedStop.arrivalDate.split('T')[0] : '';
  const isCityMismatch = Boolean(
    selectedActivity?.city?.name &&
    selectedStopName &&
    selectedStopName.toLowerCase() !== selectedActivity.city.name.toLowerCase()
  );
  const filteredCountries = countrySearchText
    ? countries.filter((country) => country.toLowerCase().includes(countrySearchText.toLowerCase()))
    : countries;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Search Header Banner */}
      <div className="bg-white border-b border-surface-100 py-10 px-6 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-blue-navy mb-2">
            Explore Activities
          </h1>
          <p className="text-sm text-surface-500 max-w-lg mb-6">
            Find unique sightseeing, adventure, and food tours across destinations to fill your itinerary days.
          </p>
          <div className="mb-6 w-full max-w-xl rounded-2xl border border-surface-200 bg-white/90 px-4 py-3 text-left shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-surface-400 font-semibold">
                  Where activities are saved
                </p>
                <p className="text-sm text-surface-700 font-medium truncate">
                  {quickTripName ? `${quickTripName} itinerary` : 'Select a trip while adding an activity'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/trips')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-surface-200 text-surface-600 hover:border-brand-blue-light hover:text-brand-blue-medium hover:bg-brand-blue-pale/40 transition-colors"
                >
                  My Trips
                </button>
                {quickTripId ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/trips/${quickTripId}/itinerary`)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-teal-light text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white transition-colors"
                  >
                    View Itinerary
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/trips/create')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-teal-light text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white transition-colors"
                  >
                    Create Trip
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search Inputs */}
          <div
            ref={filterCardRef}
            className="w-full max-w-xl relative flex items-center bg-surface-50 border border-surface-200 rounded-2xl p-1.5 focus-within:border-brand-teal-medium transition-all"
          >
            <Search className="w-5 h-5 text-surface-400 ml-3" />
            <input
              type="text"
              placeholder="Search activities by keyword..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-surface-900 placeholder-surface-400 text-sm px-3 focus:outline-none"
            />
            {filters.search && (
              <button 
                onClick={() => dispatch(setFilter({ search: '' }))}
                className="p-1 hover:bg-surface-200 rounded-full text-surface-400 hover:text-surface-600 transition-colors mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ml-2 border ${
                showFilters 
                  ? 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/40 font-bold' 
                  : 'bg-white text-surface-500 border-surface-200 hover:bg-surface-100 hover:text-surface-800'
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-semibold max-sm:hidden">Filters</span>
            </button>

            {/* Collapsible Dropdown Filter Card */}
            {showFilters && (
              <div className="absolute top-full left-0 right-0 sm:left-full sm:right-auto sm:top-0 sm:ml-4 mt-3 sm:mt-0 bg-white border border-surface-200 rounded-3xl shadow-card-xl p-6 z-50 text-left animate-slide-up w-[300px] sm:w-[320px] max-w-[90vw]">
                {/* Left pointer triangle for desktop */}
                <div className="hidden sm:block absolute right-full top-4 translate-x-[1px] w-0 h-0 border-y-[10px] border-y-transparent border-r-[10px] border-r-white z-10"></div>
                <div className="hidden sm:block absolute right-full top-4 w-0 h-0 border-y-[10px] border-y-transparent border-r-[10px] border-r-surface-200"></div>
                
                <div className="flex items-center justify-between pb-3 border-b border-surface-100 mb-4">
                  <span className="font-display font-bold text-sm text-brand-blue-navy flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-teal-dark" /> Filter Options
                  </span>
                  {(filters.search || filters.category || filters.maxCost || filters.duration) && (
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setCountrySearchText('');
                        setShowCountryDropdown(false);
                      }}
                      className="text-xs text-brand-blue-medium hover:text-brand-blue-navy font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Country Filter */}
                  <div ref={countryDropdownRef} className="relative">
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-white cursor-text transition-all ${
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
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setFilter({ country: '', maxCost: '' }));
                            setCountrySearchText('');
                            setShowCountryDropdown(false);
                          }}
                          className="text-surface-300 hover:text-surface-600 transition-colors flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {filters.country && !showCountryDropdown && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-teal-pale text-brand-teal-dark text-xs font-semibold rounded-full">
                          {filters.country}
                          <button
                            onClick={() => {
                              dispatch(setFilter({ country: '', maxCost: '' }));
                              setCountrySearchText('');
                            }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    )}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div
                          className="px-4 py-2.5 text-sm text-surface-500 hover:bg-surface-50 cursor-pointer border-b border-surface-100"
                          onClick={() => {
                            dispatch(setFilter({ country: '', maxCost: '' }));
                            setCountrySearchText('');
                            setShowCountryDropdown(false);
                          }}
                        >
                          All Countries
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-surface-400 text-center">No countries found</div>
                          ) : filteredCountries.slice(0, 80).map((country) => (
                            <div
                              key={country}
                              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                filters.country === country
                                  ? 'bg-brand-teal-pale text-brand-teal-dark font-semibold'
                                  : 'text-surface-700 hover:bg-surface-50'
                              }`}
                              onClick={() => {
                                dispatch(setFilter({ country, maxCost: '' }));
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
                      </div>
                    )}
                  </div>

                  {/* Max Cost Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Max Cost</span>
                      <span className="text-brand-teal-dark font-bold">
                        {filters.maxCost ? `${activeCurrency.symbol}${Math.round(Number(filters.maxCost) * activeCurrency.rate).toLocaleString()}` : 'Any'}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={activeCurrency.max}
                      step={activeCurrency.step}
                      value={filters.maxCost ? Math.round(Number(filters.maxCost) * activeCurrency.rate) : activeCurrency.max}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= activeCurrency.max) {
                          dispatch(setFilter({ maxCost: '' }));
                        } else {
                          const inrVal = Math.round(val / activeCurrency.rate);
                          dispatch(setFilter({ maxCost: inrVal }));
                        }
                      }}
                      className="w-full accent-brand-teal-dark h-1.5 bg-surface-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                      <span>Free</span>
                      <span>{activeCurrency.symbol}{activeCurrency.max.toLocaleString()}+</span>
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Max Duration</span>
                      <span className="text-brand-teal-dark font-bold">
                        {filters.duration ? `${filters.duration} hrs` : 'Any'}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={filters.duration || '12'}
                      onChange={(e) => handleFilterSliderChange('duration', e.target.value)}
                      className="w-full accent-brand-teal-dark h-1.5 bg-surface-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                      <span>1 hr</span>
                      <span>12 hrs</span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex justify-end mt-4 pt-3 border-t border-surface-100">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-1.5 bg-brand-teal-dark text-white rounded-xl text-xs font-bold hover:bg-brand-teal-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Chips bar */}
        <div className="max-w-6xl mx-auto mt-8 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => {
            const isActive = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-display font-medium border transition-all ${
                  isActive
                    ? 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/60 shadow-sm'
                    : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Right Main Grid */}
          <main className="flex-grow">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <RefreshCw className="w-10 h-10 text-brand-teal-dark animate-spin mb-4" />
                <p className="text-sm text-surface-500">Searching activities...</p>
              </div>
            ) : activitiesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activitiesList.map(activity => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    onAddToStop={openAddModal}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-surface-100 p-16 text-center shadow-sm">
                <Clock className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-display font-bold text-brand-blue-navy mb-1">
                  No Activities Found
                </h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto mb-6">
                  We couldn't find any activities matching your keywords or filters. Try adjusting the cost or category.
                </p>
                <Button 
                  onClick={handleResetFilters}
                  variant="outline"
                  className="border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-pale"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Add activity to stop modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={`Add ${selectedActivity?.name} to Trip Stop`}
        size="md"
      >
        <form onSubmit={handleAddActivitySubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="input-label">Select Trip</label>
              {tripsList.length > 0 ? (
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                  required
                >
                  <option value="" disabled>-- Select a Trip --</option>
                  {tripsList.map(trip => (
                    <option key={trip._id} value={trip._id}>{trip.name}</option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <p className="text-xs text-amber-700">No active trips found. Create a trip on the dashboard first.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/trips/create')}
                    className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Create New Trip
                  </Button>
                </div>
              )}
            </div>

            {selectedTripId && (
              <div>
                <label className="input-label">Select Destination Stop</label>
                {stopsList.length > 0 ? (
                  <select
                    value={selectedStopId}
                    onChange={(e) => {
                      const stop = stopsList.find(s => s._id === e.target.value);
                      setSelectedStopId(e.target.value);
                      if (stop) {
                        setScheduledDate(stop.arrivalDate ? stop.arrivalDate.split('T')[0] : '');
                      }
                    }}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    required
                  >
                    {stopsList.map(stop => (
                      <option key={stop._id} value={stop._id}>
                        {stop.city?.name || stop.customCityName || 'Custom Stop'} ({stop.arrivalDate ? stop.arrivalDate.split('T')[0] : ''})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <p className="text-xs text-amber-700">No stops created for this trip yet. Add a city stop first.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/trips/${selectedTripId}/itinerary`)}
                      className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      Open Trip Itinerary
                    </Button>
                  </div>
                )}
              </div>
            )}

            {selectedTripId && selectedStopId && (
              <div className="rounded-xl border border-brand-teal-light/40 bg-brand-teal-pale/40 p-3">
                <p className="text-xs font-semibold text-brand-blue-navy flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-teal-dark" />
                  This activity will be added to:
                </p>
                <p className="text-sm font-bold text-brand-blue-navy mt-1">
                  {selectedTrip?.name || 'Selected Trip'} → {selectedStopName}{selectedStopDate ? ` (${selectedStopDate})` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/trips/${selectedTripId}/itinerary`)}
                    className="border-brand-teal-light text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                  >
                    View This Itinerary
                  </Button>
                </div>
                {isCityMismatch && (
                  <p className="text-[11px] text-amber-700 mt-1.5">
                    Tip: This activity is in {selectedActivity?.city?.name}. You can switch to that city stop if available.
                  </p>
                )}
              </div>
            )}
          </div>

          {selectedStopId && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3">
                  <label className="input-label flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal-dark" /> Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="input-label flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-teal-dark" /> Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="input-label flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-teal-dark" /> End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="input-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                  >
                    <option value="planned">Planned</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Notes / Instructions</label>
                <textarea
                  placeholder="e.g. Booking confirmation details, meeting spot details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-surface-600">
                <input
                  type="checkbox"
                  checked={openItineraryAfterAdd}
                  onChange={(e) => setOpenItineraryAfterAdd(e.target.checked)}
                  className="rounded border-surface-300 text-brand-teal-dark focus:ring-brand-teal-medium"
                />
                Open itinerary page after adding
              </label>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button type="button" variant="ghost" onClick={closeAddModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={isAdding}
              disabled={!selectedStopId}
              className="bg-brand-teal-dark hover:bg-brand-teal-medium text-white px-6"
            >
              {selectedStopId ? `Add to ${selectedStopName}` : 'Add Activity'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

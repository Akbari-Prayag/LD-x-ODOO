import React, { useEffect, useState } from 'react';
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

  // Fetch cities and trips on load
  useEffect(() => {
    dispatch(fetchCities(filters));
    dispatch(fetchTrips());
  }, [dispatch, filters]);

  // Currency settings for dynamic price range slider
  const currencySettings = {
    'India': { symbol: '₹', max: 15000, step: 500, rate: 1 },
    'France': { symbol: '€', max: 200, step: 5, rate: 0.011 },
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
        filtered = filtered.filter(c => c.country.toLowerCase().includes(filters.country.toLowerCase()));
      }
      if (filters.region) {
        filtered = filtered.filter(c => c.region.toLowerCase() === filters.region.toLowerCase());
      }
      if (filters.maxCost) {
        filtered = filtered.filter(c => c.avgDailyCost <= Number(filters.maxCost));
      }
      // Sort mock cities
      if (filters.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters.sortBy === 'cost') {
        filtered.sort((a, b) => a.avgDailyCost - b.avgDailyCost);
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
    dispatch(setFilter({ search: e.target.value }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleCountryChange = (countryName) => {
    // Determine regions of the new country to check if current region is valid
    const newAvailableRegions = countryName
      ? [...new Set(mockCities.filter(c => c.country === countryName).map(c => c.region))]
      : [...new Set(mockCities.map(c => c.region))];
    
    const isRegionValid = newAvailableRegions.includes(filters.region);

    // If changing country, reset maxCost to the default of the new country
    const newCurrency = currencySettings[countryName] || currencySettings['India'];
    
    dispatch(setFilter({
      country: countryName,
      region: isRegionValid ? filters.region : '',
      maxCost: '' // Clear cost filter to show full range
    }));
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

  // Get distinct countries from mock data for filters
  const countries = [...new Set(mockCities.map(c => c.country))];
  const availableRegions = filters.country
    ? [...new Set(mockCities.filter(c => c.country === filters.country).map(c => c.region))]
    : [...new Set(mockCities.map(c => c.region))];

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Premium Hero Banner */}
      <div 
        style={{ backgroundImage: 'linear-gradient(135deg, #2b3e8c 0%, #618d83 100%)' }} 
        className="relative text-white py-16 px-6 sm:px-12 rounded-3xl mb-8 shadow-card-md"
      >
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-teal-light via-transparent to-brand-blue-light"></div>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-brand-teal-medium/20 blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
          <Compass className="w-12 h-12 text-brand-teal-light mb-4 animate-spin-slow" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Find Your Next Adventure
          </h1>
          <p className="text-base text-brand-teal-pale max-w-xl mb-8 leading-relaxed font-sans font-medium">
            Discover historic landmarks, coastal resorts, and bustling metropolises. Filter by cost, location, or popularity to plan your perfect escape.
          </p>

          {/* Floating Search Bar */}
          <div className="w-full max-w-xl relative flex items-center bg-white rounded-2xl p-1.5 shadow-card-lg border border-white/20">
            <Search className="w-5 h-5 text-surface-400 ml-3" />
            <input
              type="text"
              placeholder="Search by city, country, or region..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-surface-900 placeholder-surface-400 text-sm px-3 focus:outline-none"
            />
            {filters.search && (
              <button 
                onClick={() => dispatch(setFilter({ search: '' }))}
                className="p-1 hover:bg-surface-100 rounded-full text-surface-400 hover:text-surface-600 transition-colors mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ml-2 border ${
                showFilters 
                  ? 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/40 font-bold' 
                  : 'bg-surface-50 text-surface-500 border-surface-200 hover:bg-surface-100 hover:text-surface-800'
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
                  {(filters.search || filters.country || filters.region || filters.maxCost) && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-brand-blue-medium hover:text-brand-blue-navy font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Country Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <select
                      value={filters.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Region
                    </label>
                    <select
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    >
                      <option value="">All Regions</option>
                      {availableRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Cost Range Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Max Daily Cost</span>
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
                          handleFilterChange('maxCost', '');
                        } else {
                          const inrVal = Math.round(val / activeCurrency.rate);
                          handleFilterChange('maxCost', inrVal);
                        }
                      }}
                      className="w-full accent-brand-teal-dark h-1.5 bg-surface-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                      <span>Free</span>
                      <span>{activeCurrency.symbol}{activeCurrency.max.toLocaleString()}+</span>
                    </div>
                  </div>

                  {/* Sorting Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="name">City Name</option>
                      <option value="cost">Average Cost</option>
                    </select>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Main Grid */}
          <main className="flex-grow">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <RefreshCw className="w-10 h-10 text-brand-teal-dark animate-spin mb-4" />
                <p className="text-sm text-surface-500">Discovering matching cities...</p>
              </div>
            ) : citiesList.length > 0 ? (
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
              <div className="bg-white rounded-3xl border border-surface-100 p-16 text-center shadow-sm">
                <Compass className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-display font-bold text-brand-blue-navy mb-1">
                  No Cities Found
                </h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto mb-6">
                  We couldn't find any destinations matching your criteria. Try adjusting or clearing your filters.
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

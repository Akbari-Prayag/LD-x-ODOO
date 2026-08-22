import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, RefreshCw, X, Calendar, Clock, DollarSign } from 'lucide-react';
import { fetchActivities, setFilter, clearFilters, selectActivities, selectActivityFilters, selectActivitiesLoading } from '../../store/slices/activitiesSlice.js';
import { fetchTrips, selectTrips } from '../../store/slices/tripsSlice.js';
import ActivityCard from '../../components/features/ActivityCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';
import { mockActivities, mockTrips } from '../../utils/mockData.js';

export default function ActivitiesPage() {
  const dispatch = useDispatch();
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
  const [isAdding, setIsAdding] = useState(false);
<<<<<<< HEAD
=======
  const [showFilters, setShowFilters] = useState(false);
>>>>>>> feature/jinay-itinerary-discovery

  // Fetch activities and trips on load
  useEffect(() => {
    dispatch(fetchActivities(filters));
    dispatch(fetchTrips());
  }, [dispatch, filters]);

<<<<<<< HEAD
=======
  // Currency settings for dynamic price range slider
  const currencySettings = {
    'India': { symbol: '₹', max: 10000, step: 500, rate: 1 },
    'France': { symbol: '€', max: 150, step: 5, rate: 0.011 },
    'Japan': { symbol: '¥', max: 15000, step: 500, rate: 1.8 },
    'Indonesia': { symbol: 'Rp', max: 1500000, step: 50000, rate: 188 }
  };

  const activeCurrency = currencySettings[filters.country] || currencySettings['India'];

>>>>>>> feature/jinay-itinerary-discovery
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
<<<<<<< HEAD
=======
      if (filters.country) {
        filtered = filtered.filter(a => a.city?.country.toLowerCase() === filters.country.toLowerCase());
      }
>>>>>>> feature/jinay-itinerary-discovery
      if (filters.maxCost) {
        filtered = filtered.filter(a => a.estimatedCost <= Number(filters.maxCost));
      }
      if (filters.duration) {
        filtered = filtered.filter(a => a.duration.value <= Number(filters.duration));
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
          setSelectedStopId(trip.stops[0]._id);
          setScheduledDate(trip.stops[0].arrivalDate ? trip.stops[0].arrivalDate.split('T')[0] : '');
        } else {
          setSelectedStopId('');
          setScheduledDate('');
        }
      }
    }
  }, [selectedTripId, tripsList]);

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
      setSelectedTripId(tripsList[0]._id);
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
      toast.success(`Successfully added ${selectedActivity.name} to your stop!`);
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
          toast.success(`${selectedActivity.name} added to stop locally (Demo Mode)`);
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

<<<<<<< HEAD
=======
  const countries = [...new Set(mockActivities.map(a => a.city?.country).filter(Boolean))];

>>>>>>> feature/jinay-itinerary-discovery
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

          {/* Search Inputs */}
          <div className="w-full max-w-xl relative flex items-center bg-surface-50 border border-surface-200 rounded-2xl p-1.5 focus-within:border-brand-teal-medium transition-all">
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
                      onChange={(e) => dispatch(setFilter({ country: e.target.value, maxCost: '' }))}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
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
                  </div>
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
              Add Activity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

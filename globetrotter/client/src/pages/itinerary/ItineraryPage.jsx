import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, MapPin, Calendar, Clock, DollarSign, GripVertical, Plus, 
  Trash2, Edit, Save, Check, RefreshCw, AlertCircle, Compass, Star, Search
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { fetchTrip, selectCurrentTrip, selectTripsLoading } from '../../store/slices/tripsSlice.js';
import api from '../../services/api.js';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { mockCities, mockActivities, mockTrips } from '../../utils/mockData.js';

// ─── Drag and Drop Item: Sortable Stop Card ────────────────────
function SortableStopItem({ stop, isSelected, onClick, onDelete, dragEnabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop._id,
    disabled: !dragEnabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const formattedArrival = stop.arrivalDate ? new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const formattedDeparture = stop.departureDate ? new Date(stop.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3.5 mb-2 rounded-2xl border transition-all ${
        isSelected
          ? 'bg-brand-teal-pale border-brand-teal-light shadow-sm text-brand-blue-navy'
          : 'bg-white border-surface-150 hover:border-brand-teal-light text-surface-700'
      }`}
    >
      {/* Drag handle */}
      {dragEnabled && (
        <button
          type="button"
          className="text-surface-300 hover:text-surface-500 cursor-grab active:cursor-grabbing p-0.5 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      {/* Main info */}
      <div className="flex-grow cursor-pointer select-none" onClick={onClick}>
        <h4 className="font-display font-bold text-sm line-clamp-1">
          {stop.city?.name || stop.customCityName || 'Custom Stop'}
        </h4>
        <p className="text-[10px] text-surface-450 font-semibold flex items-center gap-1 mt-0.5">
          <Calendar className="w-3 h-3 text-brand-teal-dark" />
          <span>{formattedArrival} - {formattedDeparture}</span>
        </p>
        <span className="inline-block text-[9px] bg-white border border-surface-200 px-2 py-0.5 rounded-full mt-1.5 font-bold text-surface-600">
          💼 {stop.activities?.length || 0} Activities
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(stop._id);
        }}
        className="p-1.5 hover:bg-rose-50 text-surface-300 hover:text-rose-600 rounded-xl transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Drag and Drop Item: Sortable Activity Card ────────────────
function SortableActivityItem({ activity, onEdit, onDelete, dragEnabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity._id,
    disabled: !dragEnabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status) => {
    const map = {
      planned: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      booked: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      completed: 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/35',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-150',
    };
    return map[status] || 'bg-surface-50 text-surface-600 border-surface-200';
  };

  const actName = activity.activity?.name || activity.customName || 'Activity';
  const actCost = activity.activity ? activity.activity.estimatedCost : activity.customCost;
  const actTime = activity.startTime ? `${activity.startTime} - ${activity.endTime}` : 'No Time set';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border border-surface-150 rounded-2xl shadow-sm hover:border-brand-teal-light transition-all mb-3"
    >
      {/* Drag handle */}
      {dragEnabled && (
        <button
          type="button"
          className="text-surface-300 hover:text-surface-500 cursor-grab active:cursor-grabbing p-1 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      {/* Info */}
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={`text-[9px] border font-bold px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
            {activity.status.toUpperCase()}
          </span>
          {activity.activity?.category && (
            <span className="text-[9px] bg-surface-50 text-surface-500 font-semibold px-2 py-0.5 rounded-full">
              {activity.activity.category}
            </span>
          )}
        </div>
        <h4 className="font-display font-bold text-sm text-brand-blue-navy">{actName}</h4>
        
        {/* Specs */}
        <div className="flex items-center gap-3 text-[10px] text-surface-500 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-teal-dark" /> {actTime}
          </span>
          <span className="flex items-center gap-1 font-semibold text-brand-blue-navy">
            <DollarSign className="w-3.5 h-3.5 text-brand-teal-dark" /> {actCost === 0 ? 'Free' : `₹${actCost}`}
          </span>
        </div>

        {activity.notes && (
          <p className="text-[10px] text-surface-450 bg-surface-50 px-2.5 py-1.5 rounded-xl border border-surface-100 mt-2 leading-relaxed">
            📝 {activity.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(activity)}
          className="p-1.5 hover:bg-surface-100 text-surface-400 hover:text-surface-700 rounded-xl transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(activity._id)}
          className="p-1.5 hover:bg-rose-50 text-surface-400 hover:text-rose-600 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function ItineraryPage() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const apiTrip = useSelector(selectCurrentTrip);
  const isLoading = useSelector(selectTripsLoading);

  // Local state for full offline fallback
  const [trip, setTrip] = useState(null);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [selectedStop, setSelectedStop] = useState(null);

  // Edit Accommodation states
  const [accName, setAccName] = useState('');
  const [accAddress, setAccAddress] = useState('');
  const [accCost, setAccCost] = useState('0');
  const [isSavingAcc, setIsSavingAcc] = useState(false);

  // Modals
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isCustomActModalOpen, setIsCustomActModalOpen] = useState(false);
  const [editActivityObj, setEditActivityObj] = useState(null);

  // Search in modal
  const [cityQuery, setCityQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [actQuery, setActQuery] = useState('');
  const [filteredActs, setFilteredActs] = useState([]);

  // Form states for new stop
  const [newStopArrival, setNewStopArrival] = useState('');
  const [newStopDeparture, setNewStopDeparture] = useState('');
  
  // Custom Activity Form states
  const [customActName, setCustomActName] = useState('');
  const [customActDesc, setCustomActDesc] = useState('');
  const [customActCost, setCustomActCost] = useState('0');
  const [customActDate, setCustomActDate] = useState('');
  const [customActStart, setCustomActStart] = useState('');
  const [customActEnd, setCustomActEnd] = useState('');
  const [customActStatus, setCustomActStatus] = useState('planned');
  const [customActNotes, setCustomActNotes] = useState('');

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 1. Initial Data Loading
  useEffect(() => {
    dispatch(fetchTrip(tripId));
  }, [dispatch, tripId]);

  // Sync redux state or local fallbacks to local state
  useEffect(() => {
    if (apiTrip && apiTrip._id === tripId) {
      setTrip(apiTrip);
    } else {
      // Offline fallback: load from localstorage or use mock data
      let allTrips = [];
      const saved = localStorage.getItem('globetrotter_trips');
      if (saved) {
        allTrips = JSON.parse(saved);
      } else {
        // Hydrate localstorage with mock trips
        allTrips = [...mockTrips];
        localStorage.setItem('globetrotter_trips', JSON.stringify(allTrips));
      }

      const found = allTrips.find(t => t._id === tripId);
      if (found) {
        setTrip(found);
      } else {
        // If not found, create a new mock trip skeleton matching tripId
        const newMock = {
          ...mockTrips[0],
          _id: tripId,
          name: 'My Custom Roadtrip',
          stops: []
        };
        allTrips.push(newMock);
        localStorage.setItem('globetrotter_trips', JSON.stringify(allTrips));
        setTrip(newMock);
      }
    }
  }, [apiTrip, tripId]);

  // Set selected stop
  useEffect(() => {
    if (trip && trip.stops) {
      // Sort stops by order
      const sortedStops = [...trip.stops].sort((a, b) => a.order - b.order);
      
      // If no stop selected, select first
      if (!selectedStopId && sortedStops.length > 0) {
        setSelectedStopId(sortedStops[0]._id);
      }
      
      const found = sortedStops.find(s => s._id === selectedStopId);
      setSelectedStop(found || null);
    } else {
      setSelectedStop(null);
    }
  }, [trip, selectedStopId]);

  // Set accommodation details fields
  useEffect(() => {
    if (selectedStop) {
      setAccName(selectedStop.accommodation?.name || '');
      setAccAddress(selectedStop.accommodation?.address || '');
      setAccCost(selectedStop.accommodation?.cost?.toString() || '0');
    }
  }, [selectedStop]);

  // Save changes locally and optionally in DB
  const saveTripState = async (updatedTrip) => {
    setTrip(updatedTrip);
    
    // Save to LocalStorage for fallback
    let allTrips = [];
    const saved = localStorage.getItem('globetrotter_trips');
    if (saved) {
      allTrips = JSON.parse(saved);
    }
    const idx = allTrips.findIndex(t => t._id === updatedTrip._id);
    if (idx !== -1) {
      allTrips[idx] = updatedTrip;
    } else {
      allTrips.push(updatedTrip);
    }
    localStorage.setItem('globetrotter_trips', JSON.stringify(allTrips));
  };

  // 2. Drag & Drop Reordering logic
  const handleStopsDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = trip.stops.findIndex(s => s._id === active.id);
    const newIndex = trip.stops.findIndex(s => s._id === over.id);

    const reorderedStops = arrayMove([...trip.stops], oldIndex, newIndex);
    // Update order key
    reorderedStops.forEach((s, idx) => {
      s.order = idx;
    });

    const updatedTrip = { ...trip, stops: reorderedStops };
    await saveTripState(updatedTrip);

    try {
      const stopIds = reorderedStops.map(s => s._id);
      await api.patch(`/trips/${tripId}/stops/reorder`, { stopIds });
    } catch (err) {
      console.warn('Reorder API failed. Persistent offline state saved.', err);
    }
  };

  const handleActivitiesDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedStop) return;

    const oldIndex = selectedStop.activities.findIndex(a => a._id === active.id);
    const newIndex = selectedStop.activities.findIndex(a => a._id === over.id);

    const reorderedActs = arrayMove([...selectedStop.activities], oldIndex, newIndex);
    reorderedActs.forEach((a, idx) => {
      a.order = idx;
    });

    // Update locally
    const updatedStops = trip.stops.map(s => {
      if (s._id === selectedStopId) {
        return { ...s, activities: reorderedActs };
      }
      return s;
    });

    const updatedTrip = { ...trip, stops: updatedStops };
    await saveTripState(updatedTrip);

    try {
      const activityIds = reorderedActs.map(a => a._id);
      await api.patch(`/trips/${tripId}/stops/${selectedStopId}/activities/reorder`, { activityIds });
    } catch (err) {
      console.warn('Activity reorder API failed. Saved locally.', err);
    }
  };

  // 3. Accommodation Updates
  const handleSaveAccommodation = async () => {
    if (!selectedStop) return;
    setIsSavingAcc(true);

    const acc = {
      name: accName,
      address: accAddress,
      cost: Number(accCost) || 0
    };

    const updatedStops = trip.stops.map(s => {
      if (s._id === selectedStopId) {
        return { ...s, accommodation: acc };
      }
      return s;
    });

    const updatedTrip = { ...trip, stops: updatedStops };
    await saveTripState(updatedTrip);

    try {
      await api.put(`/trips/${tripId}/stops/${selectedStopId}`, { accommodation: acc });
      toast.success('Accommodation details updated successfully!');
    } catch (err) {
      console.warn('API error, updated details locally.', err);
      toast.success('Accommodation saved locally (Demo Mode)!');
    } finally {
      setIsSavingAcc(false);
    }
  };

  // 4. Add/Delete Stop
  const handleAddStop = async (city) => {
    const payload = {
      cityId: city._id.startsWith('city-') ? null : city._id,
      customCityName: city._id.startsWith('city-') ? city.name : '',
      arrivalDate: newStopArrival || trip.startDate,
      departureDate: newStopDeparture || trip.endDate,
      accommodation: { name: '', address: '', cost: 0 },
      notes: ''
    };

    try {
      const { data } = await api.post(`/trips/${tripId}/stops`, payload);
      await saveTripState(data.trip);
      toast.success(`Stop "${city.name}" added to trip!`);
    } catch (err) {
      console.warn('API error adding stop, doing local simulation', err);
      const newStop = {
        _id: `stop-${Date.now()}`,
        trip: tripId,
        city: city,
        customCityName: '',
        arrivalDate: newStopArrival || trip.startDate,
        departureDate: newStopDeparture || trip.endDate,
        notes: '',
        order: trip.stops?.length || 0,
        accommodation: { name: '', address: '', cost: 0 },
        activities: []
      };

      const updatedTrip = { ...trip, stops: [...(trip.stops || []), newStop] };
      await saveTripState(updatedTrip);
      setSelectedStopId(newStop._id);
      toast.success(`Stop "${city.name}" added locally (Demo Mode)`);
    } finally {
      setIsCityModalOpen(false);
      setCityQuery('');
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to remove this stop and all its activities?')) return;

    try {
      const { data } = await api.delete(`/trips/${tripId}/stops/${stopId}`);
      await saveTripState(data.trip);
      if (selectedStopId === stopId) {
        setSelectedStopId(data.trip.stops?.[0]?._id || '');
      }
      toast.success('Stop removed.');
    } catch (err) {
      console.warn('API remove failed, simulating locally.', err);
      const remainingStops = trip.stops.filter(s => s._id !== stopId);
      remainingStops.forEach((s, idx) => s.order = idx);
      
      const updatedTrip = { ...trip, stops: remainingStops };
      await saveTripState(updatedTrip);
      
      if (selectedStopId === stopId) {
        setSelectedStopId(remainingStops[0]?._id || '');
      }
      toast.success('Stop removed locally (Demo Mode)');
    }
  };

  // 5. Add/Update/Delete Activities
  const handleAddActivity = async (activity) => {
    const payload = {
      activityId: activity._id.startsWith('act-') ? null : activity._id,
      customName: activity._id.startsWith('act-') ? activity.name : '',
      customDescription: activity.description,
      customCost: activity.estimatedCost,
      scheduledDate: selectedStop.arrivalDate,
      startTime: '',
      endTime: '',
      status: 'planned',
      notes: ''
    };

    try {
      const { data } = await api.post(`/trips/${tripId}/stops/${selectedStopId}/activities`, payload);
      await saveTripState(data.trip);
      toast.success('Activity added to your stop!');
    } catch (err) {
      console.warn('API failed, adding activity locally.', err);
      const newAct = {
        _id: `trip-act-${Date.now()}`,
        tripStop: selectedStopId,
        trip: tripId,
        activity: activity,
        customName: '',
        customDescription: '',
        customCost: 0,
        scheduledDate: selectedStop.arrivalDate,
        startTime: '',
        endTime: '',
        status: 'planned',
        order: selectedStop.activities?.length || 0,
        notes: ''
      };

      const updatedStops = trip.stops.map(s => {
        if (s._id === selectedStopId) {
          return { ...s, activities: [...(s.activities || []), newAct] };
        }
        return s;
      });

      const updatedTrip = { ...trip, stops: updatedStops };
      await saveTripState(updatedTrip);
      toast.success('Activity added locally (Demo Mode)');
    } finally {
      setIsActivityModalOpen(false);
      setActQuery('');
    }
  };

  const handleCustomActivitySubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      customName: customActName,
      customDescription: customActDesc,
      customCost: Number(customActCost) || 0,
      scheduledDate: customActDate || selectedStop.arrivalDate,
      startTime: customActStart,
      endTime: customActEnd,
      status: customActStatus,
      notes: customActNotes
    };

    try {
      if (editActivityObj) {
        // Edit mode
        const { data } = await api.put(`/trips/${tripId}/stops/${selectedStopId}/activities/${editActivityObj._id}`, payload);
        await saveTripState(data.trip);
        toast.success('Activity updated!');
      } else {
        // Add mode
        const { data } = await api.post(`/trips/${tripId}/stops/${selectedStopId}/activities`, payload);
        await saveTripState(data.trip);
        toast.success('Custom activity added!');
      }
    } catch (err) {
      console.warn('API error, handling locally.', err);
      
      if (editActivityObj) {
        // Update locally
        const updatedStops = trip.stops.map(s => {
          if (s._id === selectedStopId) {
            const actIdx = s.activities.findIndex(a => a._id === editActivityObj._id);
            if (actIdx !== -1) {
              const updatedActivities = [...s.activities];
              updatedActivities[actIdx] = {
                ...updatedActivities[actIdx],
                ...payload
              };
              return { ...s, activities: updatedActivities };
            }
          }
          return s;
        });

        const updatedTrip = { ...trip, stops: updatedStops };
        await saveTripState(updatedTrip);
        toast.success('Activity updated locally (Demo Mode)');
      } else {
        // Create locally
        const newAct = {
          _id: `trip-act-${Date.now()}`,
          tripStop: selectedStopId,
          trip: tripId,
          activity: null,
          order: selectedStop.activities?.length || 0,
          ...payload
        };

        const updatedStops = trip.stops.map(s => {
          if (s._id === selectedStopId) {
            return { ...s, activities: [...(s.activities || []), newAct] };
          }
          return s;
        });

        const updatedTrip = { ...trip, stops: updatedStops };
        await saveTripState(updatedTrip);
        toast.success('Custom activity added locally (Demo Mode)');
      }
    } finally {
      setIsCustomActModalOpen(false);
      setEditActivityObj(null);
      resetCustomActForm();
    }
  };

  const resetCustomActForm = () => {
    setCustomActName('');
    setCustomActDesc('');
    setCustomActCost('0');
    setCustomActDate('');
    setCustomActStart('');
    setCustomActEnd('');
    setCustomActStatus('planned');
    setCustomActNotes('');
  };

  const handleEditActivityClick = (act) => {
    setEditActivityObj(act);
    setCustomActName(act.activity?.name || act.customName || '');
    setCustomActDesc(act.activity?.description || act.customDescription || '');
    setCustomActCost((act.activity ? act.activity.estimatedCost : act.customCost || 0).toString());
    setCustomActDate(act.scheduledDate ? act.scheduledDate.split('T')[0] : '');
    setCustomActStart(act.startTime || '');
    setCustomActEnd(act.endTime || '');
    setCustomActStatus(act.status || 'planned');
    setCustomActNotes(act.notes || '');
    setIsCustomActModalOpen(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { data } = await api.delete(`/trips/${tripId}/stops/${selectedStopId}/activities/${activityId}`);
      await saveTripState(data.trip);
      toast.success('Activity removed.');
    } catch (err) {
      console.warn('API error, removing locally.', err);
      const remainingActs = selectedStop.activities.filter(a => a._id !== activityId);
      remainingActs.forEach((a, idx) => a.order = idx);

      const updatedStops = trip.stops.map(s => {
        if (s._id === selectedStopId) {
          return { ...s, activities: remainingActs };
        }
        return s;
      });

      const updatedTrip = { ...trip, stops: updatedStops };
      await saveTripState(updatedTrip);
      toast.success('Activity removed locally (Demo Mode)');
    }
  };

  // Search list filtration (Local)
  useEffect(() => {
    if (cityQuery) {
      setFilteredCities(
        mockCities.filter(c => 
          c.name.toLowerCase().includes(cityQuery.toLowerCase()) || 
          c.country.toLowerCase().includes(cityQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCities(mockCities.slice(0, 4));
    }
  }, [cityQuery]);

  useEffect(() => {
    if (actQuery) {
      setFilteredActs(
        mockActivities.filter(a => 
          a.name.toLowerCase().includes(actQuery.toLowerCase()) || 
          a.description.toLowerCase().includes(actQuery.toLowerCase())
        )
      );
    } else {
      setFilteredActs(mockActivities.slice(0, 4));
    }
  }, [actQuery]);

  if (isLoading && !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-10 h-10 text-brand-teal-dark animate-spin mb-4" />
        <p className="text-sm text-surface-500">Loading your trip board...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20 bg-white border border-surface-150 rounded-3xl p-12 max-w-lg mx-auto mt-12 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-display font-bold text-brand-blue-navy mb-2">Trip Not Found</h3>
        <p className="text-sm text-surface-500 mb-6">We couldn't retrieve this trip details. Please go back to Dashboard.</p>
        <Button onClick={() => navigate('/dashboard')} variant="primary" className="bg-brand-blue-medium hover:bg-brand-blue-navy">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const tripStopsSorted = trip.stops ? [...trip.stops].sort((a, b) => a.order - b.order) : [];
  const selectedStopActivitiesSorted = selectedStop?.activities ? [...selectedStop.activities].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="min-h-screen bg-surface-50">
      
      {/* Back button and trip title header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/trips')}
            className="p-2 bg-white hover:bg-surface-100 border border-surface-200 text-surface-600 hover:text-surface-900 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-brand-blue-navy">
              {trip.name}
            </h1>
            <p className="text-xs text-surface-450 font-semibold flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-teal-dark" />
              <span>
                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
          </div>
        </div>

        {/* Stats card */}
        <div className="flex gap-4">
          <div className="bg-white border border-surface-150 px-4 py-2 rounded-2xl flex flex-col justify-center">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-surface-400">Budget Limit</span>
            <span className="text-sm font-bold text-brand-blue-navy">₹{trip.budget.toLocaleString()}</span>
          </div>
          <div className="bg-brand-teal-pale border border-brand-teal-light/40 px-4 py-2 rounded-2xl flex flex-col justify-center">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-teal-dark">Total Spent</span>
            <span className="text-sm font-bold text-brand-teal-dark">₹{(trip.totalSpent || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left stops sidebar */}
        <div className="lg:col-span-1 bg-white border border-surface-150 rounded-2xl p-5 shadow-sm flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-surface-100 mb-4">
            <h3 className="font-display font-bold text-sm text-brand-blue-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-teal-dark" /> Route Stops
            </h3>
            <span className="text-[10px] text-surface-400 font-semibold bg-surface-50 border border-surface-150 px-2 py-0.5 rounded-full">
              {tripStopsSorted.length} stops
            </span>
          </div>

          {/* Stops List with DnD */}
          <div className="flex-grow overflow-y-auto pr-1">
            {tripStopsSorted.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleStopsDragEnd}
              >
                <SortableContext
                  items={tripStopsSorted.map(s => s._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tripStopsSorted.map(stop => (
                    <SortableStopItem
                      key={stop._id}
                      stop={stop}
                      isSelected={selectedStopId === stop._id}
                      onClick={() => setSelectedStopId(stop._id)}
                      onDelete={handleDeleteStop}
                      dragEnabled={tripStopsSorted.length > 1}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-12 px-4 border border-dashed border-surface-200 rounded-2xl">
                <Compass className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-xs text-surface-500 font-medium">No stops added yet.</p>
                <p className="text-[10px] text-surface-400 mt-1 mb-4">Start planning your route stops.</p>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              setNewStopArrival(trip.startDate.split('T')[0]);
              setNewStopDeparture(trip.endDate.split('T')[0]);
              setIsCityModalOpen(true);
            }}
            variant="outline"
            className="w-full border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-pale mt-4 font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Destination Stop
          </Button>
        </div>

        {/* Right activities detailed panel */}
        <div className="lg:col-span-2 flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
          
          {selectedStop ? (
            <div className="bg-white border border-surface-150 rounded-2xl p-6 shadow-sm flex flex-col h-full overflow-hidden">
              
              {/* Stop header details */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-surface-100 mb-5">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-teal-dark">Destination Details</span>
                  <h2 className="text-lg font-display font-extrabold text-brand-blue-navy mt-0.5">
                    {selectedStop.city?.name || selectedStop.customCityName || 'Custom Stop'}
                  </h2>
                  <p className="text-xs text-surface-450 font-medium mt-0.5">
                    {selectedStop.city?.country || 'India'} • {new Date(selectedStop.arrivalDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} to {new Date(selectedStop.departureDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsActivityModalOpen(true)}
                    variant="primary"
                    size="sm"
                    className="bg-brand-teal-dark hover:bg-brand-teal-medium text-white text-xs px-4 py-2"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Search Activity
                  </Button>
                  <Button
                    onClick={() => {
                      setEditActivityObj(null);
                      resetCustomActForm();
                      setCustomActDate(selectedStop.arrivalDate ? selectedStop.arrivalDate.split('T')[0] : '');
                      setIsCustomActModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-brand-blue-light text-brand-blue-medium hover:bg-brand-blue-pale text-xs px-4 py-2"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Custom Activity
                  </Button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto pr-1">
                {/* Editable Accommodation form section */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-brand-blue-navy uppercase tracking-wider">
                      🏡 Accommodation Information
                    </h4>
                    <Button
                      onClick={handleSaveAccommodation}
                      variant="ghost"
                      loading={isSavingAcc}
                      className="text-xs text-brand-teal-dark font-bold hover:bg-brand-teal-pale p-1.5 flex items-center gap-1 rounded-lg"
                    >
                      <Save className="w-3.5 h-3.5" /> Save details
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Hotel / Hostel Name"
                      value={accName}
                      onChange={(e) => setAccName(e.target.value)}
                      className="text-xs rounded-xl border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address / Location"
                      value={accAddress}
                      onChange={(e) => setAccAddress(e.target.value)}
                      className="text-xs rounded-xl border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-surface-400">₹</span>
                      <input
                        type="number"
                        placeholder="Cost"
                        value={accCost}
                        onChange={(e) => setAccCost(e.target.value)}
                        className="text-xs rounded-xl border border-surface-200 bg-white pl-6 pr-3 py-2 text-surface-900 focus:border-brand-teal-medium focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Stop activities list section with DnD */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-brand-blue-navy uppercase tracking-wider mb-3">
                    🧗 Activities Itinerary
                  </h4>
                  {selectedStopActivitiesSorted.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={handleActivitiesDragEnd}
                    >
                      <SortableContext
                        items={selectedStopActivitiesSorted.map(a => a._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {selectedStopActivitiesSorted.map(activity => (
                          <SortableActivityItem
                            key={activity._id}
                            activity={activity}
                            onEdit={handleEditActivityClick}
                            onDelete={handleDeleteActivity}
                            dragEnabled={selectedStopActivitiesSorted.length > 1}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-surface-200 rounded-2xl bg-surface-50/50">
                      <Compass className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                      <p className="text-xs text-surface-500 font-medium">No activities planned for this stop.</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">Click "Search Activity" or "Custom Activity" to add plans.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-surface-150 rounded-2xl p-16 text-center shadow-sm flex flex-col justify-center items-center h-full">
              <Compass className="w-16 h-16 text-surface-300 mb-4 animate-pulse-slow" />
              <h3 className="text-lg font-display font-bold text-brand-blue-navy mb-1">
                No Stop Selected
              </h3>
              <p className="text-sm text-surface-500 max-w-sm mb-6">
                Please add a city destination stop on the left sidebar, or select an existing stop to plan activities.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* City search overlay modal */}
      <Modal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        title="Add City Stop to Route"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative flex items-center bg-surface-50 border border-surface-200 rounded-xl p-1.5 focus-within:border-brand-teal-medium transition-all">
            <Search className="w-4 h-4 text-surface-400 ml-2" />
            <input
              type="text"
              placeholder="Search cities by name..."
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-surface-900 placeholder-surface-400 text-xs px-2.5 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-brand-teal-pale/30 border border-brand-teal-light/20 p-4 rounded-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-brand-blue-navy block mb-1">Arrival Date</label>
              <input
                type="date"
                value={newStopArrival}
                onChange={(e) => setNewStopArrival(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs text-surface-900 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-brand-blue-navy block mb-1">Departure Date</label>
              <input
                type="date"
                value={newStopDeparture}
                onChange={(e) => setNewStopDeparture(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs text-surface-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-brand-blue-navy uppercase tracking-wider mb-2">
              Select City Destination
            </h4>
            {filteredCities.map(city => (
              <div 
                key={city._id} 
                className="flex items-center justify-between p-3.5 border border-surface-150 rounded-2xl hover:border-brand-teal-light transition-all bg-white"
              >
                <div className="flex items-center gap-3">
                  <img src={city.image} alt={city.name} className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h5 className="font-display font-bold text-sm text-brand-blue-navy">{city.name}</h5>
                    <p className="text-[10px] text-surface-450">{city.country}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleAddStop(city)}
                  variant="outline" 
                  size="xs"
                  className="border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                >
                  Select Stop
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Activity search modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Add Activity to Itinerary"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative flex items-center bg-surface-50 border border-surface-200 rounded-xl p-1.5 focus-within:border-brand-teal-medium transition-all">
            <Search className="w-4 h-4 text-surface-400 ml-2" />
            <input
              type="text"
              placeholder="Search activities..."
              value={actQuery}
              onChange={(e) => setActQuery(e.target.value)}
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-surface-900 placeholder-surface-400 text-xs px-2.5 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredActs.map(act => (
              <div 
                key={act._id} 
                className="flex items-center justify-between p-3.5 border border-surface-150 rounded-2xl hover:border-brand-teal-light transition-all bg-white"
              >
                <div className="flex items-center gap-3">
                  <img src={act.image} alt={act.name} className="w-12 h-12 object-cover rounded-xl" />
                  <div className="max-w-[240px]">
                    <h5 className="font-display font-bold text-sm text-brand-blue-navy line-clamp-1">{act.name}</h5>
                    <p className="text-[10px] text-surface-450 line-clamp-1">{act.description}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleAddActivity(act)}
                  variant="outline" 
                  size="xs"
                  className="border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                >
                  Add Stop
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Custom/Edit activity modal */}
      <Modal
        isOpen={isCustomActModalOpen}
        onClose={() => {
          setIsCustomActModalOpen(false);
          setEditActivityObj(null);
        }}
        title={editActivityObj ? 'Edit Activity Details' : 'Add Custom Activity Stop'}
        size="md"
      >
        <form onSubmit={handleCustomActivitySubmit} className="space-y-4">
          <div>
            <label className="input-label">Activity Name</label>
            <input
              type="text"
              placeholder="e.g. Flight to Mumbai / Dinner at Taj Mahal Palace"
              value={customActName}
              onChange={(e) => setCustomActName(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3">
              <label className="input-label flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-teal-dark" /> Activity Date
              </label>
              <input
                type="date"
                value={customActDate}
                onChange={(e) => setCustomActDate(e.target.value)}
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
                value={customActStart}
                onChange={(e) => setCustomActStart(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="input-label flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-teal-dark" /> End Time
              </label>
              <input
                type="time"
                value={customActEnd}
                onChange={(e) => setCustomActEnd(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="input-label">Status</label>
              <select
                value={customActStatus}
                onChange={(e) => setCustomActStatus(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              >
                <option value="planned">Planned</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Cost (₹)</label>
              <input
                type="number"
                value={customActCost}
                onChange={(e) => setCustomActCost(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="input-label">Description</label>
              <input
                type="text"
                placeholder="Brief description"
                value={customActDesc}
                onChange={(e) => setCustomActDesc(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Notes</label>
            <textarea
              placeholder="Meeting spots, directions, tickets info..."
              value={customActNotes}
              onChange={(e) => setCustomActNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-teal-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setIsCustomActModalOpen(false);
                setEditActivityObj(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="bg-brand-teal-dark hover:bg-brand-teal-medium text-white px-6"
            >
              {editActivityObj ? 'Update details' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

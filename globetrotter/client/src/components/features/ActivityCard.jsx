import React from 'react';
import { Star, Clock, Tag, Banknote } from 'lucide-react';
import Button from '../ui/Button';

export default function ActivityCard({ activity, onAddToStop }) {
  const { name, category, estimatedCost, duration = { value: 1, unit: 'hours' }, description, rating = { average: 4.5, count: 50 }, image, tags = [] } = activity;

  // Format currency based on country
  const formatCost = (cost) => {
    if (cost === 0) return 'Free';
    const country = activity.city?.country;
    if (country === 'India') {
      return `₹${cost.toLocaleString('en-IN')}`;
    }
    if (country === 'France') {
      const converted = Math.round(cost * 0.011);
      return `€${converted.toLocaleString('fr-FR')}`;
    }
    if (country === 'Japan') {
      const converted = Math.round(cost * 1.8);
      return `¥${converted.toLocaleString('ja-JP')}`;
    }
    if (country === 'Indonesia') {
      const converted = Math.round(cost * 188);
      return `Rp ${converted.toLocaleString('id-ID')}`;
    }
    return `₹${cost.toLocaleString('en-IN')}`;
  };

  // Capitalize category
  const formatCategory = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Map category to color scheme
  const getCategoryColor = (cat) => {
    const map = {
      sightseeing: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      food: 'bg-amber-50 text-amber-700 border-amber-100',
      adventure: 'bg-rose-50 text-rose-700 border-rose-100',
      culture: 'bg-brand-teal-pale text-brand-teal-dark border-brand-teal-light/35',
      shopping: 'bg-purple-50 text-purple-700 border-purple-100',
      nature: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      entertainment: 'bg-brand-blue-pale text-brand-blue-navy border-brand-blue-light/35',
      nightlife: 'bg-violet-950 text-violet-200 border-violet-850',
    };
    return map[cat] || 'bg-surface-50 text-surface-700 border-surface-200';
  };

  return (
    <div className="card overflow-hidden group hover:shadow-card-lg border border-surface-100 hover:border-brand-teal-light transition-all duration-300 flex flex-col h-full bg-white rounded-2xl">
      {/* Activity Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 border text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${getCategoryColor(category)}`}>
          {formatCategory(category)}
        </span>
        {/* Rating stars */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-surface-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-surface-200">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>{rating.average.toFixed(1)}</span>
          <span className="text-surface-400 font-normal text-[10px]">({rating.count})</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name */}
        <div className="mb-2">
          <h3 className="text-base font-display font-bold text-brand-blue-navy group-hover:text-brand-blue-medium transition-colors line-clamp-1">
            {name}
          </h3>
          {activity.city && (
            <p className="text-[10px] text-surface-450 uppercase font-semibold tracking-wider">
              {activity.city.name}, {activity.city.country}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-surface-600 leading-relaxed mb-4 flex-grow line-clamp-2">
          {description}
        </p>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-surface-100 text-xs">
          <div className="flex items-center gap-1.5 text-surface-600">
            <Clock className="w-4 h-4 text-brand-teal-dark flex-shrink-0" />
            <div>
              <span className="text-[9px] text-surface-400 block uppercase font-medium">Duration</span>
              <span className="font-semibold text-brand-blue-navy text-xs">{duration.value} {duration.unit}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-surface-600">
            <Banknote className="w-4 h-4 text-brand-teal-dark flex-shrink-0" />
            <div>
              <span className="text-[9px] text-surface-400 block uppercase font-medium">Est. Cost</span>
              <span className="font-semibold text-brand-blue-navy text-xs">{formatCost(estimatedCost)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] bg-surface-50 text-surface-500 px-2 py-0.5 rounded-md border border-surface-100/50">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Stop Action */}
        <Button
          onClick={() => onAddToStop?.(activity)}
          variant="outline"
          size="sm"
          className="w-full border-brand-blue-light text-brand-blue-medium hover:bg-brand-blue-medium hover:text-white rounded-xl shadow-sm transition-all"
        >
          Add to Trip Stop
        </Button>
      </div>
    </div>
  );
}

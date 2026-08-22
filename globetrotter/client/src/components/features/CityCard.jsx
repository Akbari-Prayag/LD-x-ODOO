import React from 'react';
import { MapPin, DollarSign, Star, Calendar } from 'lucide-react';
import Button from '../ui/Button';

export default function CityCard({ city, onAddToTrip }) {
  const { name, country, region, description, image, costIndex, popularity, bestMonths = [] } = city;

  // Get dynamic local currency daily cost
  const getFormattedCost = () => {
    const avgDailyCost = city.avgDailyCost || (costIndex * 1500);
    if (country === 'India') {
      return `₹${avgDailyCost.toLocaleString('en-IN')}`;
    }
    if (country === 'France') {
      const converted = Math.round(avgDailyCost * 0.011);
      return `€${converted.toLocaleString('fr-FR')}`;
    }
    if (country === 'Japan') {
      const converted = Math.round(avgDailyCost * 1.8);
      return `¥${converted.toLocaleString('ja-JP')}`;
    }
    if (country === 'Indonesia') {
      const converted = Math.round(avgDailyCost * 188);
      return `Rp ${converted.toLocaleString('id-ID')}`;
    }
    return `₹${avgDailyCost.toLocaleString('en-IN')}`;
  };

  return (
    <div className="card overflow-hidden group hover:shadow-card-lg border border-surface-100 hover:border-brand-teal-light transition-all duration-300 flex flex-col h-full bg-white rounded-2xl">
      {/* City Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Region Badge */}
        {region && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-brand-blue-navy font-display font-medium text-xs px-2.5 py-1 rounded-full shadow-sm">
            {region}
          </span>
        )}
        {/* Popularity star */}
        <div className="absolute top-3 right-3 bg-brand-teal-pale/95 backdrop-blur-sm text-brand-teal-dark font-bold text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-brand-teal-light/20">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{popularity}% Popular</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name & Country */}
        <div className="mb-2">
          <h3 className="text-lg font-display font-bold text-brand-blue-navy group-hover:text-brand-blue-medium transition-colors">
            {name}
          </h3>
          <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-brand-teal-dark" />
            <span>{country}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-surface-600 leading-relaxed mb-4 flex-grow line-clamp-2">
          {description}
        </p>

        {/* Specs: Cost & Best months */}
        <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-surface-100 text-xs">
          <div>
            <span className="text-[10px] text-surface-400 block uppercase tracking-wider font-semibold">
              Est. Daily Cost
            </span>
            <p className="mt-0.5 font-bold text-brand-teal-dark text-sm">
              {getFormattedCost()}
            </p>
          </div>
          {bestMonths.length > 0 && (
            <div>
              <span className="text-[10px] text-surface-400 block uppercase tracking-wider font-semibold flex items-center gap-0.5">
                <Calendar className="w-3 h-3 text-surface-400" /> Best Visit
              </span>
              <p className="mt-0.5 font-medium text-brand-blue-navy line-clamp-1">
                {bestMonths.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Add to Trip Action */}
        <Button
          onClick={() => onAddToTrip?.(city)}
          variant="primary"
          size="sm"
          className="w-full bg-brand-blue-medium hover:bg-brand-blue-navy text-white rounded-xl shadow-sm hover:shadow-glow transition-all"
        >
          Add to Trip
        </Button>
      </div>
    </div>
  );
}

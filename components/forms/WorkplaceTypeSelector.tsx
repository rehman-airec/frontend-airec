'use client';

import React from 'react';
import { WORKPLACE_TYPES } from '@/lib/constants';

interface WorkplaceTypeSelectorProps {
  selectedTypes: ('Remote' | 'On-site' | 'Hybrid')[];
  onChange: (types: ('Remote' | 'On-site' | 'Hybrid')[]) => void;
  onLocationChange: (type: 'Remote' | 'On-site' | 'Hybrid', location: any) => void;
  locations: {
    onSite?: { city?: string; country?: string };
    hybrid?: { city?: string; country?: string };
    remote?: { cities?: Array<{ city: string; country?: string }>; country?: string };
  };
}

const WorkplaceTypeSelector: React.FC<WorkplaceTypeSelectorProps> = ({
  selectedTypes,
  onChange,
  onLocationChange,
  locations,
}) => {
  // Enforce single selection: only one workplace type can be selected at a time
  const handleTypeSelect = (type: 'Remote' | 'On-site' | 'Hybrid') => {
    onChange([type]);
  };

  const addRemoteCity = () => {
    const currentCities = locations.remote?.cities || [];
    onLocationChange('Remote', {
      cities: [...currentCities, { city: '', country: locations.remote?.country || '' }],
      country: locations.remote?.country || ''
    });
  };

  const removeRemoteCity = (index: number) => {
    const currentCities = locations.remote?.cities || [];
    onLocationChange('Remote', {
      cities: currentCities.filter((_, i) => i !== index),
      country: locations.remote?.country || ''
    });
  };

  const updateRemoteCity = (index: number, field: 'city', value: string) => {
    const currentCities = locations.remote?.cities || [];
    const updated = currentCities.map((city, i) =>
      i === index ? { ...city, [field]: value } : city
    );
    onLocationChange('Remote', {
      cities: updated,
      country: locations.remote?.country || ''
    });
  };

  const updateRemoteCountry = (value: string) => {
    const currentCities = locations.remote?.cities || [];
    onLocationChange('Remote', {
      cities: currentCities.map(c => ({ ...c, country: value })),
      country: value
    });
  };

  const updateLocation = (type: 'On-site' | 'Hybrid', field: 'city' | 'country', value: string) => {
    const currentLocation = locations[type.toLowerCase() as 'onSite' | 'hybrid'] || {};
    onLocationChange(type, { ...currentLocation, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workplace Types <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {WORKPLACE_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="radio"
                name="workplace-type"
                checked={selectedTypes.includes(type as any)}
                onChange={() => handleTypeSelect(type as any)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* On-site Location */}
      {selectedTypes.includes('On-site') && (
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">On-site Location</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locations.onSite?.city || ''}
                onChange={(e) => updateLocation('On-site', 'city', e.target.value)}
                placeholder="e.g. San Francisco"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locations.onSite?.country || ''}
                onChange={(e) => updateLocation('On-site', 'country', e.target.value)}
                placeholder="e.g. United States"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hybrid Location */}
      {selectedTypes.includes('Hybrid') && (
        <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Hybrid Location</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locations.hybrid?.city || ''}
                onChange={(e) => updateLocation('Hybrid', 'city', e.target.value)}
                placeholder="e.g. New York"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locations.hybrid?.country || ''}
                onChange={(e) => updateLocation('Hybrid', 'country', e.target.value)}
                placeholder="e.g. United States"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Remote Location */}
      {selectedTypes.includes('Remote') && (
        <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Remote Location</h4>
            <button
              type="button"
              onClick={addRemoteCity}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add City
            </button>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={locations.remote?.country || ''}
              onChange={(e) => updateRemoteCountry(e.target.value)}
              placeholder="e.g. United States"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {locations.remote?.cities && locations.remote.cities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Cities (Optional)</p>
              {locations.remote.cities.map((cityData, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cityData.city}
                    onChange={(e) => updateRemoteCity(index, 'city', e.target.value)}
                    placeholder="City name"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRemoteCity(index)}
                    className="text-red-600 hover:text-red-700 text-sm px-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkplaceTypeSelector;

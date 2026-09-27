import React, { useState } from 'react';
import { MapPin, Navigation, Check, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '../../utils/formatters';

// Common Jharkhand district headquarter coordinates for one-click reference
const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Dhanbad: { lat: 23.7957, lng: 86.4304 },
  'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
  'West Singhbhum': { lat: 22.5539, lng: 85.8078 },
  Bokaro: { lat: 23.6693, lng: 86.1511 },
  Deoghar: { lat: 24.4826, lng: 86.7003 },
  Hazaribagh: { lat: 23.9937, lng: 85.3622 },
  Giridih: { lat: 24.1843, lng: 86.3052 },
  Dumka: { lat: 24.2676, lng: 87.2486 },
  Palamu: { lat: 24.0416, lng: 84.0725 },
  Garhwa: { lat: 24.1611, lng: 83.8055 },
  Chatra: { lat: 24.2092, lng: 84.8711 },
  Gumla: { lat: 23.0445, lng: 84.5422 },
  Khunti: { lat: 23.0722, lng: 85.2794 },
  Simdega: { lat: 22.6174, lng: 84.5097 },
  Lohardaga: { lat: 23.4357, lng: 84.6811 },
  Latehar: { lat: 23.7439, lng: 84.5042 },
  Koderma: { lat: 24.4697, lng: 85.5944 },
  Godda: { lat: 24.8272, lng: 87.2142 },
  Sahibganj: { lat: 25.2425, lng: 87.6436 },
  Pakur: { lat: 24.6333, lng: 87.8488 },
  Jamtara: { lat: 23.9622, lng: 86.8044 },
  Ramgarh: { lat: 23.6334, lng: 85.5137 },
  Seraikela: { lat: 22.7001, lng: 85.9328 },
};

export interface LocationPickerProps {
  district: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  onChange: (data: {
    district: string;
    block?: string;
    village?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  errors?: Record<string, string>;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  district,
  block = '',
  village = '',
  address = '',
  latitude,
  longitude,
  onChange,
  errors = {},
}) => {
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  const handleDistrictChange = (newDistrict: string) => {
    const coords = DISTRICT_COORDINATES[newDistrict];
    onChange({
      district: newDistrict,
      block,
      village,
      address,
      latitude: coords ? coords.lat : latitude,
      longitude: coords ? coords.lng : longitude,
    });
  };

  const handleGetBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          district,
          block,
          village,
          address,
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
        });
        setGeoLocating(false);
        setGeoSuccess(true);
        setTimeout(() => setGeoSuccess(false), 3000);
      },
      () => {
        // Fallback to district coords if permission denied
        const coords = DISTRICT_COORDINATES[district] || { lat: 23.3441, lng: 85.3096 };
        onChange({
          district,
          block,
          village,
          address,
          latitude: coords.lat,
          longitude: coords.lng,
        });
        setGeoLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3.5 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Location Information</span>
        </div>
        <button
          type="button"
          onClick={handleGetBrowserLocation}
          disabled={geoLocating}
          className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-medium hover:underline disabled:opacity-50"
        >
          <Navigation className={`w-3 h-3 ${geoLocating ? 'animate-spin' : ''}`} />
          <span>{geoLocating ? 'Detecting GPS...' : 'Auto-detect GPS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* District */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            District <span className="text-rose-500">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none"
          >
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-[11px] text-rose-600 mt-0.5">{errors.district}</p>
          )}
        </div>

        {/* Block */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Block / Tehsil
          </label>
          <input
            type="text"
            placeholder="e.g. Ormanjhi, Murhu"
            value={block}
            onChange={(e) =>
              onChange({ district, block: e.target.value, village, address, latitude, longitude })
            }
            className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Village */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Village / Locality / Panchayat
          </label>
          <input
            type="text"
            placeholder="e.g. Baridih, Tola 4"
            value={village}
            onChange={(e) =>
              onChange({ district, block, village: e.target.value, address, latitude, longitude })
            }
            className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Street / Landmark Address */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Optional Landmark / Detailed Address
        </label>
        <input
          type="text"
          placeholder="e.g. Near Primary Health Center, Post Office Road"
          value={address}
          onChange={(e) =>
            onChange({ district, block, village, address: e.target.value, latitude, longitude })
          }
          className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {/* Lat/Long display & fine-tuning */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Latitude (°N)</label>
          <input
            type="number"
            step="0.0001"
            value={latitude !== undefined ? latitude : ''}
            onChange={(e) =>
              onChange({
                district,
                block,
                village,
                address,
                latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                longitude,
              })
            }
            className="w-full text-xs rounded border border-slate-300 bg-white px-2 py-1 focus:border-emerald-600 focus:outline-none font-mono"
            placeholder="e.g. 23.4821"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Longitude (°E)</label>
          <input
            type="number"
            step="0.0001"
            value={longitude !== undefined ? longitude : ''}
            onChange={(e) =>
              onChange({
                district,
                block,
                village,
                address,
                latitude,
                longitude: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-full text-xs rounded border border-slate-300 bg-white px-2 py-1 focus:border-emerald-600 focus:outline-none font-mono"
            placeholder="e.g. 85.4719"
          />
        </div>
      </div>

      {geoSuccess && (
        <div className="text-[11px] text-emerald-700 flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Coordinates captured from current GPS.</span>
        </div>
      )}
    </div>
  );
};

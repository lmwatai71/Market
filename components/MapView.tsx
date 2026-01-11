import React, { useState } from 'react';
import { Listing } from '../types';
import { MapPin, X, ArrowRight } from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
  onListingClick: (listing: Listing) => void;
}

const MapView: React.FC<MapViewProps> = ({ listings, onListingClick }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Simple mock map visualization
  // In a real app, this would use Google Maps or Mapbox
  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-blue-50 overflow-hidden">
      {/* Mock Map Background - Stylized representation of Oahu/Islands */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-green-700 fill-current">
          {/* Abstract Island Shapes */}
          <path d="M20,20 Q30,10 40,25 T60,50 T40,80 T15,60 T20,20" />
          <path d="M70,70 Q80,60 90,75 T95,90 T75,95 T65,85 T70,70" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      {/* Pins */}
      {listings.map((listing) => {
        // Use coordinates if available, otherwise random fallback for demo
        const left = listing.coordinates ? `${listing.coordinates.x}%` : `${Math.random() * 80 + 10}%`;
        const top = listing.coordinates ? `${listing.coordinates.y}%` : `${Math.random() * 80 + 10}%`;

        return (
          <div
            key={listing.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-300 hover:scale-110 z-10"
            style={{ left, top }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedListing(listing);
            }}
          >
            <div className={`p-2 rounded-full shadow-lg border-2 border-white transition-colors ${selectedListing?.id === listing.id ? 'bg-kai text-white scale-125' : 'bg-white text-kai hover:bg-kai hover:text-white'}`}>
              <MapPin size={24} fill="currentColor" />
            </div>
            {/* Price Tag Label */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-lava shadow-sm whitespace-nowrap hidden group-hover:block">
              ${listing.price}
            </div>
          </div>
        );
      })}

      {/* Selected Listing Card */}
      {selectedListing && (
        <div className="absolute bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-mist flex gap-4 relative">
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute -top-2 -right-2 bg-lava text-white rounded-full p-1 shadow-md hover:scale-110 transition"
            >
              <X size={16} />
            </button>
            
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-mist">
              <img 
                src={selectedListing.photos[0]} 
                alt={selectedListing.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-lava line-clamp-1">{selectedListing.title}</h3>
              <p className="text-kai font-bold text-lg">${selectedListing.price}</p>
              <div className="flex items-center text-lava/60 text-xs mt-1">
                <MapPin size={12} className="mr-1" />
                {selectedListing.location}
              </div>
              
              <button 
                onClick={() => onListingClick(selectedListing)}
                className="mt-2 self-start flex items-center text-sm font-medium text-white bg-kai px-3 py-1.5 rounded-lg hover:bg-kai/90 transition"
              >
                View Details <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls (Visual only) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
         <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md text-lava/70 hover:text-kai cursor-pointer">
           <MapPin size={20} />
         </div>
      </div>
    </div>
  );
};

export default MapView;
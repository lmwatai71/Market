import React, { useState, useEffect, useRef } from 'react';
import { Listing } from '../types';
import { LOCATION_COORDINATES } from '../constants';
import { MapPin, X, ArrowRight, Navigation, Loader2 } from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
  onListingClick: (listing: Listing) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const MapView: React.FC<MapViewProps> = ({ listings, onListingClick }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]); 
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Center of Big Island
  const DEFAULT_CENTER = { lat: 19.6500, lng: -155.5000 };
  const DEFAULT_ZOOM = 9;

  useEffect(() => {
    if (!window.L || !mapRef.current) {
      if (!window.L) {
        setError("Leaflet Map library is not loaded.");
      }
      return;
    }

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = window.L.map(mapRef.current, {
        center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false
      });

      // Add OpenStreetMap Tile Layer
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;

      // Close selection on map click
      map.on('click', () => {
        setSelectedListing(null);
      });
    }

    return () => {
      // Cleanup handled by refs
    };
  }, []);

  // Handle Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Define Custom Icon
    const customIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #2A6F97; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const activeIcon = window.L.divIcon({
      className: 'active-div-icon',
      html: `<div style="background-color: #C75B39; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    listings.forEach(listing => {
      const coords = LOCATION_COORDINATES[listing.location];
      
      if (coords) {
        // Jitter
        const jitterLat = (Math.random() - 0.5) * 0.005;
        const jitterLng = (Math.random() - 0.5) * 0.005;

        const marker = window.L.marker([coords.lat + jitterLat, coords.lng + jitterLng], {
          icon: customIcon
        }).addTo(mapInstanceRef.current);

        marker.on('click', () => {
           // Reset all icons
           markersRef.current.forEach(m => m.setIcon(customIcon));
           // Set active
           marker.setIcon(activeIcon);
           
           setSelectedListing(listing);
           mapInstanceRef.current.setView(marker.getLatLng(), 11, { animate: true });
        });

        markersRef.current.push(marker);
      }
    });
  }, [listings]);

  const handleLocateUser = () => {
    if (!mapInstanceRef.current || !navigator.geolocation) return;
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        mapInstanceRef.current.setView([lat, lng], 12);
        
        // Add User Marker
        window.L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: "#4285F4",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(mapInstanceRef.current);

        setIsLoadingLocation(false);
      },
      (err) => {
        console.error("Error getting location", err);
        alert("Could not access your location.");
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-mist/20">
      
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-mist/50 backdrop-blur-sm z-10 p-6 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm">
                <p className="text-alaea font-bold mb-2">Map Error</p>
                <p className="text-sm text-lava/70">{error}</p>
            </div>
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 z-[400]">
        <button 
          onClick={handleLocateUser}
          className="bg-white p-3 rounded-xl shadow-lg text-lava/80 hover:text-kai hover:bg-white active:scale-95 transition flex items-center justify-center"
          title="My Location"
        >
          {isLoadingLocation ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
        </button>
      </div>

      {/* Selected Listing Card */}
      {selectedListing && (
        <div className="absolute bottom-6 left-4 right-4 z-[500] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-2xl p-4 shadow-2xl border border-mist flex gap-4 relative max-w-lg mx-auto">
            <button 
              onClick={() => {
                setSelectedListing(null);
                // Reset icons
                if (window.L) {
                   const customIcon = window.L.divIcon({
                      className: 'custom-div-icon',
                      html: `<div style="background-color: #2A6F97; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6]
                   });
                   markersRef.current.forEach(m => m.setIcon(customIcon));
                }
              }}
              className="absolute -top-3 -right-3 bg-white text-lava border border-mist rounded-full p-1.5 shadow-md hover:scale-110 transition z-30"
            >
              <X size={16} />
            </button>
            
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-mist">
              {selectedListing.photos.length > 0 ? (
                <img 
                  src={selectedListing.photos[0]} 
                  alt={selectedListing.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-lava/40">No Image</div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h3 className="font-bold text-lava line-clamp-1">{selectedListing.title}</h3>
              <p className="text-kai font-bold text-lg">${selectedListing.price.toLocaleString()}</p>
              <div className="flex items-center text-lava/60 text-xs mt-1 mb-2">
                <MapPin size={12} className="mr-1" />
                {selectedListing.location}
              </div>
              
              <button 
                onClick={() => onListingClick(selectedListing)}
                className="self-start flex items-center text-sm font-medium text-white bg-kai px-4 py-2 rounded-lg hover:bg-kai/90 transition shadow-sm"
              >
                View Details <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
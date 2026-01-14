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
    google: any;
  }
}

const MapView: React.FC<MapViewProps> = ({ listings, onListingClick }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const markersRef = useRef<any[]>([]); // Use ref for markers to manage lifecycle without re-renders
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Center of Big Island
  const DEFAULT_CENTER = { lat: 19.6500, lng: -155.5000 };
  const DEFAULT_ZOOM = 9;

  useEffect(() => {
    if (!window.google || !mapRef.current) {
      // Check if the script is actually loaded or if we just missed the window
      if (!window.google) {
        setError("Google Maps API is not loaded. Please check your API Key in index.html");
      }
      return;
    }

    if (!mapInstance) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ],
        disableDefaultUI: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMapInstance(map);

      // Add click listener to close selection
      map.addListener('click', () => {
        setSelectedListing(null);
      });
    }
  }, [mapRef.current]);

  // Handle Markers
  useEffect(() => {
    if (!mapInstance || !window.google) return;

    // Clear existing markers using the ref
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    listings.forEach(listing => {
      // Find coordinates based on location string
      const coords = LOCATION_COORDINATES[listing.location];
      
      if (coords) {
        // Add some random jitter so markers in same town don't perfectly overlap
        const jitterLat = (Math.random() - 0.5) * 0.005;
        const jitterLng = (Math.random() - 0.5) * 0.005;

        const marker = new window.google.maps.Marker({
          position: { lat: coords.lat + jitterLat, lng: coords.lng + jitterLng },
          map: mapInstance,
          title: listing.title,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
          setSelectedListing(listing);
          mapInstance.panTo(marker.getPosition());
        });

        markersRef.current.push(marker);
      }
    });
  }, [mapInstance, listings]);

  const handleLocateUser = () => {
    if (!mapInstance || !navigator.geolocation) return;
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(pos);
        mapInstance.setCenter(pos);
        mapInstance.setZoom(12);
        
        // Add User Marker
        new window.google.maps.Marker({
            position: pos,
            map: mapInstance,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "white",
            },
            title: "You are here"
        });

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
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Error Message if API missing */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-mist/50 backdrop-blur-sm z-10 p-6 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm">
                <p className="text-alaea font-bold mb-2">Map Error</p>
                <p className="text-sm text-lava/70">{error}</p>
            </div>
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
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
        <div className="absolute bottom-6 left-4 right-4 z-20 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-2xl p-4 shadow-2xl border border-mist flex gap-4 relative max-w-lg mx-auto">
            <button 
              onClick={() => setSelectedListing(null)}
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
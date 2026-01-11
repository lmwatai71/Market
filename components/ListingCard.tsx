import React, { useState } from 'react';
import { MapPin, Star, Zap, Flag } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  isOwner?: boolean;
  onBoost?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isOwner, onBoost }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const isBoosted = listing.boostedUntil && new Date(listing.boostedUntil) > new Date();

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmBoost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBoost) onBoost(listing);
    setShowConfirm(false);
  };

  const cancelBoost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Thanks for reporting. Our team will review this listing shortly.");
  };

  return (
    <div 
      onClick={() => onClick(listing)}
      className="bg-white border border-mist rounded-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full relative group/card"
    >
      {/* Confirmation Overlay */}
      {showConfirm && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600">
                <Zap size={24} fill="currentColor" />
              </div>
              <h4 className="font-bold text-lava mb-1">Boost Listing?</h4>
              <p className="text-xs text-lava/70 mb-4">
                Promote "{listing.title}" to the top for 24 hours.
              </p>
              <div className="flex gap-2">
                 <button 
                   onClick={cancelBoost}
                   className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg hover:bg-mist/50 transition"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmBoost}
                   className="flex-1 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md hover:opacity-90 transition"
                 >
                   Confirm
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Owner Boost Button */}
      {isOwner && onBoost && !showConfirm && (
         <button
           onClick={handleBoostClick}
           className="absolute top-3 right-3 bg-white/90 backdrop-blur text-lava p-2 rounded-full shadow-md hover:text-orange-500 transition z-10 active:scale-95 border border-mist/50"
           title="Boost Listing"
         >
           <Zap size={18} className={isBoosted ? "fill-orange-500 text-orange-500" : "fill-none"} />
         </button>
      )}

      {/* Report Button (Visible on Hover for non-owners) */}
      {!isOwner && !showConfirm && (
         <button
           onClick={handleReport}
           className="absolute top-3 right-3 bg-white/80 backdrop-blur text-lava/40 hover:text-alaea p-2 rounded-full shadow-sm z-10 opacity-0 group-hover/card:opacity-100 transition-opacity"
           title="Report Listing"
         >
           <Flag size={14} />
         </button>
      )}

      <div className="relative w-full h-48 bg-mist">
        {listing.photos.length > 0 ? (
          <img 
            src={listing.photos[0]} 
            alt={listing.title}
            className="w-full h-full object-cover" 
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-lava/50 bg-gray-100">
             No Image
           </div>
        )}
        
        {isBoosted && (
          <div className="absolute top-3 left-3 bg-alaea text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm z-10">
            BOOSTED
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lava text-lg leading-tight line-clamp-2 pr-6">
            {listing.title}
          </h3>
        </div>
        
        <div className="text-kai font-semibold text-lg mb-2">
          ${listing.price.toLocaleString()}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-koa text-sm">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-lava/70 border-t border-mist pt-2">
             <span>{listing.condition}</span>
             <div className="flex items-center">
               <Star size={12} className="text-sunrise fill-sunrise mr-1" />
               <span>{listing.sellerRating}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
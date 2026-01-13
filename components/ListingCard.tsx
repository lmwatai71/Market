import React, { useState } from 'react';
import { MapPin, Star, Zap, Flag, Handshake } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  isOwner?: boolean;
  onBoost?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isOwner, onBoost }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  
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

  const handleMakeOfferClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOffer(true);
  };

  const submitOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (offerAmount) {
      alert(`Offer of $${offerAmount} sent to seller!`);
      setShowOffer(false);
      setOfferAmount('');
    }
  };

  const cancelOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOffer(false);
  };

  return (
    <div 
      onClick={() => onClick(listing)}
      className="bg-white border border-mist rounded-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full relative group/card"
    >
      {/* Boost Confirmation Overlay */}
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

      {/* Make Offer Overlay */}
      {showOffer && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-kai/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-kai">
                <Handshake size={24} />
              </div>
              <h4 className="font-bold text-lava mb-1">Make an Offer</h4>
              <p className="text-xs text-lava/70 mb-4">
                The seller is accepting offers. Enter your price below.
              </p>
              
              <div className="relative mb-4">
                <span className="absolute left-3 top-2.5 text-lava/60 font-bold">$</span>
                <input 
                  type="number" 
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-mist rounded-lg focus:border-kai outline-none font-bold text-lg text-lava"
                  placeholder={listing.price.toString()}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex gap-2">
                 <button 
                   onClick={cancelOffer}
                   className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg hover:bg-mist/50 transition"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={submitOffer}
                   disabled={!offerAmount}
                   className="flex-1 py-2 text-xs font-bold text-white bg-kai rounded-lg shadow-md hover:bg-kai/90 transition disabled:opacity-50"
                 >
                   Send Offer
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Owner Boost Button */}
      {isOwner && onBoost && !showConfirm && !showOffer && (
         <button
           onClick={handleBoostClick}
           className="absolute top-3 right-3 bg-white/90 backdrop-blur text-lava p-2 rounded-full shadow-md hover:text-orange-500 transition z-10 active:scale-95 border border-mist/50"
           title="Boost Listing"
         >
           <Zap size={18} className={isBoosted ? "fill-orange-500 text-orange-500" : "fill-none"} />
         </button>
      )}

      {/* Report Button (Visible on Hover for non-owners) */}
      {!isOwner && !showConfirm && !showOffer && (
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
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-kai font-semibold text-lg">
            ${listing.price.toLocaleString()}
          </div>
          {listing.negotiable && !isOwner && (
            <button 
              onClick={handleMakeOfferClick}
              className="text-xs font-bold text-kai bg-kai/10 px-2 py-1 rounded-md flex items-center hover:bg-kai/20 transition"
              title="Seller accepts offers"
            >
              <Handshake size={14} className="mr-1" />
              Make Offer
            </button>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-koa text-sm">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-lava/70 border-t border-mist pt-2">
             <span>{listing.condition}</span>
             <div className="flex items-center gap-2">
               <span className="text-[10px] text-lava/40 font-mono" title={`Seller ID: ${listing.sellerId}`}>
                 #{listing.sellerId.length > 6 ? listing.sellerId.substring(0, 6) : listing.sellerId}
               </span>
               <div className="flex items-center">
                 <Star size={12} className="text-sunrise fill-sunrise mr-1" />
                 <span>{listing.sellerRating}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
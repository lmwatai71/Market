import React, { useState } from 'react';
import { MapPin, Star, Zap, Flag, Handshake, AlertTriangle, CheckCircle, MessageCircle, Smartphone, Send, ArrowRight } from 'lucide-react';
import { Listing } from '../types';
import { submitReport } from '../services/reportService';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  isOwner?: boolean;
  onBoost?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isOwner, onBoost }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showContact, setShowContact] = useState(false); // New Contact Modal
  const [showInAppMessage, setShowInAppMessage] = useState(false); // Sub-modal for in-app
  
  const [offerAmount, setOfferAmount] = useState('');
  const [messageText, setMessageText] = useState(''); // For In-App
  
  // Report State
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  const isBoosted = listing.boostedUntil && new Date(listing.boostedUntil) > new Date();

  // --- Handlers ---

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

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReport(true);
    setReportReason('');
    setReportSuccess(false);
  };

  const submitListingReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reportReason.trim()) return;

    setIsReporting(true);
    try {
      await submitReport(listing.id, listing.title, reportReason);
      setReportSuccess(true);
      setTimeout(() => {
        setShowReport(false);
        setIsReporting(false);
        setReportSuccess(false);
      }, 1500);
    } catch (error) {
      alert("Failed to send report. Please try again.");
      setIsReporting(false);
    }
  };

  const cancelReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReport(false);
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

  // --- Contact Handlers ---

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContact(true);
  };

  const handleSmsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use sms: protocol
    const phone = listing.sellerPhone || '808-555-0100'; // Fallback
    const body = `Aloha! I'm interested in your listing "${listing.title}" on PIKO. Is it still available?`;
    window.location.href = `sms:${phone}?body=${encodeURIComponent(body)}`;
    setShowContact(false);
  };

  const handleInAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContact(false);
    setShowInAppMessage(true);
    setMessageText(`Aloha! I'm interested in your "${listing.title}".`);
  };

  const sendInAppMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Message sent to ${listing.sellerName}!`);
    setShowInAppMessage(false);
  };

  return (
    <div 
      onClick={() => onClick(listing)}
      className="bg-white border border-mist rounded-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full relative group/card"
    >
      {/* --- MODALS --- */}

      {/* Boost Confirmation */}
      {showConfirm && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
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
                 <button onClick={cancelBoost} className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg hover:bg-mist/50 transition">Cancel</button>
                 <button onClick={confirmBoost} className="flex-1 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md hover:opacity-90 transition">Confirm</button>
              </div>
           </div>
        </div>
      )}

      {/* Contact Method Selection Modal */}
      {showContact && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <h4 className="font-serif font-bold text-lg text-koa mb-4">Contact {listing.sellerName}</h4>
              
              <div className="space-y-3">
                 <button 
                   onClick={handleInAppClick}
                   className="w-full flex items-center gap-3 p-3 rounded-xl border border-kai/20 bg-kai/5 hover:bg-kai/10 transition text-left"
                 >
                    <div className="bg-kai text-white p-2.5 rounded-full shrink-0"><MessageCircle size={20} /></div>
                    <div>
                      <p className="font-bold text-kai text-sm">Chat in App</p>
                      <p className="text-[10px] text-lava/60">Secure messaging via PIKO</p>
                    </div>
                 </button>

                 <div className="flex items-center gap-4 px-2">
                    <div className="h-px bg-mist flex-1"></div>
                    <span className="text-[10px] font-bold text-lava/30 uppercase">Or</span>
                    <div className="h-px bg-mist flex-1"></div>
                 </div>

                 <button 
                   onClick={handleSmsClick}
                   className="w-full flex items-center gap-3 p-3 rounded-xl border border-mist hover:bg-mist/10 transition text-left"
                 >
                    <div className="bg-green-600 text-white p-2.5 rounded-full shrink-0"><Smartphone size={20} /></div>
                    <div>
                      <p className="font-bold text-lava text-sm">Text Message (SMS)</p>
                      <p className="text-[10px] text-lava/60">Uses your phone carrier</p>
                    </div>
                 </button>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setShowContact(false); }}
                className="mt-4 text-xs font-bold text-lava/50 hover:text-lava py-2"
              >
                Cancel
              </button>
           </div>
        </div>
      )}

      {/* In-App Message Modal */}
      {showInAppMessage && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <h4 className="font-bold text-lava mb-2 text-left text-sm">To: {listing.sellerName}</h4>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-3 border border-mist rounded-lg focus:border-kai outline-none text-sm text-lava mb-4 resize-none h-24"
                placeholder="Write your message..."
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <div className="flex gap-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setShowInAppMessage(false); }}
                   className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg hover:bg-mist/50 transition"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={sendInAppMessage}
                   className="flex-1 py-2 text-xs font-bold text-white bg-kai rounded-lg shadow-md hover:bg-kai/90 transition flex items-center justify-center gap-1"
                 >
                   Send <Send size={12} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOffer && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-kai/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-kai">
                <Handshake size={24} />
              </div>
              <h4 className="font-bold text-lava mb-1">Make an Offer</h4>
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
                 <button onClick={cancelOffer} className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg hover:bg-mist/50 transition">Cancel</button>
                 <button onClick={submitOffer} disabled={!offerAmount} className="flex-1 py-2 text-xs font-bold text-white bg-kai rounded-lg shadow-md hover:bg-kai/90 transition disabled:opacity-50">Send Offer</button>
              </div>
           </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 text-center cursor-default animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="bg-white rounded-xl p-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
              {reportSuccess ? (
                <div className="py-8 flex flex-col items-center">
                  <CheckCircle size={48} className="text-green-500 mb-2" />
                  <p className="font-bold text-lava">Report Submitted</p>
                </div>
              ) : (
                <>
                  <h4 className="font-bold text-lava mb-1">Report Listing</h4>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-3 border border-mist rounded-lg focus:border-alaea outline-none text-sm text-lava mb-4 resize-none h-24"
                    placeholder="Reason for reporting..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2">
                    <button onClick={cancelReport} className="flex-1 py-2 text-xs font-bold text-lava/60 bg-mist/30 rounded-lg transition">Cancel</button>
                    <button onClick={submitListingReport} className="flex-1 py-2 text-xs font-bold text-white bg-alaea rounded-lg transition">Submit</button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* --- CARD CONTENT --- */}

      {/* Owner Boost Button */}
      {isOwner && onBoost && !showConfirm && !showOffer && !showReport && !showContact && (
         <button
           onClick={handleBoostClick}
           className="absolute top-3 right-3 bg-white/90 backdrop-blur text-lava p-2 rounded-full shadow-md hover:text-orange-500 transition z-10 active:scale-95 border border-mist/50"
         >
           <Zap size={18} className={isBoosted ? "fill-orange-500 text-orange-500" : "fill-none"} />
         </button>
      )}

      {/* Report Button */}
      {!isOwner && !showConfirm && !showOffer && !showReport && !showContact && (
         <button
           onClick={handleReportClick}
           className="absolute top-3 right-3 bg-white/80 backdrop-blur text-lava/40 hover:text-alaea p-2 rounded-full shadow-sm z-10 opacity-0 group-hover/card:opacity-100 transition-opacity"
         >
           <Flag size={14} />
         </button>
      )}

      <div className="relative w-full h-48 bg-mist">
        {listing.photos.length > 0 ? (
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-lava/50 bg-gray-100">No Image</div>
        )}
        {isBoosted && <div className="absolute top-3 left-3 bg-alaea text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm z-10">BOOSTED</div>}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-lava text-lg leading-tight line-clamp-2 pr-6 mb-1">{listing.title}</h3>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-kai font-semibold text-lg">${listing.price.toLocaleString()}</div>
          
          <div className="flex gap-1">
            {/* Make Offer Button */}
            {listing.negotiable && !isOwner && (
              <button 
                onClick={handleMakeOfferClick}
                className="text-xs font-bold text-kai bg-kai/10 px-2 py-1.5 rounded-md flex items-center hover:bg-kai/20 transition"
              >
                <Handshake size={14} />
              </button>
            )}
            
            {/* Contact Button */}
            {!isOwner && (
              <button 
                onClick={handleContactClick}
                className="text-xs font-bold text-white bg-kai px-3 py-1.5 rounded-md flex items-center hover:bg-kai/90 transition shadow-sm"
              >
                Message
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-koa text-sm">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-lava/70 border-t border-mist pt-2">
             <span>{listing.condition}</span>
             <div className="flex items-center gap-2">
               <div className="flex items-center">
                 <Star size={12} className="text-sunrise fill-sunrise mr-1" />
                 <span className="font-semibold">{listing.sellerRating}</span>
                 {listing.sellerReviewCount > 0 && (
                   <span className="text-lava/50 ml-1">({listing.sellerReviewCount})</span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
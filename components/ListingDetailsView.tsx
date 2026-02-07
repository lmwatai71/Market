import React, { useState } from 'react';
import { ChevronLeft, Share, Flag, MapPin, Calendar, ShieldCheck, MessageCircle, Smartphone, User, Star, ChevronRight, CheckCircle, Send, AlertTriangle, CreditCard, Banknote, X, Copy, ExternalLink, Lock } from 'lucide-react';
import { Listing, User as UserType } from '../types';
import { submitReport } from '../services/reportService';
import { getReviewsForSeller } from '../constants';

interface ListingDetailsViewProps {
  listing: Listing;
  currentUser: UserType | null;
  onBack: () => void;
  onContact: (type: 'sms' | 'chat') => void;
}

const ListingDetailsView: React.FC<ListingDetailsViewProps> = ({ listing, currentUser, onBack, onContact }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // UI States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'VENMO' | 'CASHAPP' | 'ZELLE'>('CARD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock Card Form Data
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', zip: '' });

  // Get reviews
  const reviews = getReviewsForSeller(listing.sellerId);

  // --- Image Gallery Logic ---
  const nextPhoto = () => {
    if (currentPhotoIndex < listing.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else {
      setCurrentPhotoIndex(0); // Loop
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    } else {
      setCurrentPhotoIndex(listing.photos.length - 1); // Loop
    }
  };

  // --- Actions ---
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this ${listing.title} on PIKO Marketplace!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      try {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setShowShareTooltip(true);
          setTimeout(() => setShowShareTooltip(false), 2000);
        });
      } catch (e) {
        console.warn("Clipboard access denied");
      }
    }
  };

  const handleReportSubmit = async () => {
    await submitReport(listing.id, listing.title, reportReason);
    setReportSuccess(true);
    setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
    }, 2000);
  };

  const handlePaymentProcess = () => {
    setIsProcessingPayment(true);
    // Simulate API call
    setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
    }, 2000);
  };

  const isOwner = currentUser?.id === listing.sellerId;
  
  // Mock Seller Payment Handles if not present in data
  const sellerHandles = listing.sellerPaymentHandles || {
      venmo: listing.sellerName.replace(/\s+/g, '').toLowerCase() + "_piko",
      cashapp: "$" + listing.sellerName.replace(/\s+/g, '').toLowerCase(),
      zelle: listing.sellerPhone || "808-555-0199"
  };

  const copyToClipboard = (text: string, label: string) => {
      try {
          navigator.clipboard.writeText(text).then(() => {
              alert(`${label} copied to clipboard!`);
          });
      } catch (e) {
          alert(`Could not copy ${label}. Please copy manually: ${text}`);
      }
  };

  return (
    <div className="bg-white min-h-screen pb-28 animate-in slide-in-from-right-10 duration-300 relative z-20">
      
      {/* --- Header --- */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-mist px-4 py-3 flex items-center justify-between">
         <button onClick={onBack} className="p-2 -ml-2 text-lava hover:bg-mist/20 rounded-full transition">
           <ChevronLeft size={24} />
         </button>
         <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 text-lava hover:bg-mist/20 rounded-full transition relative">
               <Share size={20} />
               {showShareTooltip && (
                   <span className="absolute top-10 right-0 bg-lava text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">Copied!</span>
               )}
            </button>
            {!isOwner && (
                <button onClick={() => setShowReportModal(true)} className="p-2 text-lava/40 hover:text-alaea hover:bg-mist/20 rounded-full transition">
                <Flag size={20} />
                </button>
            )}
         </div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* --- Image Gallery --- */}
        <div className="relative aspect-square sm:aspect-video bg-black overflow-hidden group">
            <img 
              src={listing.photos[currentPhotoIndex]} 
              alt={listing.title} 
              className="w-full h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {listing.photos.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {listing.photos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {listing.photos.map((_, idx) => (
                        <div 
                           key={idx}
                           className={`w-2 h-2 rounded-full shadow-sm transition-all ${idx === currentPhotoIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- Main Content --- */}
        <div className="p-5 space-y-6">
            
            {/* Title & Price */}
            <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h1 className="text-2xl font-serif font-bold text-lava leading-tight">{listing.title}</h1>
                    <span className="text-2xl font-bold text-kai shrink-0">${listing.price.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-lava/60">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Tags / Attributes */}
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-mist/20 text-lava/70 text-sm rounded-lg border border-mist">
                    Condition: <span className="font-semibold text-lava">{listing.condition}</span>
                </span>
                <span className="px-3 py-1 bg-mist/20 text-lava/70 text-sm rounded-lg border border-mist">
                    Category: <span className="font-semibold text-lava">{listing.category}</span>
                </span>
                {listing.negotiable && (
                    <span className="px-3 py-1 bg-kai/10 text-kai text-sm rounded-lg border border-kai/20 font-semibold">
                        Negotiable
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="border-t border-mist pt-4">
                <h3 className="font-bold text-lava mb-2">Description</h3>
                <p className="text-lava/80 whitespace-pre-wrap leading-relaxed">
                    {listing.description}
                </p>
            </div>

            {/* Safety Warning */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                <ShieldCheck className="text-orange-500 shrink-0" />
                <div>
                    <h4 className="font-bold text-orange-800 text-sm">Safety First</h4>
                    <p className="text-xs text-orange-700 mt-1">
                        Meet in a public place. Do not transfer money before seeing the item.
                    </p>
                </div>
            </div>

            {/* Seller Profile Card */}
            <div className="border-t border-mist pt-6">
                <h3 className="font-bold text-lava mb-4">Seller Information</h3>
                <div className="bg-white border border-mist rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center overflow-hidden">
                             <User size={24} className="text-lava/40" />
                        </div>
                        <div>
                            <p className="font-bold text-lava">{listing.sellerName}</p>
                            <div className="flex items-center text-xs text-lava/60">
                                <Star size={12} className="text-sunrise fill-sunrise mr-1" />
                                <span className="font-semibold text-lava mr-1">{listing.sellerRating}</span>
                                <span>Rating • {reviews.length} reviews</span>
                            </div>
                        </div>
                    </div>
                    {/* Only show viewing profile button if logic exists, for now static */}
                    <button className="text-sm font-semibold text-kai hover:underline">View Profile</button>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-mist pt-6">
                <h3 className="font-bold text-lava mb-4">Reviews ({reviews.length})</h3>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-mist/10 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-lava">{review.reviewerName}</span>
                                    <span className="text-xs text-lava/50">{review.date}</span>
                                </div>
                                <div className="flex text-sunrise mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={12} 
                                            fill={i < review.rating ? "currentColor" : "none"} 
                                            className={i < review.rating ? "text-sunrise" : "text-mist"} 
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-lava/80 italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-lava/50 italic">No reviews yet.</p>
                )}
            </div>
        </div>
      </div>

      {/* --- Fixed Bottom Action Bar --- */}
      {!isOwner && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mist p-4 flex gap-3 items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
             <button 
               onClick={() => onContact('chat')}
               className="flex-1 bg-white text-lava border border-mist font-bold py-3 rounded-xl hover:bg-mist/20 transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
             >
                <MessageCircle size={20} /> Chat
             </button>
             <button 
               onClick={() => setShowPaymentModal(true)}
               className="flex-[1.5] bg-gradient-to-r from-kai to-lau text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
             >
                <CreditCard size={20} /> Pay Now
             </button>
          </div>
      )}

      {/* --- Report Modal --- */}
      {showReportModal && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
               {reportSuccess ? (
                   <div className="flex flex-col items-center py-6">
                       <CheckCircle size={48} className="text-green-500 mb-2" />
                       <p className="font-bold text-lava">Report Submitted</p>
                   </div>
               ) : (
                   <>
                       <div className="flex items-center gap-2 mb-4 text-alaea">
                           <AlertTriangle size={24} />
                           <h3 className="font-bold text-lg">Report Listing</h3>
                       </div>
                       <p className="text-sm text-lava/70 mb-4">Why are you reporting this listing?</p>
                       <textarea 
                          className="w-full border border-mist rounded-xl p-3 text-sm focus:border-alaea outline-none resize-none h-32"
                          placeholder="Describe the issue..."
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                       />
                       <div className="flex gap-2 mt-4">
                           <button onClick={() => setShowReportModal(false)} className="flex-1 py-3 text-sm font-bold text-lava/60 hover:bg-mist/30 rounded-xl">Cancel</button>
                           <button onClick={handleReportSubmit} className="flex-1 py-3 text-sm font-bold text-white bg-alaea hover:bg-alaea/90 rounded-xl">Submit Report</button>
                       </div>
                   </>
               )}
            </div>
         </div>
      )}

      {/* --- Payment Modal --- */}
      {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowPaymentModal(false)}>
            <div 
                className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-20 duration-300" 
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-4 border-b border-mist flex justify-between items-center bg-mist/10 rounded-t-3xl sm:rounded-t-2xl">
                    <h3 className="font-serif font-bold text-lg text-koa flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-600" /> Secure Payment
                    </h3>
                    <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-full hover:bg-mist/30">
                        <X size={20} className="text-lava/60" />
                    </button>
                </div>

                {paymentSuccess ? (
                    // --- SUCCESS STATE ---
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in spin-in-180 duration-500">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-lava mb-2">Payment Sent!</h2>
                        <p className="text-lava/60 mb-6">
                            You sent <span className="font-bold text-lava">${listing.price.toLocaleString()}</span> to {listing.sellerName}.
                        </p>
                        <div className="bg-mist/20 rounded-xl p-4 w-full mb-6 text-sm text-left">
                            <p className="flex justify-between mb-2"><span>Transaction ID:</span> <span className="font-mono text-lava/60">TXN-{Math.floor(Math.random()*100000)}</span></p>
                            <p className="flex justify-between"><span>Date:</span> <span className="text-lava/60">{new Date().toLocaleDateString()}</span></p>
                        </div>
                        <button 
                            onClick={() => { setShowPaymentModal(false); setPaymentSuccess(false); }}
                            className="w-full bg-kai text-white font-bold py-3 rounded-xl shadow-lg"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    // --- SELECTION & FORM ---
                    <>
                        <div className="p-4 bg-orange-50 border-b border-orange-100 text-xs text-orange-800 flex gap-2">
                            <AlertTriangle size={16} className="shrink-0" />
                            <p>Only pay when you have met the seller and inspected the item. Payments are irreversible.</p>
                        </div>

                        {/* Payment Tabs */}
                        <div className="flex border-b border-mist overflow-x-auto">
                            <button 
                                onClick={() => setPaymentMethod('CARD')}
                                className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition ${paymentMethod === 'CARD' ? 'border-kai text-kai bg-kai/5' : 'border-transparent text-lava/60'}`}
                            >
                                Card / Bank
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('VENMO')}
                                className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition ${paymentMethod === 'VENMO' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-lava/60'}`}
                            >
                                Venmo
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('CASHAPP')}
                                className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition ${paymentMethod === 'CASHAPP' ? 'border-green-500 text-green-500 bg-green-50' : 'border-transparent text-lava/60'}`}
                            >
                                CashApp
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('ZELLE')}
                                className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition ${paymentMethod === 'ZELLE' ? 'border-purple-500 text-purple-500 bg-purple-50' : 'border-transparent text-lava/60'}`}
                            >
                                Zelle
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 overflow-y-auto">
                            
                            {paymentMethod === 'CARD' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-mist/20 rounded-xl border border-mist flex justify-between items-center">
                                        <span className="text-sm font-medium text-lava/70">Total Amount</span>
                                        <span className="text-2xl font-bold text-kai">${listing.price.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-lava uppercase mb-1 block">Card Number</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-3 text-lava/40" size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist focus:border-kai outline-none font-mono text-lava"
                                                    value={cardData.number}
                                                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-lava uppercase mb-1 block">Expiry</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-3 rounded-xl border border-mist focus:border-kai outline-none font-mono text-lava text-center"
                                                    value={cardData.expiry}
                                                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-lava uppercase mb-1 block">CVC</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="123"
                                                    className="w-full px-4 py-3 rounded-xl border border-mist focus:border-kai outline-none font-mono text-lava text-center"
                                                    value={cardData.cvc}
                                                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-lava uppercase mb-1 block">Zip Code</label>
                                            <input 
                                                type="text" 
                                                placeholder="96813"
                                                className="w-full px-4 py-3 rounded-xl border border-mist focus:border-kai outline-none font-mono text-lava"
                                                value={cardData.zip}
                                                onChange={(e) => setCardData({...cardData, zip: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-lava/50 justify-center pt-2">
                                        <Lock size={12} /> Encrypted & Secure via Stripe
                                    </div>
                                    
                                    <button 
                                        onClick={handlePaymentProcess}
                                        disabled={isProcessingPayment}
                                        className="w-full bg-kai text-white font-bold py-4 rounded-xl shadow-lg hover:bg-kai/90 transition flex items-center justify-center gap-2 mt-2"
                                    >
                                        {isProcessingPayment ? (
                                            <>Processing...</>
                                        ) : (
                                            <>Pay ${listing.price.toLocaleString()}</>
                                        )}
                                    </button>
                                </div>
                            )}

                            {paymentMethod === 'VENMO' && (
                                <div className="text-center space-y-6 pt-4">
                                    <div className="bg-blue-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg text-white font-bold text-2xl">V</div>
                                    <div>
                                        <p className="text-lava/60 text-sm mb-1">Send payment to</p>
                                        <h3 className="text-2xl font-bold text-lava">@{sellerHandles.venmo}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <a 
                                            href={`https://venmo.com/${sellerHandles.venmo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-[#008CFF] text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90"
                                        >
                                            Open Venmo App <ExternalLink size={18} />
                                        </a>
                                        <button 
                                            className="w-full bg-mist/20 text-lava font-bold py-3 rounded-xl hover:bg-mist/30 flex items-center justify-center gap-2"
                                            onClick={() => copyToClipboard(sellerHandles.venmo!, "Venmo handle")}
                                        >
                                            <Copy size={18} /> Copy Handle
                                        </button>
                                    </div>
                                    <p className="text-xs text-lava/40">Use "Payment between friends" to avoid fees if you trust the seller.</p>
                                </div>
                            )}

                            {paymentMethod === 'CASHAPP' && (
                                <div className="text-center space-y-6 pt-4">
                                    <div className="bg-[#00D632] w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg text-white font-bold text-2xl">$</div>
                                    <div>
                                        <p className="text-lava/60 text-sm mb-1">Send payment to</p>
                                        <h3 className="text-2xl font-bold text-lava">{sellerHandles.cashapp}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <a 
                                            href={`https://cash.app/${sellerHandles.cashapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-[#00D632] text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90"
                                        >
                                            Open Cash App <ExternalLink size={18} />
                                        </a>
                                        <button 
                                            className="w-full bg-mist/20 text-lava font-bold py-3 rounded-xl hover:bg-mist/30 flex items-center justify-center gap-2"
                                            onClick={() => copyToClipboard(sellerHandles.cashapp!, "CashTag")}
                                        >
                                            <Copy size={18} /> Copy CashTag
                                        </button>
                                    </div>
                                </div>
                            )}

                             {paymentMethod === 'ZELLE' && (
                                <div className="text-center space-y-6 pt-4">
                                    <div className="bg-[#6D1ED4] w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg text-white font-bold text-xl">Z</div>
                                    <div>
                                        <p className="text-lava/60 text-sm mb-1">Send Zelle payment to</p>
                                        <h3 className="text-2xl font-bold text-lava">{sellerHandles.zelle}</h3>
                                        <p className="text-xs text-lava/50 mt-1">({listing.sellerName})</p>
                                    </div>
                                    <div className="space-y-3">
                                        <button 
                                            className="w-full bg-[#6D1ED4] text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90"
                                            onClick={() => copyToClipboard(sellerHandles.zelle!, "Zelle info")}
                                        >
                                            <Copy size={18} /> Copy Info
                                        </button>
                                        <p className="text-xs text-lava/60 px-4">
                                            Open your banking app (First Hawaiian, Bank of Hawaii, CPB, etc.) and paste this number/email to send money.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
          </div>
      )}

    </div>
  );
};

export default ListingDetailsView;
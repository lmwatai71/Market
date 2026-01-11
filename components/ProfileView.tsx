import React from 'react';
import { User, Listing } from '../types';
import { LogOut, MapPin, Star, ShieldCheck, Clock } from 'lucide-react';
import ListingCard from './ListingCard';

interface ProfileViewProps {
  user: User;
  userListings: Listing[];
  onLogout: () => void;
  onListingClick: (listing: Listing) => void;
  onBoost?: (listing: Listing) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, userListings, onLogout, onListingClick, onBoost }) => {
  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="bg-white rounded-[24px] shadow-sm border border-mist overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-kai to-lau opacity-90"></div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 left-6 border-4 border-white rounded-full overflow-hidden w-24 h-24 shadow-md bg-white">
            <img 
              src={user.profilePhoto} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pt-14 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-lava flex items-center gap-2">
                {user.name}
                {user.verified && <ShieldCheck size={20} className="text-lau" fill="currentColor" />}
              </h2>
              <div className="flex items-center text-lava/60 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                {user.location}
              </div>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex items-center bg-mist/20 px-2 py-1 rounded-lg">
                 <Star size={16} className="text-sunrise fill-sunrise mr-1" />
                 <span className="font-bold text-lava">{user.rating.toFixed(1)}</span>
               </div>
               <span className="text-xs text-lava/40 mt-1">
                 Member since {new Date(user.createdAt).getFullYear()}
               </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-mist/50 flex flex-col gap-3">
            <button 
              onClick={onLogout}
              className="w-full py-2 px-4 rounded-xl border border-alaea/30 text-alaea font-medium hover:bg-alaea/5 flex items-center justify-center gap-2 transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <h3 className="font-serif font-bold text-lg text-koa mb-4 px-2">My Listings ({userListings.length})</h3>
      
      {userListings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-mist border-dashed">
          <p className="text-lava/50 mb-2">You haven't listed anything yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onClick={onListingClick}
              isOwner={true}
              onBoost={onBoost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
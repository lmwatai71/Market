import React, { useMemo } from 'react';
import { Listing, User } from '../types';
import ListingCard from './ListingCard';
import { FilterX } from 'lucide-react';

interface BrowseViewProps {
  listings: Listing[];
  activeFilters: {
    searchQuery: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    location: string;
  };
  onListingClick: (listing: Listing) => void;
  onClearFilters: () => void;
  currentUser?: User;
  onBoost?: (listing: Listing) => void;
}

const BrowseView: React.FC<BrowseViewProps> = ({ 
  listings, 
  activeFilters, 
  onListingClick,
  onClearFilters,
  currentUser,
  onBoost
}) => {
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // 1. Search Query
      if (activeFilters.searchQuery) {
        const q = activeFilters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category
      if (activeFilters.category && item.category !== activeFilters.category) {
        return false;
      }

      // 3. Price
      if (activeFilters.minPrice) {
        const min = parseFloat(activeFilters.minPrice);
        if (!isNaN(min) && item.price < min) return false;
      }
      if (activeFilters.maxPrice) {
        const max = parseFloat(activeFilters.maxPrice);
        if (!isNaN(max) && item.price > max) return false;
      }

      // 4. Location (Simple includes check)
      if (activeFilters.location) {
        if (!item.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [listings, activeFilters]);

  const hasFilters = activeFilters.searchQuery || activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.location;

  return (
    <div className="p-4 pb-24 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-koa">
          {activeFilters.category || "All Listings"}
        </h2>
        {hasFilters && (
          <button 
            onClick={onClearFilters}
            className="text-sm text-kai hover:underline flex items-center"
          >
            <FilterX size={14} className="mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="mb-6 flex flex-wrap gap-2">
           {activeFilters.searchQuery && <span className="bg-mist/30 px-3 py-1 rounded-full text-sm text-lava">"{activeFilters.searchQuery}"</span>}
           {activeFilters.location && <span className="bg-mist/30 px-3 py-1 rounded-full text-sm text-lava">📍 {activeFilters.location}</span>}
           {(activeFilters.minPrice || activeFilters.maxPrice) && <span className="bg-mist/30 px-3 py-1 rounded-full text-sm text-lava">Price Filter Active</span>}
        </div>
      )}

      {filteredListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-mist border-dashed">
          <p className="text-lava/60 text-lg mb-2">No items found matching your search.</p>
          <button onClick={onClearFilters} className="text-kai font-medium hover:underline">
            View all items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onClick={onListingClick}
              isOwner={currentUser && currentUser.id === listing.sellerId}
              onBoost={onBoost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseView;
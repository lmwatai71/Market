import React, { useState, useEffect } from 'react';
import { Home, Search, MessageCircle, User as UserIcon, Map, Briefcase } from 'lucide-react';
import Header from './components/Header';
import SafetyBanner from './components/SafetyBanner';
import BrowseView from './components/BrowseView';
import ChatInterface from './components/ChatInterface';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import MapView from './components/MapView';
import ToolsView from './components/ToolsView';
import CreateListingForm from './components/CreateListingForm';
import { MOCK_LISTINGS } from './constants';
import { Listing, ViewState, SearchFilters, User, ChatMessage } from './types';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [activeFilters, setActiveFilters] = useState({
    searchQuery: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  
  // Chat State (Lifted to persist across navigation)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Aloha! 🌺 Welcome to PIKO MARKETPLACE, Hawaiʻi Island's local marketplace. I can help you find items, create a listing in your district, or draft a message. Note: We are currently exclusive to the Big Island.",
      timestamp: new Date()
    }
  ]);
  
  // Launch System Check
  useEffect(() => {
    console.log("SYSTEM CHECK: Hawaiʻi Island Configuration Loaded.");
    console.log("SYSTEM CHECK: Security Protocols Active.");
  }, []);

  // Handle Login / Signup
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Handle Action from Chat to Browse
  const handleSearchAction = (filters: SearchFilters['data']) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters.filters,
      searchQuery: filters.searchQuery || ''
    }));
    setCurrentView('browse');
  };

  // Handle Action from Chat to Create Listing
  const handleCreateAction = (newListing: Listing) => {
    if (currentUser) {
      newListing.sellerId = currentUser.id;
      newListing.sellerName = currentUser.name;
    }
    setListings(prev => [newListing, ...prev]);
    // Reset filters to show everything including new item or specific category
    setActiveFilters({
      searchQuery: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    });
    setCurrentView('browse');
    alert(`Success! "${newListing.title}" has been posted.`);
  };

  // Handle Boosting a Listing
  const handleBoostListing = (listing: Listing) => {
    const updatedListings = listings.map(l => {
      if (l.id === listing.id) {
        const nextDay = new Date();
        nextDay.setHours(nextDay.getHours() + 24);
        return { ...l, boostedUntil: nextDay.toISOString() };
      }
      return l;
    });
    setListings(updatedListings);
    // In a real app, this would trigger payment processing first
    alert(`Success! "${listing.title}" is now boosted for 24 hours.`);
  };

  const clearFilters = () => {
    setActiveFilters({
      searchQuery: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    });
  };

  // If not logged in, show AuthView
  if (!currentUser) {
    return <AuthView onLogin={handleLogin} />;
  }

  // Mobile Bottom Navigation Component
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mist h-20 px-4 pb-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      <button 
        onClick={() => setCurrentView('home')} 
        className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'home' ? 'text-kai' : 'text-lava/60'}`}
      >
        <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('map')} 
        className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'map' ? 'text-kai' : 'text-lava/60'}`}
      >
        <Map size={24} strokeWidth={currentView === 'map' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Map</span>
      </button>

      {/* Floating Center Action Button - AI Chat */}
      <div className="relative -top-5">
        <button 
          onClick={() => setCurrentView('chat')}
          className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 ${
            currentView === 'chat' 
              ? 'bg-gradient-to-tr from-kai to-lau text-white ring-4 ring-white' 
              : 'bg-gradient-to-tr from-kai to-lau text-white ring-4 ring-white'
          }`}
        >
          <MessageCircle size={26} fill="white" className="opacity-90" />
        </button>
      </div>

      <button 
        onClick={() => setCurrentView('tools')}
        className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'tools' || currentView === 'create' ? 'text-kai' : 'text-lava/60'}`}
      >
        <Briefcase size={24} strokeWidth={currentView === 'tools' || currentView === 'create' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Tools</span>
      </button>

      <button 
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'profile' ? 'text-kai' : 'text-lava/60'}`}
      >
        <UserIcon size={24} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud text-lava font-sans selection:bg-kai/20">
      <Header 
        activeView={currentView} 
        onMenuClick={() => {}} 
        onProfileClick={() => setCurrentView('profile')}
      />
      <SafetyBanner />

      <main className="pb-24"> {/* Padding bottom for Nav */}
        
        {currentView === 'home' && (
          <div className="p-4 space-y-8 max-w-2xl mx-auto">
            <div className="text-center py-8">
              <h2 className="text-3xl font-serif font-bold text-koa mb-2">Aloha, {currentUser.name}</h2>
              <p className="text-lava/70">What are you looking for today?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div 
                 onClick={() => setCurrentView('browse')}
                 className="bg-white p-6 rounded-[16px] border border-mist shadow-sm flex flex-col items-center justify-center gap-3 hover:border-kai/50 cursor-pointer transition"
                >
                  <div className="bg-kai/10 p-3 rounded-full text-kai">
                    <Search size={28} />
                  </div>
                  <span className="font-medium">Browse Items</span>
               </div>
               <div 
                 onClick={() => setCurrentView('map')}
                 className="bg-white p-6 rounded-[16px] border border-mist shadow-sm flex flex-col items-center justify-center gap-3 hover:border-lau/50 cursor-pointer transition"
                >
                  <div className="bg-lau/10 p-3 rounded-full text-lau">
                    <Map size={28} />
                  </div>
                  <span className="font-medium">View Map</span>
               </div>
            </div>

            <div className="bg-gradient-to-r from-kai to-lau rounded-[16px] p-6 text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-serif font-bold text-xl mb-2">AI Assistant</h3>
                 <p className="text-white/90 text-sm mb-4 max-w-[80%]">
                   Need help pricing an item or finding a specific surfboard? Ask the assistant!
                 </p>
                 <button 
                   onClick={() => setCurrentView('chat')}
                   className="bg-white text-kai font-semibold px-4 py-2 rounded-lg text-sm"
                 >
                   Open Chat
                 </button>
               </div>
               {/* Decorative Circle */}
               <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-serif font-bold text-lg text-koa">Recent Listings</h3>
                 <button onClick={() => setCurrentView('browse')} className="text-sm text-kai">View All</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {listings.slice(0, 2).map(l => (
                    <div key={l.id} className="flex bg-white p-3 rounded-[16px] border border-mist shadow-sm gap-3 cursor-pointer" onClick={() => setCurrentView('browse')}>
                       <img src={l.photos[0]} className="w-24 h-24 object-cover rounded-lg bg-gray-200" alt={l.title} />
                       <div className="flex flex-col justify-center">
                          <h4 className="font-medium text-lava">{l.title}</h4>
                          <span className="text-kai font-bold">${l.price}</span>
                          <span className="text-xs text-lava/60 mt-1">{l.location}</span>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'browse' && (
          <BrowseView 
            listings={listings} 
            activeFilters={activeFilters}
            onListingClick={(l) => console.log('Clicked', l.title)}
            onClearFilters={clearFilters}
            currentUser={currentUser}
            onBoost={handleBoostListing}
          />
        )}

        {currentView === 'map' && (
          <MapView 
            listings={listings}
            onListingClick={(l) => console.log('Clicked Map Pin', l.title)}
          />
        )}

        {currentView === 'tools' && (
          <ToolsView 
            onAiCreate={() => setCurrentView('chat')}
            onManualCreate={() => setCurrentView('create')}
            activeListingsCount={listings.filter(l => l.sellerId === currentUser.id).length}
          />
        )}
        
        {currentView === 'create' && (
          <CreateListingForm 
             onCancel={() => setCurrentView('tools')}
             onSubmit={handleCreateAction}
          />
        )}

        {currentView === 'chat' && (
          <ChatInterface 
            onSearchAction={handleSearchAction}
            onCreateAction={handleCreateAction}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            user={currentUser}
            userListings={listings.filter(l => l.sellerId === currentUser.id)}
            onLogout={handleLogout}
            onListingClick={(l) => console.log('Clicked', l.title)}
            onBoost={handleBoostListing}
          />
        )}

      </main>

      <BottomNav />
    </div>
  );
};

export default App;
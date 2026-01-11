import React from 'react';
import { PlusCircle, BarChart3, Zap, Store, Shield, ChevronRight } from 'lucide-react';
import { Listing } from '../types';

interface ToolsViewProps {
  onCreateClick: () => void;
  activeListingsCount: number;
}

const ToolsView: React.FC<ToolsViewProps> = ({ onCreateClick, activeListingsCount }) => {
  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-serif font-bold text-koa">Seller Tools</h2>
        <div className="bg-kai/10 text-kai text-xs font-bold px-2 py-1 rounded-full">
          Free Plan
        </div>
      </div>

      {/* Primary Action */}
      <button 
        onClick={onCreateClick}
        className="w-full bg-gradient-to-r from-kai to-lau text-white p-4 rounded-2xl shadow-lg flex items-center justify-between group hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <PlusCircle size={32} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Post a New Item</h3>
            <p className="text-white/80 text-sm">Sell something in the marketplace</p>
          </div>
        </div>
        <ChevronRight size={24} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition" />
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-mist shadow-sm">
          <div className="flex items-center gap-2 text-lava/60 text-sm mb-2">
            <Store size={16} /> Active Listings
          </div>
          <p className="text-3xl font-bold text-kai">{activeListingsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-mist shadow-sm">
           <div className="flex items-center gap-2 text-lava/60 text-sm mb-2">
            <BarChart3 size={16} /> Views (30d)
          </div>
          <p className="text-3xl font-bold text-koa">142</p>
        </div>
      </div>

      {/* Boost Section */}
      <div className="bg-white rounded-2xl border border-mist overflow-hidden">
        <div className="bg-sunrise/10 p-4 border-b border-sunrise/20 flex items-center gap-2">
          <Zap size={20} className="text-orange-500 fill-orange-500" />
          <h3 className="font-bold text-lava">Boost Your Reach</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-mist/20 transition cursor-pointer border border-transparent hover:border-mist">
             <div>
               <p className="font-bold text-sm text-lava">Quick Boost (24h)</p>
               <p className="text-xs text-lava/60">Get 2x more views for a day</p>
             </div>
             <span className="font-bold text-kai">$1.00</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-mist/20 transition cursor-pointer border border-transparent hover:border-mist">
             <div>
               <p className="font-bold text-sm text-lava">Featured (7 Days)</p>
               <p className="text-xs text-lava/60">Top of category placement</p>
             </div>
             <span className="font-bold text-kai">$5.00</span>
          </div>
        </div>
      </div>

      {/* Business Services */}
      <div className="bg-white rounded-2xl border border-mist p-4">
        <h3 className="font-bold text-lava mb-4 flex items-center gap-2">
          <Shield size={18} className="text-kai" />
          Business Subscription
        </h3>
        <p className="text-sm text-lava/70 mb-4">
          Upgrade to Business Pro to unlock storefront customization and advanced analytics.
        </p>
        <button className="w-full py-2 border border-kai text-kai font-medium rounded-xl hover:bg-kai/5 transition">
          View Plans
        </button>
      </div>

      {/* Provider Leads Teaser */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
         <h3 className="font-bold text-lg mb-1">Are you a Service Provider?</h3>
         <p className="text-sm text-gray-300 mb-4">Plumbers, movers, and cleaners can get leads directly.</p>
         <button className="text-sm font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white transition">
           Enable Service Mode
         </button>
      </div>

    </div>
  );
};

export default ToolsView;
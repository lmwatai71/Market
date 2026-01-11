import React from 'react';
import { ShieldCheck, MapPin, Lock } from 'lucide-react';

const SafetyBanner = () => {
  return (
    <div className="bg-koa text-white text-[10px] py-1.5 px-4 flex justify-between items-center sticky top-16 z-40 shadow-md">
        <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-sunrise animate-pulse" />
            <span className="font-bold tracking-wider uppercase">Hawaiʻi Island Exclusive</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/90">
            <Lock size={10} />
            <span className="font-medium">Secure Launch Mode</span>
        </div>
    </div>
  );
};

export default SafetyBanner;
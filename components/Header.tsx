import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import { APP_NAME } from '../constants';

interface HeaderProps {
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick, activeView }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-mist shadow-sm h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-lava hover:bg-mist/20 rounded-lg">
          <Menu size={24} />
        </button>
        <h1 className="font-serif font-bold text-xl text-kai tracking-tight">
          {APP_NAME}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-lava hover:bg-mist/20 rounded-full">
          <Search size={22} />
        </button>
        <button onClick={onProfileClick} className="p-2 text-lava hover:bg-mist/20 rounded-full">
          <User size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
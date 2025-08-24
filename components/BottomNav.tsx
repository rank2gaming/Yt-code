
import React from 'react';
import { HomeIcon, SearchIcon, CartIcon, ProfileIcon, TagIcon } from './icons';

const navItems = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'offers', label: 'Offers', icon: TagIcon },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'cart', label: 'Cart', icon: CartIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

interface BottomNavProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeItem, setActiveItem }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className="flex flex-col items-center justify-center w-full space-y-1"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-400'
                }`}
                isFilled={isActive && (item.id === 'home' || item.id === 'profile' || item.id === 'offers')}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;

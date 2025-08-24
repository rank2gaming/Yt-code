

import React from 'react';
import { StoreIcon, BellIcon, MenuIcon, BackArrowIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  activePage: string;
  onBack: () => void;
}

const pageTitles: { [key: string]: string } = {
  search: 'Search',
  cart: 'Shopping Cart',
  profile: 'My Account',
  offers: 'Offers',
  'all-categories': 'All Categories',
};


const Header: React.FC<HeaderProps> = ({ onMenuClick, activePage, onBack }) => {
  const { currentUser } = useAuth();
  
  const isHomePage = activePage === 'home';
  let title = pageTitles[activePage] || 'YBT Store';

  if (activePage === 'profile' && !currentUser) {
    title = 'Login / Sign Up';
  }

  return (
    <header className="flex justify-between items-center p-4 h-20">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {isHomePage ? (
          <>
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <StoreIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-800 truncate">YBT Store</h1>
              <p className="text-sm text-gray-500 truncate">Hello, You</p>
            </div>
          </>
        ) : (
          <>
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900" aria-label="Go back">
              <BackArrowIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 truncate">{title}</h1>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4 pl-2">
        <button className="text-gray-600 hover:text-gray-900" aria-label="Notifications">
          <BellIcon className="w-6 h-6" />
        </button>
        <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900" aria-label="Open menu">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
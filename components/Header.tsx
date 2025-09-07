import React from 'react';
import { StoreIcon, BellIcon, MenuIcon, BackArrowIcon, HeartIcon, CartIcon, ProfileIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  activePage: string;
  onBack: () => void;
  navigate: (page: string) => void;
}

const pageTitles: { [key: string]: string } = {
  search: 'Search',
  cart: 'Shopping Cart',
  profile: 'My Account',
  offers: 'Offers',
  'all-categories': 'All Categories',
  wishlist: 'My Wishlist',
};


const Header: React.FC<HeaderProps> = ({ onMenuClick, activePage, onBack, navigate }) => {
  const { currentUser, isAdmin } = useAuth();
  
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
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">YBT Store</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Hello, You</p>
            </div>
          </>
        ) : (
          <>
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Go back">
              <BackArrowIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">{title}</h1>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4 pl-2">
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('offers'); }} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Offers</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('all-categories'); }} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Categories</a>
          {isAdmin && <a href="/admin.html" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Admin Panel</a>}
        </nav>
        <div className="hidden lg:flex items-center space-x-4 ml-4">
          <button onClick={() => navigate('wishlist')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Wishlist">
            <HeartIcon className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('cart')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Cart">
            <CartIcon className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('profile')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Profile">
            <ProfileIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Icons */}
        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Notifications">
          <BellIcon className="w-6 h-6" />
        </button>
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Open menu">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
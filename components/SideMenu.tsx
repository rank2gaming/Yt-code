import React from 'react';
import { HomeIcon, SearchIcon, CartIcon, ProfileIcon, TagIcon, SunIcon, MoonIcon, HeartIcon, AdminIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, setActivePage }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (page: string) => {
    setActivePage(page);
    onClose();
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, action: () => handleNavigation('home') },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, action: () => handleNavigation('wishlist') },
    { id: 'offers', label: 'Offers', icon: TagIcon, action: () => handleNavigation('offers') },
    { id: 'search', label: 'Search', icon: SearchIcon, action: () => handleNavigation('search') },
    { id: 'cart', label: 'Cart', icon: CartIcon, action: () => handleNavigation('cart') },
    { id: 'profile', label: 'Profile', icon: ProfileIcon, action: () => handleNavigation('profile') },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Side Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 id="menu-heading" className="text-xl font-bold text-gray-800 dark:text-gray-200">Menu</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentUser && (
            <div className="mb-6 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Welcome!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={currentUser.email || ''}>{currentUser.email}</p>
            </div>
          )}

          <nav className="flex-grow">
            <ul>
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={item.action}
                      className="w-full flex items-center p-3 my-1 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Icon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <a
                    href="/admin.html"
                    className="w-full flex items-center p-3 my-1 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <AdminIcon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">Admin Panel</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="mt-auto mb-4">
            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg">
              <span className="pl-1 font-medium text-gray-700 dark:text-gray-300">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-6 h-6 text-indigo-500" />
                ) : (
                  <SunIcon className="w-6 h-6 text-yellow-400" />
                )}
              </button>
            </div>
          </div>


          {currentUser ? (
            <div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => handleNavigation('profile')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Login / Sign Up
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;

import React from 'react';
import { HomeIcon, SearchIcon, CartIcon, ProfileIcon, TagIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, setActivePage }) => {
  const { currentUser, logout } = useAuth();

  const handleNavigation = (page: string) => {
    setActivePage(page);
    onClose();
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, action: () => handleNavigation('home') },
    { id: 'offers', label: 'Offers', icon: TagIcon, action: () => handleNavigation('offers') },
    { id: 'search', label: 'Search', icon: SearchIcon, action: () => handleNavigation('search') },
    { id: 'cart', label: 'Cart', icon: CartIcon, action: () => handleNavigation('cart') },
    { id: 'profile', label: 'Profile', icon: ProfileIcon, action: () => handleNavigation('profile') },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Side Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 id="menu-heading" className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentUser && (
            <div className="mb-6 p-3 bg-gray-100 rounded-lg">
              <p className="font-semibold text-gray-800">Welcome!</p>
              <p className="text-sm text-gray-600 truncate" title={currentUser.email || ''}>{currentUser.email}</p>
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
                      className="w-full flex items-center p-3 my-1 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="w-6 h-6 mr-3 text-gray-500" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {currentUser ? (
            <div className="mt-auto">
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
            <div className="mt-auto">
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

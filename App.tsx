


import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PromoSlider from './components/PromoSlider';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import BottomNav from './components/BottomNav';
import ProfilePage from './components/ProfilePage';
import SearchPage from './components/SearchPage';
import CartPage from './components/CartPage';
import SideMenu from './components/SideMenu';
import OffersPage from './components/OffersPage';
import CategoriesPage from './components/CategoriesPage';
import Chatbot from './components/Chatbot';
import { ChatBubbleIcon } from './components/icons';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  const renderContent = () => {
    switch (activePage) {
      case 'search':
        return <SearchPage />;
      case 'cart':
        return <CartPage />;
      case 'profile':
        return <ProfilePage setActivePage={setActivePage} />;
      case 'offers':
        return <OffersPage />;
      case 'all-categories':
        return <CategoriesPage />;
      case 'home':
      default:
        return (
          <>
            <SearchBar />
            <div className="-mx-4">
              <PromoSlider />
            </div>
            <Categories onViewAllClick={() => setActivePage('all-categories')} />
            <FeaturedProducts />
          </>
        );
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="relative pb-24">
        <Header onMenuClick={toggleMenu} activePage={activePage} onBack={() => setActivePage('home')} />
        <main className="px-4">
          {renderContent()}
        </main>
      </div>
      <BottomNav activeItem={activePage} setActiveItem={setActivePage} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} setActivePage={setActivePage} />

      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={toggleChat}
          className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label="Open AI Assistant"
        >
          <ChatBubbleIcon className="w-8 h-8" />
        </button>
      </div>
      <Chatbot isOpen={isChatOpen} onClose={toggleChat} />
    </div>
  );
};

export default App;
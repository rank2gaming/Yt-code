import React, { useState, useEffect, useCallback } from 'react';
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
import WishlistPage from './components/WishlistPage';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  const navigate = useCallback((page: string) => {
    // If we navigate to home, reset the category filter.
    if (page === 'home') {
        setSelectedCategoryId('all');
    }
    setActivePage(page);
  }, []);

  const isUserVerified = currentUser?.emailVerified ?? false;
  const isUserLoggedIn = !!currentUser;

  useEffect(() => {
    // If a user is logged in but not verified, and they are trying to access a page other than 'profile',
    // force them back to the 'profile' page where they will see the verification notice.
    if (isUserLoggedIn && !isUserVerified && activePage !== 'profile') {
      navigate('profile');
    }
  }, [isUserLoggedIn, isUserVerified, activePage, navigate]);

  const onBack = () => {
    // The back button always goes to the home page in this simple version.
    setActivePage('home');
    setSelectedCategoryId('all');
  };


  const renderContent = () => {
    switch (activePage) {
      case 'search':
        return <SearchPage />;
      case 'cart':
        return <CartPage />;
      case 'profile':
        return <ProfilePage setActivePage={navigate} />;
      case 'offers':
        return <OffersPage />;
      case 'all-categories':
        return <CategoriesPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'home':
      default:
        return (
          <>
            <div className="my-4">
                <SearchBar />
            </div>
            <div className="-mx-4">
              <PromoSlider />
            </div>
            <Categories 
              onViewAllClick={() => navigate('all-categories')}
              activeCategory={selectedCategoryId}
              setActiveCategory={setSelectedCategoryId}
            />
            <FeaturedProducts selectedCategoryId={selectedCategoryId} />
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans">
      <div className="relative pb-24">
        <Header onMenuClick={toggleMenu} activePage={activePage} onBack={onBack} navigate={navigate} />
        <main className="px-4">
          {renderContent()}
        </main>
        <Footer />
      </div>
      <BottomNav activeItem={activePage} setActiveItem={navigate} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} setActivePage={navigate} />

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
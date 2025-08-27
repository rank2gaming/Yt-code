
import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { 
  AllIcon, HeadphoneIcon, MobileIcon, LaptopIcon, AccessoriesIcon, 
  FashionIcon, HomeGoodsIcon, BooksIcon, SportsIcon, ToysIcon, BeautyIcon 
} from './icons';
import { db } from '../contexts/AuthContext';
// FIX: The ref and onValue functions are not exported from 'firebase/database' in v8. They are methods on the database object.
// import { ref, onValue } from 'firebase/database';

const iconMap: { [key: string]: React.ReactNode } = {
  'all': <AllIcon className="w-6 h-6" />,
  'headphones': <HeadphoneIcon className="w-6 h-6" />,
  'mobiles': <MobileIcon className="w-6 h-6" />,
  'laptops': <LaptopIcon className="w-6 h-6" />,
  'accessories': <AccessoriesIcon className="w-6 h-6" />,
  'fashion': <FashionIcon className="w-6 h-6" />,
  'homegoods': <HomeGoodsIcon className="w-6 h-6" />,
  'books': <BooksIcon className="w-6 h-6" />,
  'sports': <SportsIcon className="w-6 h-6" />,
  'toys': <ToysIcon className="w-6 h-6" />,
  'beauty': <BeautyIcon className="w-6 h-6" />,
};

const defaultCategories: Category[] = [
  { id: 'all', name: 'All', icon: <AllIcon className="w-6 h-6" /> },
  { id: 'headphones', name: 'Headphones', icon: <HeadphoneIcon className="w-6 h-6" /> },
  { id: 'mobiles', name: 'Mobiles', icon: <MobileIcon className="w-6 h-6" /> },
  { id: 'laptops', name: 'Laptops', icon: <LaptopIcon className="w-6 h-6" /> },
  { id: 'accessories', name: 'Accessories', icon: <AccessoriesIcon className="w-6 h-6" /> },
];

interface CategoriesProps {
  onViewAllClick: () => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onViewAllClick, activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    // FIX: Use Firebase v8 namespaced API for database reference.
    const categoriesRef = db.ref('categories/');
    // FIX: Use Firebase v8 namespaced API to listen for value changes.
    const listener = categoriesRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (typeof data === 'object' && data !== null) {
          let loadedCategories: Category[] = Object.keys(data)
            .map((key): Category | null => {
                const categoryData = data[key];
                if (typeof categoryData === 'object' && categoryData !== null && categoryData.name) {
                    return {
                        id: key,
                        name: categoryData.name,
                        imageUrl: categoryData.imageUrl,
                        icon: !categoryData.imageUrl && categoryData.icon ? (iconMap[categoryData.icon] || <AllIcon className="w-6 h-6" />) : undefined
                    };
                }
                return null;
            })
            .filter((c): c is Category => c !== null);
          
          const allCategoryIndex = loadedCategories.findIndex(c => c.name.toLowerCase() === 'all');
      
          if (allCategoryIndex > -1) {
              const allCategory = loadedCategories.splice(allCategoryIndex, 1)[0];
               if (!allCategory.imageUrl && !allCategory.icon) {
                allCategory.icon = <AllIcon className="w-6 h-6" />;
              }
              // Show max 5 categories on homepage
              setCategories([allCategory, ...loadedCategories.slice(0, 4)]);
          } else {
              const allCategory = { id: 'all', name: 'All', icon: <AllIcon className="w-6 h-6" /> };
              // Show max 5 categories on homepage
              setCategories([allCategory, ...loadedCategories.slice(0, 4)]);
          }
        } else {
           setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
    });

    // FIX: Use Firebase v8 namespaced API to unsubscribe from listener.
    return () => categoriesRef.off('value', listener);
  }, []);


  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Categories</h2>
        <button onClick={onViewAllClick} className="text-sm font-medium text-green-600 hover:underline">View All</button>
      </div>
      <div className="flex justify-between space-x-2">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center space-y-2 flex-1">
            <button
              onClick={() => setActiveCategory(category.id)}
              className={`w-16 h-16 rounded-xl transition-colors flex justify-center items-center ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800'
              }`}
              aria-label={category.name}
            >
              {category.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain" />
              ) : (
                <div className="text-current">
                  {category.icon}
                </div>
              )}
            </button>
            <p className={`text-xs font-medium text-center w-16 truncate ${activeCategory === category.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

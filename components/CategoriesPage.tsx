import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import { 
  AllIcon, HeadphoneIcon, MobileIcon, LaptopIcon, AccessoriesIcon, 
  FashionIcon, HomeGoodsIcon, BooksIcon, SportsIcon, ToysIcon, BeautyIcon 
} from './icons';

interface CategoriesPageProps {}

const iconMap: { [key: string]: React.ReactNode } = {
  'all': <AllIcon className="w-8 h-8" />,
  'headphones': <HeadphoneIcon className="w-8 h-8" />,
  'mobiles': <MobileIcon className="w-8 h-8" />,
  'laptops': <LaptopIcon className="w-8 h-8" />,
  'accessories': <AccessoriesIcon className="w-8 h-8" />,
  'fashion': <FashionIcon className="w-8 h-8" />,
  'homegoods': <HomeGoodsIcon className="w-8 h-8" />,
  'books': <BooksIcon className="w-8 h-8" />,
  'sports': <SportsIcon className="w-8 h-8" />,
  'toys': <ToysIcon className="w-8 h-8" />,
  'beauty': <BeautyIcon className="w-8 h-8" />,
};


const CategoriesPage: React.FC<CategoriesPageProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoriesRef = ref(db, 'categories/');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (typeof data === 'object' && data !== null) {
          const loadedCategories: Category[] = Object.keys(data)
            .map((key): Category | null => {
                const categoryData = data[key];
                if (typeof categoryData === 'object' && categoryData !== null && categoryData.name) {
                    return {
                        id: key,
                        name: categoryData.name,
                        imageUrl: categoryData.imageUrl,
                        icon: !categoryData.imageUrl && categoryData.icon ? (iconMap[categoryData.icon] || <AllIcon className="w-8 h-8" />) : undefined
                    };
                }
                return null;
            })
            .filter((c): c is Category => c !== null);
          
          // Filter out the 'All' category for this page
          const allCategories = loadedCategories.filter(c => c.name.toLowerCase() !== 'all');
          setCategories(allCategories);
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading categories...</p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-2 gap-y-4 text-center">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center space-y-2">
              <button
                className="w-16 h-16 bg-white rounded-xl shadow-sm transition-transform hover:scale-105 flex justify-center items-center"
                aria-label={category.name}
              >
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="text-gray-700">
                    {category.icon}
                  </div>
                )}
              </button>
              <p className="text-xs font-medium text-gray-600 w-16 truncate">{category.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
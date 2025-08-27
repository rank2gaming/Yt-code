import React, { useState, useEffect } from 'react';
import type { Category, Product } from '../types';
import { db } from '../contexts/AuthContext';
// FIX: The ref and onValue functions are not exported from 'firebase/database' in v8. They are methods on the database object.
// import { ref, onValue } from 'firebase/database';
import { 
  AllIcon, HeadphoneIcon, MobileIcon, LaptopIcon, AccessoriesIcon, 
  FashionIcon, HomeGoodsIcon, BooksIcon, SportsIcon, ToysIcon, BeautyIcon, BackArrowIcon 
} from './icons';
import ProductCard from './ProductCard';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // FIX: Use Firebase v8 namespaced API for database reference.
    const categoriesRef = db.ref('categories/');
    // FIX: Use Firebase v8 namespaced API to listen for value changes.
    const listener = categoriesRef.on('value', (snapshot) => {
      setLoadingCategories(true);
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
      setLoadingCategories(false);
    });

    // FIX: Use Firebase v8 namespaced API to unsubscribe from listener.
    return () => categoriesRef.off('value', listener);
  }, []);

  useEffect(() => {
    // FIX: Use Firebase v8 namespaced API for database reference.
    const productsRef = db.ref('products/');
    // FIX: Use Firebase v8 namespaced API to listen for value changes.
    const listener = productsRef.on('value', (snapshot) => {
      setLoadingProducts(true);
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (typeof data === 'object' && data !== null) {
          const loadedProducts: Product[] = Object.keys(data)
            .map(key => {
                const productData = data[key];
                if (typeof productData === 'object' && productData !== null &&
                    productData.name && productData.imageUrl &&
                    typeof productData.rating === 'number' && typeof productData.reviews === 'number') {
                    return {
                        id: key,
                        ...productData
                    } as Product;
                }
                return null;
            })
            .filter((p): p is Product => p !== null);
          setProducts(loadedProducts);
        } else {
            setProducts([]);
        }
      } else {
        setProducts([]);
      }
      setLoadingProducts(false);
    });

    // FIX: Use Firebase v8 namespaced API to unsubscribe from listener.
    return () => productsRef.off('value', listener);
  }, []);


  if (selectedCategory) {
    const filteredProducts = products.filter(p => p.categoryId === selectedCategory.id);
    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Back to categories">
                    <BackArrowIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 ml-2">{selectedCategory.name}</h2>
            </div>
            {loadingProducts ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading products...</p>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No products found in this category.</p>
                </div>
            )}
        </div>
    );
  }

  return (
    <div>
      {loadingCategories ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading categories...</p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-2 gap-y-4 text-center">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setSelectedCategory(category)}
                className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-xl shadow-sm transition-transform hover:scale-105 flex justify-center items-center"
                aria-label={category.name}
              >
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="text-gray-700 dark:text-gray-300">
                    {category.icon}
                  </div>
                )}
              </button>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16 truncate">{category.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
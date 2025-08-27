
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { db } from '../contexts/AuthContext';
// FIX: The ref and onValue functions are not exported from 'firebase/database' in v8. They are methods on the database object.
// import { ref, onValue } from 'firebase/database';

interface FeaturedProductsProps {
  selectedCategoryId: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ selectedCategoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // FIX: Use Firebase v8 namespaced API for database reference.
    const productsRef = db.ref('products/');
    // FIX: Use Firebase v8 namespaced API to listen for value changes.
    const listener = productsRef.on('value', (snapshot) => {
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
      setLoading(false);
    });

    // FIX: Use Firebase v8 namespaced API to unsubscribe from listener.
    return () => productsRef.off('value', listener);
  }, []);
  
  const filteredProducts = selectedCategoryId === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategoryId);

  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Featured Products</h2>
        <a href="#" className="text-sm font-medium text-green-600 hover:underline">View All</a>
      </div>
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
        </div>
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
    </section>
  );
};

export default FeaturedProducts;

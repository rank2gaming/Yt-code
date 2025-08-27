

import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { db } from '../contexts/AuthContext';
// FIX: The ref and onValue functions are not exported from 'firebase/database' in v8. They are methods on the database object.
// import { ref, onValue } from 'firebase/database';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
    });

    // FIX: Use Firebase v8 namespaced API to unsubscribe from listener.
    return () => productsRef.off('value', listener);
  }, []);

  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Featured Products</h2>
        <a href="#" className="text-sm font-medium text-green-600 hover:underline">View All</a>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
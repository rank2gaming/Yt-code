import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';

interface FeaturedProductsProps {
  selectedCategoryId: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ selectedCategoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const productsRef = ref(db, 'products/');
    const unsubscribe = onValue(productsRef, (snapshot) => {
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

    return () => unsubscribe();
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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


import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import ProductCard from './ProductCard';
import PromoSlider from './PromoSlider';

const OffersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
            .filter((p): p is Product => p !== null)
            .filter(p => p.isOffer === true);
          setProducts(loadedProducts);
        } else {
            setProducts([]);
        }
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="-mx-4">
        <PromoSlider />
      </div>
      <section className="my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Special Offers</h2>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No special offers available at the moment.</p>
          </div>
        )}
      </section>
    </>
  );
};
export default OffersPage;
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { db } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import { useWishlist } from '../contexts/WishlistContext';
import { HeartIcon } from './icons';

const WishlistPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist } = useWishlist();

  useEffect(() => {
    const productsRef = db.ref('products/');
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
          setAllProducts(loadedProducts);
        } else {
            setAllProducts([]);
        }
      } else {
        setAllProducts([]);
      }
      setLoading(false);
    });
    return () => productsRef.off('value', listener);
  }, []);

  const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));

  if (loading) {
      return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading wishlist...</div>
  }

  return (
    <section className="my-6">
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <HeartIcon className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Wishlist is Empty</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Tap the heart on products to save them here.</p>
        </div>
      )}
    </section>
  );
};

export default WishlistPage;

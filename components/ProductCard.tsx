


import React, { useState } from 'react';
import type { Product } from '../types';
import { HeartIcon, StarIcon } from './icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const CardContent = (
    <>
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
        {product.isOffer && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            OFFER
          </div>
        )}
        <button
          onClick={handleLikeClick}
          className="absolute top-2 right-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          aria-label="Like product"
        >
          <HeartIcon
            className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-400 dark:text-zinc-400'}`}
            isFilled={isLiked}
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={product.description || product.name}>{product.name}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-zinc-400">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="ml-1 font-medium">{product.rating}</span>
          <span className="ml-2 text-gray-400 dark:text-zinc-500">({product.reviews} reviews)</span>
        </div>
      </div>
    </>
  );

  if (product.redirectUrl) {
    return (
      <a
        href={product.redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden group block"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden group">
      {CardContent}
    </div>
  );
};

export default ProductCard;
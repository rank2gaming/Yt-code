
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, FilterIcon } from './icons';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import type { Product } from '../types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all products once on component mount
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
            .filter((p): p is Product => p !== null);
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

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  // Debounce search query and filter products
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    const handler = setTimeout(() => {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredProducts);
      setIsSuggestionsVisible(true);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [query, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleInputFocus = () => {
    if (suggestions.length > 0 && query.trim() !== '') {
      setIsSuggestionsVisible(true);
    }
  }

  const SuggestionItem = ({ product }: { product: Product }) => (
    <a
      href={product.redirectUrl || '#'}
      target={product.redirectUrl ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
      onClick={() => setIsSuggestionsVisible(false)} // Hide on click
    >
      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-3" />
      <span className="font-medium text-gray-700 truncate">{product.name}</span>
    </a>
  );

  return (
    <div className="flex items-center space-x-2 my-4">
      <div className="relative flex-grow" ref={searchContainerRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        {isSuggestionsVisible && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {suggestions.length > 0 ? (
              <div className="p-2 space-y-1">
                {suggestions.map(product => (
                  <SuggestionItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-gray-500 text-center">No products found.</p>
            )}
          </div>
        )}
      </div>
      <button className="p-3 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
        <FilterIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SearchBar;

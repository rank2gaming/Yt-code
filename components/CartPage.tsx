

import React from 'react';

const CartPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Shopping Cart</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Your cart is currently empty.</p>
    </div>
  );
};

export default CartPage;
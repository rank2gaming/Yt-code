
import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-red-500 rounded-xl p-6 my-4 text-white relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
      <div className="absolute -left-12 -bottom-12 w-40 h-40 border-4 border-yellow-300 rounded-full opacity-30"></div>
      
      <div className="relative z-10">
        <p className="text-xs font-semibold bg-yellow-400 text-yellow-900 inline-block px-2 py-1 rounded">LIMITED TIME OFFER</p>
        <h2 className="text-4xl font-extrabold my-2 leading-tight">SUPER SALE</h2>
        <p className="text-3xl font-bold text-cyan-200 mb-4">50% OFF!</p>
        <div className="flex justify-between items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            SHOP NOW
          </button>
          <div className="flex space-x-1.5">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-50"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-50"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-50"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;

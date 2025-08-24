

import React from 'react';

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  categoryId?: string;
  description?: string;
  redirectUrl?: string;
  isOffer?: boolean;
}
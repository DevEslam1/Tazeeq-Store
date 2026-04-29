export type Product = {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  description: string;
  badges?: ('organic' | 'prime' | 'premium' | 'tazeeq')[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  image?: string;
  productCount?: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Address = {
  id: string;
  title: string;
  details: string;
  phone: string;
  city: string;
  selected?: boolean;
};

export type Order = {
  id: string;
  status: 'Delivered' | 'Processing' | 'On the way' | 'Placed';
  total: number;
  date: string;
  items: number;
  cartItems?: CartItem[];
  address?: Address;
  paymentMethod?: string;
  deliverySlot?: DeliverySlot;
  estimatedDelivery?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
};

export type DeliverySlot = {
  id: string;
  time: string;
  date: string;
  available: boolean;
};

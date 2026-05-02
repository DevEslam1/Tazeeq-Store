export type MainTabParamList = {
  Shop: undefined;
  Organic: undefined;
  Assistant: undefined;
  Orders: undefined;
  Account: undefined;
};

export type ShopStackParamList = {
  Home: undefined;
  Categories: undefined;
  ProductList: { categoryId: string; categoryName: string };
  ProductDetail: { productId: string };
  Search: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  OrderHistory: undefined;
  AddressList: undefined;
  AddAddress: undefined;
  Wishlist: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type CheckoutStackParamList = {
  Cart: undefined;
  Delivery: undefined;
  Payment: undefined;
  Confirmation: undefined;
  ProductDetail: { productId: string };
};

export type OrderStackParamList = {
  OrderHistory: undefined;
  Tracking: undefined;
  Rating: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Checkout: undefined;
  Order: undefined;
  Auth: undefined;
  Search: undefined;
  Notifications: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

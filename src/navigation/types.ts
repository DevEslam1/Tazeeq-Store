export type MainTabParamList = {
  Shop: undefined;
  Organic: undefined;
  Orders: undefined;
  Account: undefined;
};

export type ShopStackParamList = {
  Home: undefined;
  Categories: undefined;
  ProductList: { categoryId: string; categoryName: string };
  ProductDetail: { productId: string };
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
};

/*! UruBuy typescript definitions */

export type TCategory = {
  id: string;
  name: string;
};

export type TShoppingPost = {
  id: string;
  title: string;
  date?: string | null;
  description: string;
  price: number;
  onSale: boolean;
  saleDiscount?: number | null;
  category: Category;
  hasDelivery: boolean;
  deliveryCost?: number | null;
  addresses: string[];
  stock: number;
  averageRating?: number | null;
  isNew: boolean;
  weight?: number | null;
  base64Images: string[];
  sellerEmail: string;
  shoppingPostStatus: string;
  reviews: TReview[];
};

export type minShoppingPost = {
  id: string;
  title: string;
  price: number;
  onSale: boolean;
  saleDiscount?: number | null;
  hasDelivery: boolean;
  deliveryCost?: number | null;
  sellerEmail: string;
};

export type TUserKC = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type TCustomer = {
  username: string;
  email: string;
  password: string;
  picture: string;
  addresses: string[];
  averageRating: number;
  givenUserReviews?: TUserReview[];
  givenReviews?: TReview[];
  receivedUserReviews?: TUserReview[];
  purchases: TPurchase[];
  isBlocked: boolean;
  isSuspended: boolean;
};

export type TSeller = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picture: string;
  addresses: string[];
  barcode: string;
  personalId: string;
  averageRating: number;
  givenUserReviews?: TUserReview[];
  receivedUserReviews?: TUserReview[];
};

export type TShoppingCart = {
  id: string;
  customerEmail: string;
  subtotal: number;
  total: number;
  shoppingPosts: {
    idShoppingPost: number;
  };
};

export type newShoppingCart = {
  customerEmail: string;
  shoppingPostsId: number;
  shoppingPostsQuantity: number;
};

export type TCheckout = {
  shoppingPostId: number;
  quantity: number;
  isDelivery: boolean;
  address: string;
};

export type TCheckoutResponse = {
  id: string;
  checkoutShoppingPosts: CheckoutShoppingPost[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  customerEmail: string;
};

export type TCheckoutShoppingPost = {
  id: number;
  shoppingPost: minShoppingPost;
  quantity: number;
  isDelivery: boolean;
  address: string;
};

export type TPurchase = {
  id: string;
  status: string;
  date: string;
  total: number;
  address: string;
  isDelivery: boolean;
  orderPayPalId: string;
  sellerEmail: string;
  customerEmail: string;
  shoppingPosts: minShoppingPost[];
  customerReview: TUserReview;
  sellerReview: TUserReview;
};

export type TUserReview = {
  id: string;
  rating: number;
  description: string;
  date: string;
  customerEmail: string;
  sellerEmail: string;
  from: "CUSTOMER";
  purchaseId: number;
};

export type TReview = {
  id: string;
  rating: number;
  description: string;
  base64Images: string[];
  date: string;
  customerEmail: string;
  shoppingPost: minShoppingPost;
};

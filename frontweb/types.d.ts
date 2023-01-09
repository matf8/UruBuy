/*! UruBuy typescript definitions */

export interface Category {
  id: string;
  name: string;
}

export type ShoppingPost = {
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
  sellerEmail: string;
};

export interface IShoppingPost {
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
  showItemHandler: (event: React.SyntheticEvent) => void;
}

export interface IMinShoppingPost {
  id: string;
  title: string;
  price: number;
  onSale: boolean;
  saleDiscount?: number | null;
  hasDelivery: boolean;
  deliveryCost?: number | null;
  sellerEmail: string;
}

export type UserKC = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Administrator = {
  username: string;
  email: string;
  password: string;
};

export type Customer = {
  username: string;
  email: string;
  password: string;
  picture: string;
  isSuspended: boolean;
  addresses: string[];
  givenUserReviews: TUserReview[];
  receivedUserReviews: TUserReview[];
  purchases: TPurchase[];
  givenReviews: TReview[];
};

export type Seller = {
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
  givenUserReviews: TUserReview[];
  receivedUserReviews: TUserReview[];
  sales: TPurchase[];
};

export type TShoppingCart = {
  id: string;
  customer: Customer;
  subtotal: number;
  total: number;
  shoppingPosts: {
    id: number;
  };
};

export type newShoppingCart = {
  customerEmail: string;
  shoppingPostId: number;
  shoppingPostQuantity: number;
};

export type TCheckout = {
  shoppingPostId: number;
  quantity: number;
  isDelivery: boolean;
  address: string;
};

export type CheckoutDetail = {
  id: string;
  subtotal: number;
  total: number;
  discount: number;
  deliveryCost: number;
  checkoutShoppingPosts: TCheckoutShoppingPost[];
};

export type TCheckoutShoppingPost = {
  id: number;
  quantity: number;
  isDelivery: boolean;
  address: string;
  shoppingPost: IMinShoppingPost;
};

export interface IEditShoppingPost {
  id: string;
  title: string;
  description: string;
  base64Images: string[];
  price: number;
  hasDelivery: boolean;
  deliveryCost: number;
  addresses: string[];
  stock: number;
  onSale: boolean;
  saleDiscount: number;
  isNew: boolean;
  weight: number;
}

export type TPurchase = {
  id: string;
  status: string;
  date: string;
  total: number;
  address: string;
  isDelivery: boolean;
  idOrderPaypal: string;
  sellerEmail: string;
  customerEmail: string;
  shoppingPosts: IMinShoppingPost[];
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
  from: string;
  purchaseId: string;
};

export type TReview = {
  id: string;
  rating: number;
  description: string;
  base64Images: string[];
  date: string;
  customerEmail: string;
  shoppingPost: IMinShoppingPost,
};

export interface ICreateShoppingPost {
  title: string;
  description: string;
  base64Images: string[];
  price: number;
  hasDelivery: boolean;
  deliveryCost: number;
  addresses: string[];
  stock: number;
  onSale: boolean;
  saleDiscount: number;
  isNew: boolean;
  weight: number;
  categoryId: number;
  sellerEmail: string;
}
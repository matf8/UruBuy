import { CheckoutDetail, IMinShoppingPost, TPurchase } from "../types";

export const emptyShoppingPost = {
  id: "",
  title: "",
  date: "",
  description: "",
  price: 0,
  onSale: false,
  saleDiscount: 0,
  category: { id: "0", name: "" },
  hasDelivery: false,
  deliveryCost: 0,
  addresses: [],
  stock: 0,
  averageRating: 0,
  isNew: false,
  weight: 0,
  base64Images: [],
  sellerEmail: "",
  shoppingPostStatus: "",
  showItemHandler: () => {},
};

export const emptyCheckout: CheckoutDetail = {
  id: "",
  subtotal: 0,
  total: 0,
  discount: 0,
  deliveryCost: 0,
  checkoutShoppingPosts: [
    {
      id: 0,
      quantity: 0,
      isDelivery: true,
      address: "",
      shoppingPost: [] as never,
    },
  ],
};

export const emptyMinShoppingPost: IMinShoppingPost = {
  id: "",
  title: "",
  price: 0.0,
  onSale: false,
  saleDiscount: 0,
  hasDelivery: false,
  deliveryCost: 0.0,
  sellerEmail: "",
};

export const emptyPurchase: TPurchase = {
  id: "",
  status: "",
  date: "",
  total: 0,
  address: "",
  isDelivery: false,
  idOrderPaypal: "",
  shoppingPosts: [],
  sellerEmail: "",
  customerEmail: "",
  customerReview: {
    id: "",
    rating: 0,
    description: "",
    date: "",
    customerEmail: "",
    sellerEmail: "",
    from: "",
    purchaseId: "",
  },
  sellerReview: {
    id: "",
    rating: 0,
    description: "",
    date: "",
    customerEmail: "",
    sellerEmail: "",
    from: "",
    purchaseId: "",
  },
};

export const emptyCreateShoppingPost = {
  title: "",
  description: "",
  price: -1,
  base64Images: ["asd"],
  saleDiscount: -1,
  categoryId: 0,
  hasDelivery: false,
  onSale: false,
  deliveryCost: -1,
  adress: "",
  stock: -1,
  isNew: false,
  weight: -1,
  addresses: [],
  sellerEmail: "",
};

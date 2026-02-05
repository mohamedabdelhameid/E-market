import { Brand, Category, Subcategory } from '../products/iproduct.interface';

export interface RootCart {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: Cart;
  message?: string;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface Product {
  count: number;
  _id: string;
  product: Product2;
  price: number;
}

export interface Product2 {
  subcategory: Subcategory[];
  _id: string;
  title: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  id: string;
}

export interface AddToCart {
  productId: string;
}

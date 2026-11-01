export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tag: string | null;
  tagColor?: string;
  image: string;
  defaultOptions: { size: string; addOns: string[] };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface SizeOption {
  id: string;
  name: string;
  adjustment: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  size: string;
  sizeAdjustment: number;
  selectedAddOns: AddOn[];
  notes: string;
  image: string;
}

export type ModalType =
  | 'SIZE'
  | 'ADDONS'
  | 'NOTES'
  | 'QUANTITY'
  | 'DELIVERY_DETAILS'
  | 'PAYMENT'
  | 'CASH_TENDER'
  | 'CHECKOUT_SUCCESS'
  | null;

export interface SwipeStart {
  cartItemId: string;
  x: number;
  offset: number;
}

export interface SwipingItem {
  cartItemId: string;
  offset: number;
}

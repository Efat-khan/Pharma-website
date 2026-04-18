export interface Product {
  id: string;
  name: string;
  slug: string;
  genericName?: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  requiresPrescription: boolean;
  isFeatured: boolean;
  isActive: boolean;
  category: Category;
  brand?: Brand;
  images: ProductImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  addressSnapshot: Address;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
  statusLogs?: OrderStatusLog[];
}

export interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  total: number;
  product: Product;
}

export interface OrderStatusLog {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
}

export interface Address {
  id?: string;
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  district: string;
  thana: string;
  postCode?: string;
  isDefault?: boolean;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'COD' | 'BKASH' | 'SSLCOMMERZ';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

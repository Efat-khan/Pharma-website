import { create } from 'zustand';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sellingPrice: number;
    mrp: number;
    images: { url: string }[];
    requiresPrescription: boolean;
  };
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  setCart: (cart: { items: CartItem[]; subtotal: number }) => void;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,

  setCart: (cart) =>
    set({
      items: cart.items,
      subtotal: cart.subtotal,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    }),

  clearLocalCart: () => set({ items: [], subtotal: 0, itemCount: 0 }),
}));

'use client';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Login to view your cart</h2>
        <p className="text-gray-500 mb-6">Your cart items will be saved when you log in.</p>
        <Link href="/login" className="bg-brand-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-800 transition-colors">
          Login Now
        </Link>
      </div>
    );
  }

  if (isLoading) return (
    <div className="container-custom py-8 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 animate-pulse">
          <div className="w-20 h-20 bg-gray-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!cart?.items?.length) return (
    <div className="container-custom py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started.</p>
      <Link href="/products" className="bg-brand-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-800 transition-colors">
        Browse Products
      </Link>
    </div>
  );

  const deliveryCharge = cart.subtotal >= 500 ? 0 : 60;
  const total = cart.subtotal + deliveryCharge;

  return (
    <div className="container-custom py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart ({cart.items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item: any) => {
            const image = item.product.images?.[0]?.url;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
                <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {image ? (
                      <Image src={image} alt={item.product.name} width={80} height={80} className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">💊</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-brand-700 line-clamp-2 leading-snug">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-brand-700 font-bold mt-1">{formatPrice(item.product.sellingPrice)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                        disabled={updateItem.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                        disabled={updateItem.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">
                        {formatPrice(Number(item.product.sellingPrice) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem.mutate(item.productId)}
                        disabled={removeItem.isPending}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>{formatPrice(deliveryCharge)}</span>
                )}
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  Add {formatPrice(500 - cart.subtotal)} more for free delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-5 bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <Link href="/products" className="block text-center text-sm text-brand-700 hover:text-brand-800 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

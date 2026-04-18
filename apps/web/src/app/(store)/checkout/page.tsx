'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, MapPin, Wallet, Banknote, CreditCard, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const addressSchema = z.object({
  recipientName: z.string().min(2),
  phone: z.string().regex(/^01[3-9]\d{8}$/),
  line1: z.string().min(5),
  district: z.string().min(2),
  thana: z.string().min(2),
});

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
  { id: 'BKASH', label: 'bKash', icon: Wallet, desc: 'Pay via bKash mobile banking' },
  { id: 'SSLCOMMERZ', label: 'Card / Net Banking', icon: CreditCard, desc: 'Visa, Mastercard, etc.' },
];

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const qc = useQueryClient();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: isAuthenticated,
  });

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/users/addresses').then(r => r.data),
    enabled: isAuthenticated,
    onSuccess: (data: any[]) => {
      if (!selectedAddress && data?.length > 0) {
        setSelectedAddress(data.find(a => a.isDefault)?.id || data[0]?.id);
      }
    },
  } as any);

  const addressForm = useForm({ resolver: zodResolver(addressSchema) });

  const addAddressMutation = useMutation({
    mutationFn: (data: any) => api.post('/users/addresses', data).then(r => r.data),
    onSuccess: (addr) => {
      refetchAddresses();
      setSelectedAddress(addr.id);
      setShowAddressForm(false);
      toast.success('Address saved');
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: (data: any) => api.post('/orders', data).then(r => r.data),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to place order'),
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!cart?.items?.length) {
    router.push('/cart');
    return null;
  }

  const deliveryCharge = cart.subtotal >= 500 ? 0 : 60;
  const total = cart.subtotal + deliveryCharge;

  const handlePlaceOrder = () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    placeOrderMutation.mutate({
      addressId: selectedAddress,
      paymentMethod,
      couponCode: couponCode || undefined,
    });
  };

  return (
    <div className="container-custom py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Delivery address */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> Delivery Address
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-sm text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            {showAddressForm && (
              <form
                onSubmit={addressForm.handleSubmit((d) => addAddressMutation.mutate(d))}
                className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3"
              >
                {[
                  { name: 'recipientName', placeholder: 'Recipient Name' },
                  { name: 'phone', placeholder: 'Phone (01XXXXXXXXX)' },
                  { name: 'line1', placeholder: 'House/Flat, Road, Area' },
                  { name: 'district', placeholder: 'District' },
                  { name: 'thana', placeholder: 'Thana / Upazila' },
                ].map((f) => (
                  <input
                    key={f.name}
                    {...addressForm.register(f.name as any)}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400"
                  />
                ))}
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending}
                  className="w-full bg-brand-700 text-white py-2.5 rounded-lg text-sm font-medium"
                >
                  Save Address
                </button>
              </form>
            )}

            <div className="space-y-2">
              {addresses?.map((addr: any) => (
                <label
                  key={addr.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
                    selectedAddress === addr.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200',
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1 accent-brand-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{addr.recipientName} · {addr.phone}</p>
                    <p className="text-xs text-gray-500">{addr.line1}, {addr.thana}, {addr.district}</p>
                    {addr.isDefault && <span className="text-xs text-brand-600 font-medium">Default</span>}
                  </div>
                </label>
              ))}
              {!addresses?.length && !showAddressForm && (
                <p className="text-sm text-gray-500 text-center py-4">No addresses yet. Add one above.</p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-600" /> Payment Method
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={cn(
                      'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors',
                      paymentMethod === method.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200',
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-brand-600"
                    />
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Cart items preview */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="font-medium">{formatPrice(Number(item.product.sellingPrice) * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400"
              />
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors">
                Apply
              </button>
            </div>

            <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending || !selectedAddress}
              className="w-full mt-5 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {placeOrderMutation.isPending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Place Order <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

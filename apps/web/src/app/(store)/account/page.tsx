'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, FileText, LogOut, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useLogout();
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || '', email: '' },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile').then(r => r.data),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (profile) reset({ name: profile.name || '', email: profile.email || '' });
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch('/users/profile', data).then(r => r.data),
    onSuccess: (data) => {
      updateUser({ name: data.name });
      toast.success('Profile updated');
    },
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const menuItems = [
    { href: '/orders', icon: Package, label: 'My Orders', desc: 'Track and manage your orders' },
    { href: '/account/addresses', icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses' },
    { href: '/prescriptions', icon: FileText, label: 'Prescriptions', desc: 'View uploaded prescriptions' },
  ];

  return (
    <div className="container-custom py-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-brand-700 font-bold text-2xl">
              {profile?.name?.[0]?.toUpperCase() || <User className="w-7 h-7" />}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{profile?.name || 'User'}</p>
            <p className="text-sm text-gray-500">{profile?.phone}</p>
            <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2 py-0.5 rounded mt-1 inline-block">
              {profile?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
            <input
              {...register('name')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email (optional)</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium text-sm transition-colors"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}

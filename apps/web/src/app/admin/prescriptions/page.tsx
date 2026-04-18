'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, ChevronLeft, ChevronRight, User, Phone, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import {
  useAdminPrescriptions,
  usePendingPrescriptionCount,
  PrescriptionStatus,
  Prescription,
} from '@/lib/api/prescriptions';
import { formatDate } from '@/lib/utils';

const STATUS_BADGE: Record<PrescriptionStatus, string> = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  PENDING_REVIEW: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

type TabFilter = '' | PrescriptionStatus;

const TABS: { label: string; value: TabFilter; showCount?: boolean }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING_REVIEW', showCount: true },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function AdminPrescriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<TabFilter>('PENDING_REVIEW');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminPrescriptions({
    status: activeTab || undefined,
    page,
    limit: 20,
  });
  const { data: pendingCount } = usePendingPrescriptionCount();

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-gray-800">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Prescriptions</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Prescription Queue</h1>
          {(pendingCount ?? 0) > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
              {pendingCount} need review
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.showCount && (pendingCount ?? 0) > 0 && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center gap-4">
                  <div className="w-14 h-16 bg-gray-100 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.data.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">No prescriptions found</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'PENDING_REVIEW' ? 'Queue is empty — all caught up!' : 'Nothing here yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Preview</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Patient</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Phone</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Uploaded</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.data.map((rx) => (
                      <PrescriptionRow key={rx.id} rx={rx} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {data.data.map((rx) => (
                  <MobileCard key={rx.id} rx={rx} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="flex items-center px-3 text-sm text-gray-700">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrescriptionRow({ rx }: { rx: Prescription }) {
  const isPdf = rx.fileUrl.toLowerCase().includes('.pdf');
  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => (window.location.href = `/admin/prescriptions/${rx.id}`)}
    >
      <td className="px-6 py-3">
        <div className="w-14 h-16 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {isPdf ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-red-400">PDF</span>
            </div>
          ) : (
            <Image
              src={rx.fileUrl}
              alt="prescription"
              fill
              className="object-cover"
              sizes="56px"
            />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-brand-600" />
          </div>
          <span className="font-medium text-gray-800">{rx.user.name || '(No name)'}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{rx.user.phone}</td>
      <td className="px-4 py-3 text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(rx.createdAt)}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[rx.status]}`}>
          {STATUS_LABEL[rx.status]}
        </span>
      </td>
      <td className="px-6 py-3 text-right">
        <Link
          href={`/admin/prescriptions/${rx.id}`}
          className="text-sm text-brand-700 font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {rx.status === 'PENDING_REVIEW' ? 'Review →' : 'View →'}
        </Link>
      </td>
    </tr>
  );
}

function MobileCard({ rx }: { rx: Prescription }) {
  const isPdf = rx.fileUrl.toLowerCase().includes('.pdf');
  return (
    <Link href={`/admin/prescriptions/${rx.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-14 h-16 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
        {isPdf ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-red-400">PDF</span>
          </div>
        ) : (
          <Image src={rx.fileUrl} alt="prescription" fill className="object-cover" sizes="56px" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{rx.user.name || '(No name)'}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <Phone className="w-3 h-3" />
          {rx.user.phone}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.createdAt)}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_BADGE[rx.status]}`}>
        {STATUS_LABEL[rx.status]}
      </span>
    </Link>
  );
}

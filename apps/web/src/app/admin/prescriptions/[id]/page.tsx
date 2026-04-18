'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Calendar, CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import {
  useAdminPrescription,
  useReviewPrescription,
  PrescriptionStatus,
} from '@/lib/api/prescriptions';
import { formatDate, formatPrice } from '@/lib/utils';
import PrescriptionViewer from '@/components/admin/PrescriptionViewer';
import RejectModal from '@/components/admin/RejectModal';

const STATUS_BADGE: Record<PrescriptionStatus, string> = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export default function AdminPrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const { data: rx, isLoading } = useAdminPrescription(id);
  const { mutate: review, isPending: isReviewing } = useReviewPrescription(id);

  const [reviewNote, setReviewNote] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = () => {
    review({ status: 'APPROVED', reviewNote: reviewNote.trim() || undefined });
  };

  const handleReject = (note: string) => {
    review(
      { status: 'REJECTED', reviewNote: note || undefined },
      { onSuccess: () => setRejectModalOpen(false) },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-5xl p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!rx) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Prescription not found</p>
          <Link href="/admin/prescriptions" className="text-brand-700 hover:underline text-sm">
            ← Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  const isPending = rx.status === 'PENDING_REVIEW';

  return (
    <>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-gray-800">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/prescriptions" className="hover:text-gray-800">Prescriptions</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium font-mono">{id.slice(0, 8)}…</span>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/admin/prescriptions"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Queue
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_BADGE[rx.status]}`}>
              {STATUS_LABEL[rx.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: prescription image */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Prescription Image</h2>
                <PrescriptionViewer fileUrl={rx.fileUrl} patientName={rx.user.name || rx.user.phone} />
              </div>
            </div>

            {/* RIGHT: patient info + review */}
            <div className="lg:col-span-3 space-y-5">
              {/* Patient info */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Patient Information</h2>
                <div className="space-y-3">
                  <InfoRow icon={<User className="w-4 h-4 text-gray-400" />} label="Name">
                    {rx.user.name || <span className="text-gray-400 italic">Not provided</span>}
                  </InfoRow>
                  <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Phone">
                    <span className="font-mono">{rx.user.phone}</span>
                  </InfoRow>
                  <InfoRow icon={<Calendar className="w-4 h-4 text-gray-400" />} label="Uploaded">
                    {formatDate(rx.createdAt)}
                  </InfoRow>
                </div>
              </div>

              {/* Linked order */}
              {rx.order && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    Linked Order
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-gray-800">{rx.order.orderNumber}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{formatPrice(rx.order.total)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                        {rx.order.status}
                      </span>
                      <Link
                        href={`/admin/orders/${rx.order.id}`}
                        className="text-sm text-brand-700 font-medium hover:underline"
                      >
                        View Order →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Review panel — pending */}
              {isPending && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-900 mb-4">Review</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Review Note
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={3}
                        placeholder="Add a note for this prescription (visible to patient on rejection)…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={isReviewing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isReviewing ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModalOpen(true)}
                        disabled={isReviewing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Review result — already reviewed */}
              {!isPending && (
                <div className={`rounded-xl border p-5 ${
                  rx.status === 'APPROVED'
                    ? 'bg-green-50 border-green-100'
                    : 'bg-red-50 border-red-100'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {rx.status === 'APPROVED' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h2 className={`font-semibold ${
                      rx.status === 'APPROVED' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {rx.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm">
                    {rx.reviewedBy && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Reviewed by: <span className="font-medium">{rx.reviewedBy}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(rx.updatedAt)}
                    </div>
                    {rx.reviewNote && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">Review Note</p>
                        <p className="text-gray-700">{rx.reviewNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RejectModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
        isLoading={isReviewing}
      />
    </>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5">{children}</p>
      </div>
    </div>
  );
}

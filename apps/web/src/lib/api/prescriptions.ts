import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export type PrescriptionStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface Prescription {
  id: string;
  userId: string;
  fileUrl: string;
  fileKey: string;
  status: PrescriptionStatus;
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    phone: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
  } | null;
}

export interface PrescriptionFilters {
  status?: PrescriptionStatus | '';
  page?: number;
  limit?: number;
}

export interface PrescriptionsResponse {
  data: Prescription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewPayload {
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}

export function useAdminPrescriptions(filters: PrescriptionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 20));

  return useQuery<PrescriptionsResponse>({
    queryKey: ['admin-prescriptions', filters],
    queryFn: () => api.get(`/admin/prescriptions?${params}`).then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useAdminPrescription(id: string) {
  return useQuery<Prescription>({
    queryKey: ['admin-prescription', id],
    queryFn: () => api.get(`/admin/prescriptions/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function usePendingPrescriptionCount() {
  return useQuery<number>({
    queryKey: ['admin-prescriptions-pending-count'],
    queryFn: () =>
      api
        .get('/admin/prescriptions?status=PENDING_REVIEW&limit=1')
        .then((r) => r.data.total ?? 0),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}

export function useReviewPrescription(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) =>
      api.patch(`/admin/prescriptions/${id}/review`, payload).then((r) => r.data),
    onSuccess: (_, vars) => {
      toast.success(vars.status === 'APPROVED' ? 'Prescription approved' : 'Prescription rejected');
      qc.invalidateQueries({ queryKey: ['admin-prescription', id] });
      qc.invalidateQueries({ queryKey: ['admin-prescriptions'] });
      qc.invalidateQueries({ queryKey: ['admin-prescriptions-pending-count'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => toast.error('Failed to submit review'),
  });
}

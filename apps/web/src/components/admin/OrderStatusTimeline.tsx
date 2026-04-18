'use client';
import { OrderStatusLog, OrderStatus } from '@/lib/api/orders';
import { formatDate } from '@/lib/utils';
import { getOrderStatusColor } from '@/lib/utils';
import {
  Clock, CheckCircle, Cog, Truck, PackageCheck, XCircle, RotateCcw,
} from 'lucide-react';

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Cog,
  SHIPPED: Truck,
  DELIVERED: PackageCheck,
  CANCELLED: XCircle,
  REFUNDED: RotateCcw,
};

interface Props {
  logs: OrderStatusLog[];
}

export default function OrderStatusTimeline({ logs }: Props) {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (!sorted.length) {
    return <p className="text-sm text-gray-400 py-4 text-center">No status history</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3 space-y-6 py-1">
      {sorted.map((log, i) => {
        const Icon = STATUS_ICONS[log.status] ?? Clock;
        const isLast = i === sorted.length - 1;
        return (
          <li key={log.id} className="ml-6">
            <span
              className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                isLast ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            >
              <Icon className={`h-3 w-3 ${isLast ? 'text-white' : 'text-gray-500'}`} />
            </span>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getOrderStatusColor(log.status)}`}
                  >
                    {log.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString('en-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {log.note && (
                  <p className="mt-1 text-sm text-gray-600">{log.note}</p>
                )}
                {log.createdBy && (
                  <p className="mt-0.5 text-xs text-gray-400">by {log.createdBy}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderStatus } from '@prisma/client';

export interface OrderPlacedPayload {
  customerPhone: string;
  customerEmail?: string | null;
  customerName?: string | null;
  orderNumber: string;
  items: { productName: string; quantity: number; total: number }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export interface OrderStatusChangedPayload {
  customerPhone: string;
  customerName?: string | null;
  orderNumber: string;
  status: OrderStatus;
}

export interface OtpSendPayload {
  phone: string;
  otp: string;
}

export interface PrescriptionStatusPayload {
  customerPhone: string;
  customerName?: string | null;
  status: 'APPROVED' | 'REJECTED';
  note?: string | null;
}

export interface LowStockAlertPayload {
  adminEmail: string;
  productName: string;
  sku: string;
  stock: number;
}

@Injectable()
export class NotificationsService {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  async notifyOrderPlaced(payload: OrderPlacedPayload) {
    await this.queue.add('order_placed', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }

  async notifyOrderStatusChanged(payload: OrderStatusChangedPayload) {
    await this.queue.add('order_status_changed', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }

  async notifyOtpSend(payload: OtpSendPayload) {
    await this.queue.add('otp_send', payload, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 2000 },
      priority: 1,
    });
  }

  async notifyPrescriptionStatus(payload: PrescriptionStatusPayload) {
    await this.queue.add('prescription_status', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }

  async notifyLowStock(payload: LowStockAlertPayload) {
    await this.queue.add('low_stock_alert', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 10000 },
      jobId: `low-stock-${payload.sku}`,
    });
  }
}

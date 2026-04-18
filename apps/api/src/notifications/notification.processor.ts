import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Resend } from 'resend';
import { SmsService } from './sms.service';
import { PrismaService } from '../prisma/prisma.service';
import { orderPlacedEmail, lowStockAlertEmail } from './email.templates';
import {
  OrderPlacedPayload,
  OrderStatusChangedPayload,
  OtpSendPayload,
  PrescriptionStatusPayload,
  LowStockAlertPayload,
} from './notifications.service';
import { OrderStatus } from '@prisma/client';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'অপেক্ষমান',
  CONFIRMED: 'নিশ্চিত',
  PROCESSING: 'প্রক্রিয়াধীন',
  SHIPPED: 'পাঠানো হয়েছে',
  DELIVERED: 'ডেলিভারি সম্পন্ন',
  CANCELLED: 'বাতিল',
  REFUNDED: 'রিফান্ড হয়েছে',
};

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);
  private readonly resend: Resend;

  constructor(
    private readonly smsService: SmsService,
    private readonly prisma: PrismaService,
  ) {
    super();
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async process(job: Job) {
    this.logger.log(`Processing job [${job.name}] id=${job.id}`);

    switch (job.name) {
      case 'order_placed':
        return this.handleOrderPlaced(job.data as OrderPlacedPayload);

      case 'order_status_changed':
        return this.handleOrderStatusChanged(job.data as OrderStatusChangedPayload);

      case 'otp_send':
        return this.handleOtpSend(job.data as OtpSendPayload);

      case 'prescription_status':
        return this.handlePrescriptionStatus(job.data as PrescriptionStatusPayload);

      case 'low_stock_alert':
        return this.handleLowStockAlert(job.data as LowStockAlertPayload);

      case 'cart_reservation_cleanup':
        return this.handleCartReservationCleanup();

      // legacy job — keep working
      case 'send-sms':
        return this.smsService.send(job.data.phone, job.data.message);

      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  // ─── job handlers ───────────────────────────────────────────────────────────

  private async handleOrderPlaced(data: OrderPlacedPayload) {
    const customerLabel = data.customerName ? `${data.customerName}, ` : '';

    const smsText =
      `${customerLabel}আপনার অর্ডার ${data.orderNumber} গৃহীত হয়েছে। ` +
      `মোট: ৳${data.total.toFixed(2)}। ` +
      `Pharmaci শীঘ্রই আপনার সাথে যোগাযোগ করবে।`;

    await this.smsService.send(data.customerPhone, smsText);

    if (data.customerEmail) {
      const { subject, html } = orderPlacedEmail(data);
      await this.sendEmail(data.customerEmail, subject, html);
    }
  }

  private async handleOrderStatusChanged(data: OrderStatusChangedPayload) {
    const label = ORDER_STATUS_LABELS[data.status] ?? data.status;
    const customerLabel = data.customerName ? `${data.customerName}, ` : '';

    const smsText =
      `${customerLabel}আপনার অর্ডার ${data.orderNumber}-এর স্ট্যাটাস আপডেট হয়েছে: ${label}। ` +
      `বিস্তারিত জানতে Pharmaci অ্যাপ চেক করুন।`;

    await this.smsService.send(data.customerPhone, smsText);
  }

  private async handleOtpSend(data: OtpSendPayload) {
    await this.smsService.sendOtp(data.phone, data.otp);
  }

  private async handlePrescriptionStatus(data: PrescriptionStatusPayload) {
    const customerLabel = data.customerName ? `${data.customerName}, ` : '';

    let smsText: string;
    if (data.status === 'APPROVED') {
      smsText =
        `${customerLabel}আপনার প্রেসক্রিপশন অনুমোদিত হয়েছে। ` +
        `এখন আপনি আপনার অর্ডার সম্পন্ন করতে পারবেন। ধন্যবাদ Pharmaci ব্যবহারের জন্য।`;
    } else {
      const reason = data.note ? ` কারণ: ${data.note}।` : '';
      smsText =
        `${customerLabel}দুঃখিত, আপনার প্রেসক্রিপশন প্রত্যাখ্যাত হয়েছে।${reason} ` +
        `নতুন প্রেসক্রিপশন আপলোড করুন অথবা আমাদের সাথে যোগাযোগ করুন।`;
    }

    await this.smsService.send(data.customerPhone, smsText);
  }

  private async handleLowStockAlert(data: LowStockAlertPayload) {
    const { subject, html } = lowStockAlertEmail(data);
    await this.sendEmail(data.adminEmail, subject, html);
    this.logger.warn(
      `Low stock alert sent: ${data.productName} (${data.sku}) — ${data.stock} left`,
    );
  }

  private async handleCartReservationCleanup() {
    const now = new Date();

    const expiredItems = await this.prisma.cartItem.findMany({
      where: { reservedUntil: { not: null, lt: now } },
      select: { id: true, productId: true, quantity: true },
    });

    if (expiredItems.length === 0) {
      this.logger.debug('Cart cleanup: no expired reservations found');
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of expiredItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { reservedStock: { decrement: item.quantity } },
        });
      }
      await tx.cartItem.updateMany({
        where: { id: { in: expiredItems.map((i) => i.id) } },
        data: { reservedUntil: null },
      });
    });

    this.logger.log(
      `Cart cleanup: released ${expiredItems.length} expired reservation(s)`,
    );
  }

  // ─── helpers ────────────────────────────────────────────────────────────────

  private async sendEmail(to: string, subject: string, html: string) {
    const from = process.env.FROM_EMAIL || 'Pharmaci <no-reply@pharmaci.com.bd>';

    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      await this.resend.emails.send({ from, to, subject, html });
    } catch (err) {
      this.logger.error(`Email failed to ${to}: ${err.message}`);
      throw err;
    }
  }
}

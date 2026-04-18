import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { SslcommerzService } from './sslcommerz.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private ssl: SslcommerzService,
  ) {}

  async getPaymentByOrder(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  // ─── SSLCommerz initiation ────────────────────────────────────────────────────

  async initiateSSL(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, user: { select: { name: true, phone: true, email: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Access denied');
    if (order.paymentMethod !== PaymentMethod.SSLCOMMERZ) {
      throw new BadRequestException('Order payment method is not SSLCommerz');
    }
    if (order.payment?.status === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    const apiUrl = this.config.get('API_URL', 'http://localhost:4000');

    const { redirectURL } = await this.ssl.initSession({
      orderId,
      amount: Number(order.total),
      customerName: order.user?.name || 'Customer',
      customerPhone: order.user?.phone || '',
      customerEmail: order.user?.email || '',
      successUrl: `${apiUrl}/api/v1/payments/sslcommerz/callback?status=success`,
      failUrl: `${apiUrl}/api/v1/payments/sslcommerz/callback?status=failed`,
      cancelUrl: `${apiUrl}/api/v1/payments/sslcommerz/callback?status=cancelled`,
    });

    return { redirectURL, orderId };
  }

  // SSLCommerz POSTs back here for success/fail/cancel
  async handleSslCallback(
    body: Record<string, any>,
    queryStatus: string,
  ): Promise<{ redirectUrl: string }> {
    const appUrl = this.config.get('APP_URL', 'http://localhost:3000');
    const orderId: string = body.tran_id;

    if (!orderId) {
      return { redirectUrl: `${appUrl}/checkout?payment=failed` };
    }

    if (queryStatus !== 'success' || (body.status !== 'VALID' && body.status !== 'VALIDATED')) {
      await this.prisma.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.FAILED, gatewayResponse: body },
      });
      return { redirectUrl: `${appUrl}/checkout?payment=failed` };
    }

    const isValid = this.ssl.validateIpn(body);
    if (!isValid) {
      this.logger.warn(`SSLCommerz IPN hash mismatch for order ${orderId}`);
      await this.prisma.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.FAILED, gatewayResponse: body },
      });
      return { redirectUrl: `${appUrl}/checkout?payment=failed` };
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus.PAID,
          gatewayTxnId: body.val_id,
          gatewayResponse: body,
          paidAt: new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.orderStatusLog.create({
        data: {
          orderId,
          status: 'CONFIRMED',
          note: `Payment received via SSLCommerz. Val ID: ${body.val_id}`,
        },
      }),
    ]);

    return { redirectUrl: `${appUrl}/orders/${orderId}?payment=success` };
  }

  // ─── Legacy IPN webhook ───────────────────────────────────────────────────────

  async handleSslWebhook(payload: any) {
    const { val_id, status, tran_id } = payload;

    if (status !== 'VALID' && status !== 'VALIDATED') return { received: true };

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId: tran_id },
        data: { status: PaymentStatus.PAID, gatewayTxnId: val_id, gatewayResponse: payload, paidAt: new Date() },
      }),
      this.prisma.order.update({ where: { id: tran_id }, data: { status: 'CONFIRMED' } }),
      this.prisma.orderStatusLog.create({
        data: { orderId: tran_id, status: 'CONFIRMED', note: `SSLCommerz webhook. Val ID: ${val_id}` },
      }),
    ]);

    return { received: true };
  }
}

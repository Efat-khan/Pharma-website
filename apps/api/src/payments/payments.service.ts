import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPaymentByOrder(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async handleBkashWebhook(payload: any) {
    const { trxID, orderID, transactionStatus, amount } = payload;

    if (transactionStatus !== 'Completed') {
      await this.prisma.payment.update({
        where: { orderId: orderID },
        data: {
          status: PaymentStatus.FAILED,
          gatewayTxnId: trxID,
          gatewayResponse: payload,
        },
      });
      return { received: true };
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId: orderID },
        data: {
          status: PaymentStatus.PAID,
          gatewayTxnId: trxID,
          gatewayResponse: payload,
          paidAt: new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: orderID },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.orderStatusLog.create({
        data: {
          orderId: orderID,
          status: 'CONFIRMED',
          note: `Payment received via bKash. TrxID: ${trxID}`,
        },
      }),
    ]);

    return { received: true };
  }

  async handleSslWebhook(payload: any) {
    const { val_id, status, tran_id, amount } = payload;

    if (status !== 'VALID' && status !== 'VALIDATED') {
      return { received: true };
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId: tran_id },
        data: {
          status: PaymentStatus.PAID,
          gatewayTxnId: val_id,
          gatewayResponse: payload,
          paidAt: new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: tran_id },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.orderStatusLog.create({
        data: {
          orderId: tran_id,
          status: 'CONFIRMED',
          note: `Payment received via SSLCommerz. Val ID: ${val_id}`,
        },
      }),
    ]);

    return { received: true };
  }
}

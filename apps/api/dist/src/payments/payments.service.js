"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const sslcommerz_service_1 = require("./sslcommerz.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, config, ssl) {
        this.prisma = prisma;
        this.config = config;
        this.ssl = ssl;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async getPaymentByOrder(orderId) {
        const payment = await this.prisma.payment.findUnique({ where: { orderId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async initiateSSL(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true, user: { select: { name: true, phone: true, email: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.BadRequestException('Access denied');
        if (order.paymentMethod !== client_1.PaymentMethod.SSLCOMMERZ) {
            throw new common_1.BadRequestException('Order payment method is not SSLCommerz');
        }
        if (order.payment?.status === client_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Order is already paid');
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
    async handleSslCallback(body, queryStatus) {
        const appUrl = this.config.get('APP_URL', 'http://localhost:3000');
        const orderId = body.tran_id;
        if (!orderId) {
            return { redirectUrl: `${appUrl}/checkout?payment=failed` };
        }
        if (queryStatus !== 'success' || (body.status !== 'VALID' && body.status !== 'VALIDATED')) {
            await this.prisma.payment.update({
                where: { orderId },
                data: { status: client_1.PaymentStatus.FAILED, gatewayResponse: body },
            });
            return { redirectUrl: `${appUrl}/checkout?payment=failed` };
        }
        const isValid = this.ssl.validateIpn(body);
        if (!isValid) {
            this.logger.warn(`SSLCommerz IPN hash mismatch for order ${orderId}`);
            await this.prisma.payment.update({
                where: { orderId },
                data: { status: client_1.PaymentStatus.FAILED, gatewayResponse: body },
            });
            return { redirectUrl: `${appUrl}/checkout?payment=failed` };
        }
        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { orderId },
                data: {
                    status: client_1.PaymentStatus.PAID,
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
    async handleSslWebhook(payload) {
        const { val_id, status, tran_id } = payload;
        if (status !== 'VALID' && status !== 'VALIDATED')
            return { received: true };
        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { orderId: tran_id },
                data: { status: client_1.PaymentStatus.PAID, gatewayTxnId: val_id, gatewayResponse: payload, paidAt: new Date() },
            }),
            this.prisma.order.update({ where: { id: tran_id }, data: { status: 'CONFIRMED' } }),
            this.prisma.orderStatusLog.create({
                data: { orderId: tran_id, status: 'CONFIRMED', note: `SSLCommerz webhook. Val ID: ${val_id}` },
            }),
        ]);
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        sslcommerz_service_1.SslcommerzService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
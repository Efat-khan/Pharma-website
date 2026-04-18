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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPaymentByOrder(orderId) {
        const payment = await this.prisma.payment.findUnique({ where: { orderId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async handleBkashWebhook(payload) {
        const { trxID, orderID, transactionStatus, amount } = payload;
        if (transactionStatus !== 'Completed') {
            await this.prisma.payment.update({
                where: { orderId: orderID },
                data: {
                    status: client_1.PaymentStatus.FAILED,
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
                    status: client_1.PaymentStatus.PAID,
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
    async handleSslWebhook(payload) {
        const { val_id, status, tran_id, amount } = payload;
        if (status !== 'VALID' && status !== 'VALIDATED') {
            return { received: true };
        }
        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { orderId: tran_id },
                data: {
                    status: client_1.PaymentStatus.PAID,
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
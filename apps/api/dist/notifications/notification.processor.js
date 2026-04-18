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
var NotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
const sms_service_1 = require("./sms.service");
const prisma_service_1 = require("../prisma/prisma.service");
const email_templates_1 = require("./email.templates");
const ORDER_STATUS_LABELS = {
    PENDING: 'অপেক্ষমান',
    CONFIRMED: 'নিশ্চিত',
    PROCESSING: 'প্রক্রিয়াধীন',
    SHIPPED: 'পাঠানো হয়েছে',
    DELIVERED: 'ডেলিভারি সম্পন্ন',
    CANCELLED: 'বাতিল',
    REFUNDED: 'রিফান্ড হয়েছে',
};
let NotificationProcessor = NotificationProcessor_1 = class NotificationProcessor extends bullmq_1.WorkerHost {
    constructor(smsService, prisma) {
        super();
        this.smsService = smsService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationProcessor_1.name);
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async process(job) {
        this.logger.log(`Processing job [${job.name}] id=${job.id}`);
        switch (job.name) {
            case 'order_placed':
                return this.handleOrderPlaced(job.data);
            case 'order_status_changed':
                return this.handleOrderStatusChanged(job.data);
            case 'otp_send':
                return this.handleOtpSend(job.data);
            case 'prescription_status':
                return this.handlePrescriptionStatus(job.data);
            case 'low_stock_alert':
                return this.handleLowStockAlert(job.data);
            case 'cart_reservation_cleanup':
                return this.handleCartReservationCleanup();
            case 'send-sms':
                return this.smsService.send(job.data.phone, job.data.message);
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
    }
    async handleOrderPlaced(data) {
        const customerLabel = data.customerName ? `${data.customerName}, ` : '';
        const smsText = `${customerLabel}আপনার অর্ডার ${data.orderNumber} গৃহীত হয়েছে। ` +
            `মোট: ৳${data.total.toFixed(2)}। ` +
            `Pharmaci শীঘ্রই আপনার সাথে যোগাযোগ করবে।`;
        await this.smsService.send(data.customerPhone, smsText);
        if (data.customerEmail) {
            const { subject, html } = (0, email_templates_1.orderPlacedEmail)(data);
            await this.sendEmail(data.customerEmail, subject, html);
        }
    }
    async handleOrderStatusChanged(data) {
        const label = ORDER_STATUS_LABELS[data.status] ?? data.status;
        const customerLabel = data.customerName ? `${data.customerName}, ` : '';
        const smsText = `${customerLabel}আপনার অর্ডার ${data.orderNumber}-এর স্ট্যাটাস আপডেট হয়েছে: ${label}। ` +
            `বিস্তারিত জানতে Pharmaci অ্যাপ চেক করুন।`;
        await this.smsService.send(data.customerPhone, smsText);
    }
    async handleOtpSend(data) {
        await this.smsService.sendOtp(data.phone, data.otp);
    }
    async handlePrescriptionStatus(data) {
        const customerLabel = data.customerName ? `${data.customerName}, ` : '';
        let smsText;
        if (data.status === 'APPROVED') {
            smsText =
                `${customerLabel}আপনার প্রেসক্রিপশন অনুমোদিত হয়েছে। ` +
                    `এখন আপনি আপনার অর্ডার সম্পন্ন করতে পারবেন। ধন্যবাদ Pharmaci ব্যবহারের জন্য।`;
        }
        else {
            const reason = data.note ? ` কারণ: ${data.note}।` : '';
            smsText =
                `${customerLabel}দুঃখিত, আপনার প্রেসক্রিপশন প্রত্যাখ্যাত হয়েছে।${reason} ` +
                    `নতুন প্রেসক্রিপশন আপলোড করুন অথবা আমাদের সাথে যোগাযোগ করুন।`;
        }
        await this.smsService.send(data.customerPhone, smsText);
    }
    async handleLowStockAlert(data) {
        const { subject, html } = (0, email_templates_1.lowStockAlertEmail)(data);
        await this.sendEmail(data.adminEmail, subject, html);
        this.logger.warn(`Low stock alert sent: ${data.productName} (${data.sku}) — ${data.stock} left`);
    }
    async handleCartReservationCleanup() {
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
        this.logger.log(`Cart cleanup: released ${expiredItems.length} expired reservation(s)`);
    }
    async sendEmail(to, subject, html) {
        const from = process.env.FROM_EMAIL || 'Pharmaci <no-reply@pharmaci.com.bd>';
        if (process.env.NODE_ENV === 'development') {
            this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
            return;
        }
        try {
            await this.resend.emails.send({ from, to, subject, html });
        }
        catch (err) {
            this.logger.error(`Email failed to ${to}: ${err.message}`);
            throw err;
        }
    }
};
exports.NotificationProcessor = NotificationProcessor;
exports.NotificationProcessor = NotificationProcessor = NotificationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('notifications'),
    __metadata("design:paramtypes", [sms_service_1.SmsService,
        prisma_service_1.PrismaService])
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map
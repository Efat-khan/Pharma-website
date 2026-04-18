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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let NotificationsService = class NotificationsService {
    constructor(queue) {
        this.queue = queue;
    }
    async notifyOrderPlaced(payload) {
        await this.queue.add('order_placed', payload, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
        });
    }
    async notifyOrderStatusChanged(payload) {
        await this.queue.add('order_status_changed', payload, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
        });
    }
    async notifyOtpSend(payload) {
        await this.queue.add('otp_send', payload, {
            attempts: 3,
            backoff: { type: 'fixed', delay: 2000 },
            priority: 1,
        });
    }
    async notifyPrescriptionStatus(payload) {
        await this.queue.add('prescription_status', payload, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
        });
    }
    async notifyLowStock(payload) {
        await this.queue.add('low_stock_alert', payload, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 10000 },
            jobId: `low-stock-${payload.sku}`,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
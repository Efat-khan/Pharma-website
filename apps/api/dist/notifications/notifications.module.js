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
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const sms_service_1 = require("./sms.service");
const notification_processor_1 = require("./notification.processor");
const notifications_service_1 = require("./notifications.service");
const prisma_module_1 = require("../prisma/prisma.module");
let NotificationsModule = class NotificationsModule {
    constructor(queue) {
        this.queue = queue;
    }
    async onModuleInit() {
        await this.queue.removeRepeatable('cart_reservation_cleanup', {
            pattern: '*/5 * * * *',
        });
        await this.queue.add('cart_reservation_cleanup', {}, {
            repeat: { pattern: '*/5 * * * *' },
            jobId: 'cart-cleanup-cron',
            removeOnComplete: 10,
            removeOnFail: 5,
        });
    }
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: 'notifications' }),
            prisma_module_1.PrismaModule,
        ],
        providers: [sms_service_1.SmsService, notification_processor_1.NotificationProcessor, notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService, sms_service_1.SmsService],
    }),
    __param(0, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map
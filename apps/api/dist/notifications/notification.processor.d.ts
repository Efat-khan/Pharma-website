import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SmsService } from './sms.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationProcessor extends WorkerHost {
    private readonly smsService;
    private readonly prisma;
    private readonly logger;
    private readonly resend;
    constructor(smsService: SmsService, prisma: PrismaService);
    process(job: Job): Promise<boolean | void>;
    private handleOrderPlaced;
    private handleOrderStatusChanged;
    private handleOtpSend;
    private handlePrescriptionStatus;
    private handleLowStockAlert;
    private handleCartReservationCleanup;
    private sendEmail;
}

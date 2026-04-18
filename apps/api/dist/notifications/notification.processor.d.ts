import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SmsService } from './sms.service';
export declare class NotificationProcessor extends WorkerHost {
    private smsService;
    private readonly logger;
    constructor(smsService: SmsService);
    process(job: Job): Promise<void>;
}

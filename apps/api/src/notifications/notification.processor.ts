import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SmsService } from './sms.service';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private smsService: SmsService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'send-sms':
        await this.smsService.send(job.data.phone, job.data.message);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }
}

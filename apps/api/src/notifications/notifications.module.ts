import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SmsService } from './sms.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notifications' }),
    PrismaModule,
  ],
  providers: [SmsService, NotificationProcessor, NotificationsService],
  exports: [NotificationsService, SmsService],
})
export class NotificationsModule implements OnModuleInit {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  async onModuleInit() {
    // Remove stale repeatable job from previous run, then re-register cleanly.
    await this.queue.removeRepeatable('cart_reservation_cleanup', {
      pattern: '*/5 * * * *',
    });

    await this.queue.add(
      'cart_reservation_cleanup',
      {},
      {
        repeat: { pattern: '*/5 * * * *' },
        jobId: 'cart-cleanup-cron',
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );
  }
}

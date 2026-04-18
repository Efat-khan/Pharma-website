import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmsService } from './sms.service';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  providers: [SmsService, NotificationProcessor],
  exports: [SmsService],
})
export class NotificationsModule {}

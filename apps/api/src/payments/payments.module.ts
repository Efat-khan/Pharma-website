import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SslcommerzService } from './sslcommerz.service';

@Module({
  imports: [ConfigModule],
  providers: [SslcommerzService, PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}

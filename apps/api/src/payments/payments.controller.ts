import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('order/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrder(orderId);
  }

  @Post('webhooks/bkash')
  bkashWebhook(@Body() payload: any) {
    return this.paymentsService.handleBkashWebhook(payload);
  }

  @Post('webhooks/sslcommerz')
  sslWebhook(@Body() payload: any) {
    return this.paymentsService.handleSslWebhook(payload);
  }
}

import {
  Controller, Post, Get, Body, Param, Query,
  UseGuards, Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
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

  // ─── SSLCommerz ─────────────────────────────────────────────────────────────

  @Post('sslcommerz/initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create SSLCommerz payment session for an order' })
  initiateSSL(
    @CurrentUser() user: any,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentsService.initiateSSL(user.id, orderId);
  }

  @Post('sslcommerz/callback')
  @ApiOperation({ summary: 'SSLCommerz POSTs here for success/fail/cancel' })
  async sslCallback(
    @Body() body: Record<string, any>,
    @Query('status') queryStatus: string,
    @Res() res: Response,
  ) {
    const { redirectUrl } = await this.paymentsService.handleSslCallback(body, queryStatus);
    return res.redirect(redirectUrl);
  }

  @Post('webhooks/sslcommerz')
  @ApiOperation({ summary: 'SSLCommerz IPN webhook' })
  sslWebhook(@Body() payload: any) {
    return this.paymentsService.handleSslWebhook(payload);
  }
}

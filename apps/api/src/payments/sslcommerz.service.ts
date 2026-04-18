import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class SslcommerzService {
  private readonly logger = new Logger(SslcommerzService.name);
  private readonly storeId: string;
  private readonly storePass: string;
  private readonly isLive: boolean;

  constructor(private config: ConfigService) {
    this.storeId = this.config.getOrThrow('SSLCOMMERZ_STORE_ID');
    this.storePass = this.config.getOrThrow('SSLCOMMERZ_STORE_PASS');
    this.isLive = this.config.get('SSLCOMMERZ_IS_LIVE') === 'true';
  }

  private get baseUrl(): string {
    return this.isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  async initSession(params: {
    orderId: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
  }): Promise<{ redirectURL: string; sessionKey: string }> {
    const payload = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePass,
      total_amount: params.amount.toFixed(2),
      currency: 'BDT',
      tran_id: params.orderId,
      success_url: params.successUrl,
      fail_url: params.failUrl,
      cancel_url: params.cancelUrl,
      cus_name: params.customerName,
      cus_email: params.customerEmail || 'customer@pharmaci.com.bd',
      cus_phone: params.customerPhone,
      cus_add1: 'N/A',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      product_name: 'Pharmacy Order',
      product_category: 'Medicine',
      product_profile: 'general',
    });

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/gwprocess/v4/api.php`,
        payload.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      if (data.status !== 'SUCCESS') {
        this.logger.error('SSLCommerz init failed', data);
        throw new Error(`SSLCommerz init error: ${data.failedreason}`);
      }

      return { redirectURL: data.GatewayPageURL, sessionKey: data.sessionkey };
    } catch (err: any) {
      this.logger.error('SSLCommerz initSession failed', err?.response?.data || err.message);
      throw new InternalServerErrorException('Could not initiate SSLCommerz payment');
    }
  }

  validateIpn(payload: Record<string, any>): boolean {
    const { verify_sign, verify_key } = payload;
    if (!verify_sign || !verify_key) return false;

    const keys = (verify_key as string).split(',');
    const parts: string[] = keys.map((k) => `${k}=${payload[k] ?? ''}`);
    parts.push(`store_passwd=${md5(this.storePass)}`);
    parts.sort();

    return md5(parts.join('&')) === verify_sign;
  }
}

function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const message = `Your Pharmaci verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
    return this.send(phone, message);
  }

  async send(phone: string, message: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`[DEV SMS] To: ${phone} | Message: ${message}`);
      return true;
    }

    try {
      const response = await axios.post('https://api.greenweb.com.bd/api.php', null, {
        params: {
          token: process.env.GREEN_WEB_BD_API_KEY,
          to: phone,
          message,
          from: process.env.GREEN_WEB_BD_SENDER_ID,
        },
      });
      return response.status === 200;
    } catch (error) {
      this.logger.error(`SMS failed to ${phone}: ${error.message}`);
      return false;
    }
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let SmsService = SmsService_1 = class SmsService {
    constructor() {
        this.logger = new common_1.Logger(SmsService_1.name);
    }
    async sendOtp(phone, otp) {
        const message = `Your Pharmaci verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
        return this.send(phone, message);
    }
    async send(phone, message) {
        if (process.env.NODE_ENV === 'development') {
            this.logger.log(`[DEV SMS] To: ${phone} | Message: ${message}`);
            return true;
        }
        try {
            const response = await axios_1.default.post('https://api.greenweb.com.bd/api.php', null, {
                params: {
                    token: process.env.GREEN_WEB_BD_API_KEY,
                    to: phone,
                    message,
                    from: process.env.GREEN_WEB_BD_SENDER_ID,
                },
            });
            return response.status === 200;
        }
        catch (error) {
            this.logger.error(`SMS failed to ${phone}: ${error.message}`);
            return false;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)()
], SmsService);
//# sourceMappingURL=sms.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SslcommerzService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SslcommerzService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const crypto = require("crypto");
let SslcommerzService = SslcommerzService_1 = class SslcommerzService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SslcommerzService_1.name);
        this.storeId = this.config.getOrThrow('SSLCOMMERZ_STORE_ID');
        this.storePass = this.config.getOrThrow('SSLCOMMERZ_STORE_PASS');
        this.isLive = this.config.get('SSLCOMMERZ_IS_LIVE') === 'true';
    }
    get baseUrl() {
        return this.isLive
            ? 'https://securepay.sslcommerz.com'
            : 'https://sandbox.sslcommerz.com';
    }
    async initSession(params) {
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
            const { data } = await axios_1.default.post(`${this.baseUrl}/gwprocess/v4/api.php`, payload.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            if (data.status !== 'SUCCESS') {
                this.logger.error('SSLCommerz init failed', data);
                throw new Error(`SSLCommerz init error: ${data.failedreason}`);
            }
            return { redirectURL: data.GatewayPageURL, sessionKey: data.sessionkey };
        }
        catch (err) {
            this.logger.error('SSLCommerz initSession failed', err?.response?.data || err.message);
            throw new common_1.InternalServerErrorException('Could not initiate SSLCommerz payment');
        }
    }
    validateIpn(payload) {
        const { verify_sign, verify_key } = payload;
        if (!verify_sign || !verify_key)
            return false;
        const keys = verify_key.split(',');
        const parts = keys.map((k) => `${k}=${payload[k] ?? ''}`);
        parts.push(`store_passwd=${md5(this.storePass)}`);
        parts.sort();
        return md5(parts.join('&')) === verify_sign;
    }
};
exports.SslcommerzService = SslcommerzService;
exports.SslcommerzService = SslcommerzService = SslcommerzService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SslcommerzService);
function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}
//# sourceMappingURL=sslcommerz.service.js.map
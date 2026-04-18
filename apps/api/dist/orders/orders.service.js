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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    constructor(prisma, cartService) {
        this.prisma = prisma;
        this.cartService = cartService;
    }
    async createOrder(userId, dto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const address = await this.prisma.address.findFirst({
            where: { id: dto.addressId, userId },
        });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        const prescriptionRequired = cart.items.some((item) => item.product.requiresPrescription);
        if (prescriptionRequired && (!dto.prescriptionIds || dto.prescriptionIds.length === 0)) {
            throw new common_1.BadRequestException('This order contains prescription-required medicines. Please upload a prescription.');
        }
        let discount = 0;
        if (dto.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: dto.couponCode.toUpperCase(), isActive: true },
            });
            if (coupon) {
                const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.sellingPrice) * item.quantity, 0);
                if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                    throw new common_1.BadRequestException('Coupon usage limit reached');
                }
                if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                    throw new common_1.BadRequestException('Coupon has expired');
                }
                if (subtotal < Number(coupon.minOrderValue)) {
                    throw new common_1.BadRequestException(`Minimum order value for this coupon is ৳${coupon.minOrderValue}`);
                }
                discount =
                    coupon.type === 'FLAT'
                        ? Number(coupon.value)
                        : (subtotal * Number(coupon.value)) / 100;
            }
        }
        const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.sellingPrice) * item.quantity, 0);
        const deliveryCharge = subtotal >= 500 ? 0 : 60;
        const total = subtotal - discount + deliveryCharge;
        const orderNumber = await this.generateOrderNumber();
        const addressSnapshot = {
            label: address.label,
            recipientName: address.recipientName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            district: address.district,
            thana: address.thana,
            postCode: address.postCode,
        };
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    subtotal,
                    deliveryCharge,
                    discount,
                    total,
                    addressSnapshot,
                    paymentMethod: dto.paymentMethod,
                    notes: dto.notes,
                    couponCode: dto.couponCode?.toUpperCase(),
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            productName: item.product.name,
                            productSku: item.product.sku,
                            quantity: item.quantity,
                            mrp: item.product.mrp,
                            sellingPrice: item.product.sellingPrice,
                            total: Number(item.product.sellingPrice) * item.quantity,
                        })),
                    },
                    statusLogs: {
                        create: { status: client_1.OrderStatus.PENDING, note: 'Order placed' },
                    },
                    payment: {
                        create: {
                            method: dto.paymentMethod,
                            amount: total,
                            status: dto.paymentMethod === client_1.PaymentMethod.COD
                                ? client_1.PaymentStatus.PENDING
                                : client_1.PaymentStatus.PENDING,
                        },
                    },
                },
                include: { items: true, payment: true },
            });
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        reservedStock: { decrement: item.quantity },
                    },
                });
            }
            if (dto.couponCode) {
                await tx.coupon.update({
                    where: { code: dto.couponCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } },
                });
            }
            if (dto.prescriptionIds?.length) {
                await tx.prescription.updateMany({
                    where: { id: { in: dto.prescriptionIds }, userId },
                    data: { orderId: newOrder.id },
                });
            }
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            return newOrder;
        });
        return order;
    }
    async getUserOrders(userId, page = 1, limit = 10) {
        const [total, orders] = await this.prisma.$transaction([
            this.prisma.order.count({ where: { userId } }),
            this.prisma.order.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
                        },
                    },
                    payment: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            data: orders,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOrderById(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
                    },
                },
                statusLogs: { orderBy: { createdAt: 'asc' } },
                payment: true,
                prescriptions: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return order;
    }
    async cancelOrder(userId, orderId, reason) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Order cannot be cancelled at this stage');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: client_1.OrderStatus.CANCELLED,
                    cancelReason: reason,
                },
            });
            await tx.orderStatusLog.create({
                data: {
                    orderId,
                    status: client_1.OrderStatus.CANCELLED,
                    note: reason || 'Cancelled by customer',
                    createdBy: userId,
                },
            });
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        });
        return { message: 'Order cancelled successfully' };
    }
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const count = await this.prisma.order.count({
            where: { createdAt: { gte: new Date(`${year}-01-01`) } },
        });
        return `ARG-${year}-${String(count + 1).padStart(6, '0')}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
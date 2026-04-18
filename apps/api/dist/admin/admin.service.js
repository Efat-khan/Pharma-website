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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalOrders, todayOrders, pendingOrders, totalRevenue, totalProducts, totalUsers, pendingPrescriptions,] = await this.prisma.$transaction([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { createdAt: { gte: today } } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.PENDING } }),
            this.prisma.payment.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
            }),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { deletedAt: null } }),
            this.prisma.prescription.count({ where: { status: client_1.PrescriptionStatus.PENDING } }),
        ]);
        return {
            totalOrders,
            todayOrders,
            pendingOrders,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalProducts,
            totalUsers,
            pendingPrescriptions,
        };
    }
    async getAllOrders(page = 1, limit = 20, status) {
        const where = status ? { status } : {};
        const [total, orders] = await this.prisma.$transaction([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, phone: true } },
                    items: true,
                    payment: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async updateOrderStatus(orderId, status, note, adminId) {
        return this.prisma.$transaction([
            this.prisma.order.update({ where: { id: orderId }, data: { status } }),
            this.prisma.orderStatusLog.create({
                data: { orderId, status, note, createdBy: adminId },
            }),
        ]);
    }
    async createProduct(data) {
        return this.prisma.product.create({ data });
    }
    async updateProduct(id, data) {
        return this.prisma.product.update({ where: { id }, data });
    }
    async deleteProduct(id) {
        return this.prisma.product.update({ where: { id }, data: { isActive: false } });
    }
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async createBrand(data) {
        return this.prisma.brand.create({ data });
    }
    async getPendingPrescriptions() {
        return this.prisma.prescription.findMany({
            where: { status: client_1.PrescriptionStatus.PENDING },
            include: { user: { select: { id: true, name: true, phone: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async reviewPrescription(id, status, note) {
        return this.prisma.prescription.update({
            where: { id },
            data: { status, note },
        });
    }
    async createBanner(data) {
        return this.prisma.banner.create({ data });
    }
    async getBanners() {
        return this.prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getAllUsers(page = 1, limit = 20) {
        const [total, users] = await this.prisma.$transaction([
            this.prisma.user.count({ where: { deletedAt: null } }),
            this.prisma.user.findMany({
                where: { deletedAt: null },
                select: {
                    id: true, phone: true, name: true, email: true,
                    role: true, isVerified: true, isActive: true, createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map
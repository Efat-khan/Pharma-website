import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PrescriptionStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      pendingPrescriptions,
    ] = await this.prisma.$transaction([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.prescription.count({ where: { status: PrescriptionStatus.PENDING } }),
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

  async getAllOrders(page = 1, limit = 20, status?: OrderStatus) {
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

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string, adminId?: string) {
    return this.prisma.$transaction([
      this.prisma.order.update({ where: { id: orderId }, data: { status } }),
      this.prisma.orderStatusLog.create({
        data: { orderId, status, note, createdBy: adminId },
      }),
    ]);
  }

  async createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async createCategory(data: any) {
    return this.prisma.category.create({ data });
  }

  async createBrand(data: any) {
    return this.prisma.brand.create({ data });
  }

  async getPendingPrescriptions() {
    return this.prisma.prescription.findMany({
      where: { status: PrescriptionStatus.PENDING },
      include: { user: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async reviewPrescription(id: string, status: PrescriptionStatus, note?: string) {
    return this.prisma.prescription.update({
      where: { id },
      data: { status, note },
    });
  }

  async createBanner(data: any) {
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
}

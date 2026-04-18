import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

const RESERVATION_MINUTES = 15;

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    await this.releaseExpiredReservations();

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      return this.prisma.cart.create({
        where: { userId },
        data: { userId },
        include: { items: true },
      } as any);
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.sellingPrice) * item.quantity,
      0,
    );

    return { ...cart, subtotal };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const availableStock = product.stock - product.reservedStock;

    const cart = await this.ensureCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const currentQty = existingItem?.quantity || 0;
    const newTotal = currentQty + quantity;

    if (newTotal > availableStock) {
      throw new BadRequestException(
        `Only ${availableStock} units available. You already have ${currentQty} in cart.`,
      );
    }

    const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60_000);

    if (existingItem) {
      await this.prisma.$transaction([
        this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newTotal, reservedUntil },
        }),
        this.prisma.product.update({
          where: { id: productId },
          data: { reservedStock: { increment: quantity } },
        }),
      ]);
    } else {
      await this.prisma.$transaction([
        this.prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity, reservedUntil },
        }),
        this.prisma.product.update({
          where: { id: productId },
          data: { reservedStock: { increment: quantity } },
        }),
      ]);
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = await this.ensureCart(userId);

    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    if (dto.quantity === 0) return this.removeItem(userId, productId);

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    const availableStock = product.stock - product.reservedStock + item.quantity;

    if (dto.quantity > availableStock) {
      throw new BadRequestException(`Only ${availableStock} units available`);
    }

    const diff = dto.quantity - item.quantity;
    const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60_000);

    await this.prisma.$transaction([
      this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: dto.quantity, reservedUntil },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { reservedStock: { increment: diff } },
      }),
    ]);

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.ensureCart(userId);

    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    await this.prisma.$transaction([
      this.prisma.cartItem.delete({ where: { id: item.id } }),
      this.prisma.product.update({
        where: { id: productId },
        data: { reservedStock: { decrement: item.quantity } },
      }),
    ]);

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart) return;

    await this.prisma.$transaction([
      ...cart.items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { reservedStock: { decrement: item.quantity } },
        }),
      ),
      this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ]);
  }

  private async ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  private async releaseExpiredReservations() {
    const expired = await this.prisma.cartItem.findMany({
      where: { reservedUntil: { lt: new Date() } },
    });

    if (expired.length === 0) return;

    await this.prisma.$transaction([
      ...expired.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { reservedStock: { decrement: item.quantity } },
        }),
      ),
      this.prisma.cartItem.updateMany({
        where: { reservedUntil: { lt: new Date() } },
        data: { reservedUntil: null },
      }),
    ]);
  }
}

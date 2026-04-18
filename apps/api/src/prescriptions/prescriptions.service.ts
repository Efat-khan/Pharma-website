import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async upload(userId: string, imageUrl: string, publicId: string) {
    return this.prisma.prescription.create({
      data: { userId, imageUrl, publicId },
    });
  }

  async getUserPrescriptions(userId: string) {
    return this.prisma.prescription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPrescription(userId: string, id: string) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id } });
    if (!prescription || prescription.userId !== userId) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }
}

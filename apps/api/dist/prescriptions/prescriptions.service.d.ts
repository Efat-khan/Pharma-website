import { PrismaService } from '../prisma/prisma.service';
export declare class PrescriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    upload(userId: string, imageUrl: string, publicId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    }>;
    getUserPrescriptions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    }[]>;
    getPrescription(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    }>;
}

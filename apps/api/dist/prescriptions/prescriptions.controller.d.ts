import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    upload(userId: string, file: Express.Multer.File): Promise<{
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
    getAll(userId: string): Promise<{
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
    getOne(userId: string, id: string): Promise<{
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

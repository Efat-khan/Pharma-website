import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string;
        avatar: string;
    }>;
    getAddresses(userId: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        recipientName: string;
        line1: string;
        line2: string | null;
        district: string;
        thana: string;
        postCode: string | null;
        isDefault: boolean;
        userId: string;
    }[]>;
    addAddress(userId: string, data: {
        label?: string;
        recipientName: string;
        phone: string;
        line1: string;
        line2?: string;
        district: string;
        thana: string;
        postCode?: string;
        isDefault?: boolean;
    }): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        recipientName: string;
        line1: string;
        line2: string | null;
        district: string;
        thana: string;
        postCode: string | null;
        isDefault: boolean;
        userId: string;
    }>;
    deleteAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
    softDelete(userId: string): Promise<{
        message: string;
    }>;
}

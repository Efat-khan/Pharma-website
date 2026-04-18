import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        name: string;
        phone: string;
        id: string;
        email: string;
        avatar: string;
    }>;
    getAddresses(userId: string): Promise<{
        phone: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        label: string;
        recipientName: string;
        line1: string;
        line2: string | null;
        district: string;
        thana: string;
        postCode: string | null;
        isDefault: boolean;
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
        phone: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        label: string;
        recipientName: string;
        line1: string;
        line2: string | null;
        district: string;
        thana: string;
        postCode: string | null;
        isDefault: boolean;
    }>;
    deleteAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
    softDelete(userId: string): Promise<{
        message: string;
    }>;
}

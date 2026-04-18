import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    updateProfile(userId: string, body: {
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
    addAddress(userId: string, body: any): Promise<{
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
    deleteAddress(userId: string, id: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}

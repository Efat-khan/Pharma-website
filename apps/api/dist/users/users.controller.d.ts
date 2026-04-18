import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    updateProfile(userId: string, body: {
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
    addAddress(userId: string, body: any): Promise<{
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
    deleteAddress(userId: string, id: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}

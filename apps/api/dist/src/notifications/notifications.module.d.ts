import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
export declare class NotificationsModule implements OnModuleInit {
    private readonly queue;
    constructor(queue: Queue);
    onModuleInit(): Promise<void>;
}

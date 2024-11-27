import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async paginationHelper(service, serviceOption) {
        const [count, data] = await this.$transaction([
            service.count({ where: serviceOption?.where }),
            service.findMany(serviceOption),
        ]);

        return { count, data };
    }
}

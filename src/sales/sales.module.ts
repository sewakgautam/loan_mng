import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [SalesController],
    providers: [SalesService, PrismaService],
    exports: [SalesService],
})
export class SalesModule {}

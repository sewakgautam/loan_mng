import { Module } from '@nestjs/common';
import { DhittoService } from './dhitto.service';
import { DhittoController } from './dhitto.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [DhittoController],
    providers: [DhittoService, PrismaService],
    exports: [DhittoService],
})
export class DhittoModule {}

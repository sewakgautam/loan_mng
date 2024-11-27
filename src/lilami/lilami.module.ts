import { Module } from '@nestjs/common';
import { LilamiService } from './lilami.service';
import { LilamiController } from './lilami.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [LilamiController],
    providers: [LilamiService, PrismaService],
})
export class LilamiModule {}

import { Module } from '@nestjs/common';
import { BankRecordService } from './bank-record.service';
import { BankRecordController } from './bank-record.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [BankRecordController],
    providers: [BankRecordService, PrismaService],
})
export class BankRecordModule {}

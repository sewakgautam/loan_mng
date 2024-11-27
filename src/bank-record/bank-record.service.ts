import { Injectable } from '@nestjs/common';
import {
    CreateBankDto,
    CreateBankRecordDto,
} from './dto/create-bank-record.dto';
import { PrismaService } from 'src/prisma.service';
import {
    UpdateBankDto,
    UpdateBankRecordDto,
} from './dto/update-bank-record.dto';
import { defaultPaginationOption } from 'src/utils/default';
import { changePageCapToSkip } from 'src/utils/common';
import { Prisma } from '@prisma/client';
import { dayjs } from 'src/utils/date';

@Injectable()
export class BankRecordService {
    constructor(private readonly prisma: PrismaService) {}

    async createBank(createBank: CreateBankDto, userId: string) {
        return await this.prisma.bank.create({
            data: {
                userId,
                ...createBank,
            },
        });
    }

    async createBankRecord(createBankRecord: CreateBankRecordDto) {
        return await this.prisma.bankRecord.create({
            data: {
                ...createBankRecord,
                createdDate: dayjs
                    .utc(createBankRecord.createdDate)
                    .startOf('d')
                    .toISOString(),
            },
        });
    }
    async getAllBanks(userId: string) {
        return await this.prisma.bank.findMany({
            where: {
                userId,
            },
        });
    }

    async getAllRecords(
        param: {
            page?: number;
            capacity?: number;
            bankId?: string;
            date?: string;
            search?: string;
        },
        userId: string,
    ) {
        const { skip, take } = changePageCapToSkip(
            defaultPaginationOption(param),
        );

        const where: Prisma.BankRecordWhereInput = {
            Bank: {
                userId,
            },
        };
        if (param.bankId) {
            where.bankId = param.bankId;
        }

        if (param.date) {
            where.createdDate = {
                gte: param.date,
                lte: dayjs.utc(param.date).endOf('d').toISOString(),
            };
        }

        if (param.search) {
            where.OR = [
                {
                    claimCode: {
                        contains: param.search,
                        mode: 'insensitive',
                    },
                },
                {
                    productName: {
                        contains: param.search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        return await this.prisma.paginationHelper(this.prisma.bankRecord, {
            skip,
            take,
            orderBy: {
                status: 'asc',
            },
            where,
            include: {
                Bank: true,
            },
        } satisfies Prisma.BankRecordFindManyArgs);
    }

    async update(
        bankId: string,
        updateBankRecordDto: UpdateBankRecordDto,
        recordId: string,
        userId: string,
    ) {
        return await this.prisma.bankRecord.update({
            where: {
                id: recordId,
                bankId,
                Bank: {
                    userId,
                },
            },
            data: updateBankRecordDto,
        });
    }

    async deleteBankRecord(bankId: string, userId: string, recordId: string) {
        return await this.prisma.bankRecord.delete({
            where: {
                id: recordId,
                bankId,
                Bank: {
                    userId,
                },
            },
        });
    }

    async deleteBank(bankId: string, userId: string) {
        return await this.prisma.bank.delete({
            where: {
                id: bankId,
                userId,
            },
        });
    }
}

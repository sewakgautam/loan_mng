import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateBankDto
    implements Omit<Prisma.BankCreateInput, 'User' | 'userid' | 'bankRecords'>
{
    @IsString()
    @ApiProperty({ type: String })
    name: string;

    @IsString()
    @ApiProperty({ type: String })
    address: string;
}

export class CreateBankRecordDto
    implements Omit<Prisma.BankRecordCreateInput, 'Bank'>
{
    @IsString()
    @ApiProperty({ type: String })
    bsDate: string;

    @ApiProperty({ type: String })
    @IsString()
    productName: string;

    @ApiProperty({ type: Date })
    @IsDateString()
    createdDate: string | Date;

    @ApiProperty({ enum: $Enums.BankRecordStatus })
    @IsEnum($Enums.BankRecordStatus)
    status: $Enums.BankRecordStatus;

    @IsUUID()
    @ApiProperty({ type: String })
    bankId: string;

    @ApiProperty({ type: String })
    @IsString()
    claimCode: string;
}

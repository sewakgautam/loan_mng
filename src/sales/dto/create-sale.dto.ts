import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsNumber,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

export class CreateSaleGood
    implements Omit<Prisma.SaleGoodCreateInput, 'SaleUser'>
{
    @IsString()
    @ApiProperty({ type: String })
    description: string;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: Number })
    rate: number;

    @ApiProperty({ type: Number })
    @IsNumber()
    makingCharge: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: Number })
    weight: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: Number })
    mfgCost: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: Number })
    total: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: Number })
    amount: number;
}

export class CreateSaleDto implements Omit<Prisma.SaleUserCreateInput, 'User'> {
    @IsString()
    bsDate: string;

    @IsString()
    @ApiProperty({ type: String })
    address: string;

    @IsString()
    @ApiProperty({ type: String })
    contactNumber: string;

    @IsString()
    @ApiProperty({ type: String })
    fullName: string;

    @IsString()
    @ApiProperty({ type: String })
    panNo: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleGood)
    @ApiProperty({ type: [CreateSaleGood] })
    goods: CreateSaleGood[];

    @ApiProperty({ type: Date })
    @IsDateString()
    date?: string | Date;
}

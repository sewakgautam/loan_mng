import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateLilamiDto
    implements Omit<Prisma.LilamiCreateInput, 'dhitto' | 'id'>
{
    @ApiProperty({ type: Date })
    @IsString()
    bsDate: string;

    @ApiProperty({ type: Number })
    @IsNumber()
    rate: number;

    @ApiProperty({ type: String })
    @IsString()
    image: string;

    @ApiProperty({ type: String })
    @IsString()
    remarks: string;

    @ApiProperty({ type: Date })
    @IsDateString()
    date: Date;

    @ApiProperty({ type: String })
    @IsUUID()
    dhittoId: string;
}

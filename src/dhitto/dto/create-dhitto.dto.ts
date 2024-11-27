import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDhittoDto
    implements Omit<Prisma.DhittoCreateInput, 'accumulatedInterest'>
{
    @IsNumber()
    @ApiProperty({
        required: true,
        type: Number,
    })
    principalAmount: number;

    @IsString()
    bsDate: string;

    @IsNumber()
    @ApiProperty({
        required: true,
        type: Number,
    })
    interestPercentage: number;

    @IsDateString()
    @IsOptional()
    @ApiProperty({
        required: false,
        type: Date,
    })
    date?: string | Date;

    @ApiProperty({
        example: 'Car Loan',
        description: 'Product Name',
        required: true,
        type: String,
    })
    @IsString()
    productName: string;
}

export class CreateCustomerDto
    implements Omit<Prisma.CustomerCreateInput, 'User' | 'userId'>
{
    @ApiProperty({
        example: 'image hash',
        description: 'Image',
        required: true,
        type: String,
    })
    @IsString()
    image: string;

    @ApiProperty({
        example: '1234567890',
        description: 'Phone number',
        required: true,
        type: String,
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        example: '1234567890',
        description: 'Phone number',
        required: true,
        type: String,
    })
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full Name',
        required: true,
        type: String,
    })
    @IsString()
    fullName: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    @IsString()
    address: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto implements Omit<Prisma.UserCreateInput, 'id'> {
    @ApiProperty({ type: String })
    @IsString()
    address: string;

    @ApiProperty({ type: String })
    @IsString()
    pan: string;

    @ApiProperty({ type: String })
    @IsString()
    logo: string;

    @ApiProperty({ type: String })
    @IsString()
    @Transform((param) => param.value.toLowerCase())
    username: string;

    @ApiProperty({ type: String })
    @IsString()
    phoneNumber: string;

    @ApiProperty({ type: String })
    @IsString()
    fullName: string;

    @ApiProperty({ type: String })
    @IsString()
    password: string;

    @ApiProperty({ type: String, example: 'noreply.test@gmail.com' })
    @IsEmail()
    @Transform((param) => param.value.toLowerCase())
    email: string;

    role?: UserRole;
}

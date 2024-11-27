import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto
    implements Pick<Prisma.UserCreateInput, 'username' | 'password'>
{
    @ApiProperty({
        type: String,
    })
    @IsDefined()
    @IsString()
    username: string;

    @ApiProperty({
        type: String,
    })
    @IsDefined()
    @IsString()
    password: string;
}

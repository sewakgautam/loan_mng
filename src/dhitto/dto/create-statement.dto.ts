import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStatementDto {
    @ApiProperty({
        example: 1000,
        type: Number,
    })
    @IsNumber()
    amount: number;

    @IsString()
    bsDate: string;
}

import { PartialType } from '@nestjs/swagger';
import { CreateBankDto, CreateBankRecordDto } from './create-bank-record.dto';

export class UpdateBankDto extends PartialType(CreateBankDto) {}
export class UpdateBankRecordDto extends PartialType(CreateBankRecordDto) {}

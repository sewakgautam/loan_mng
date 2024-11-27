import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto, CreateDhittoDto } from './create-dhitto.dto';

export class UpdateDhittoDto extends PartialType(CreateDhittoDto) {}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

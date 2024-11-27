import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Patch,
    Delete,
    Res,
    ParseUUIDPipe,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Response } from 'express';
import { GetUser } from 'src/commons/decorators/getuser.decorator';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Get()
    findAll(@GetUser('sub') userId: string) {
        // todo: pagination
        return this.salesService.findAll(userId);
    }

    @Get(':id/bill')
    async generateBill(
        @Res() resp: Response,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        const htmlString = await this.salesService.generateSalesBillHTML(id);
        resp.status(200)
            .header('Content-Type', 'application/pdf')
            .send(htmlString);
    }

    @Post()
    create(
        @Body() createSaleDto: CreateSaleDto,
        @GetUser('sub') userId: string,
    ) {
        return this.salesService.createSale(createSaleDto, userId);
    }

    @Patch(':id')
    update(
        @Body() updateSaleDto: UpdateSaleDto,
        @Param('id', ParseIntPipe) id: number,
        @GetUser('sub') clientId: string,
    ) {
        // return this.salesService.updateSale(updateSaleDto, id, clientId);
    }
    @Delete(':id')
    async deleteSale(
        @Param('id', ParseUUIDPipe)
        userId: string /** id of sale user to delete */,
        @GetUser('sub') clientId: string,
    ) {
        return await this.salesService.deleteSale(userId, clientId);
    }
}

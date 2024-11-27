import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { DhittoService } from './dhitto.service';
import { CreateCustomerDto, CreateDhittoDto } from './dto/create-dhitto.dto';
import { UpdateCustomerDto } from './dto/update-dhitto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStatementDto } from './dto/create-statement.dto';
import { GetUser } from 'src/commons/decorators/getuser.decorator';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/commons/decorators/public.decorator';

@ApiTags('dhitto')
@ApiBearerAuth()
@Controller('customers')
export class DhittoController {
    constructor(
        private readonly dhittoService: DhittoService,
        private readonly configService: ConfigService,
    ) {}

    @Post()
    createCustomer(
        @Body() createCustomerDto: CreateCustomerDto,
        @GetUser('sub') userId: string,
    ) {
        return this.dhittoService.createCustomer(createCustomerDto, userId);
    }

    @Get()
    findAllCustomers(
        @Query('search') search: string,
        @GetUser('sub') userId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
    ) {
        return this.dhittoService.findCustomers(
            { search, page, capacity },
            userId,
        );
    }

    @Get(':id')
    findCustomrDetail(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser('sub') userId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
    ) {
        return this.dhittoService.findCustomerDetail(id, userId, {
            page,
            capacity,
        });
    }

    @Get(':id/dhittos')
    fetchCustomerDhittos(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser('sub') userId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
    ) {
        return this.dhittoService.findCustomerDhittos(
            id,
            { page, capacity },
            userId,
        );
    }

    @Post('customer/history')
    @Public()
    fetchCustomerHistory(
        @Body()
        historyData: {
            customerId: string;
            startDate: string;
            endDate: string;
        },
    ) {
        return this.dhittoService.getDhitoHistory(historyData);
    }

    @Get(':id/dhittos/:dId/statements')
    fetchCustomerDhittoStatements(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('dId', ParseUUIDPipe) dId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
    ) {
        return this.dhittoService.getDhittoStatement(id, dId, {
            page,
            capacity,
        });
    }

    @Post(':id/dhittos/:dId/statements')
    lonPayment(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('dId', ParseUUIDPipe) dId: string,
        @Body() createStatementDto: CreateStatementDto,
        @GetUser('email') email: string,
        @GetUser('fullName') fullName: string,
        @GetUser('sub') sub: string,
    ) {
        return this.dhittoService.loanPayment(
            id,
            dId,
            createStatementDto,
            sub,
            email,
            fullName,
        );
    }

    @Delete(':id/dhittos/:dId/statements/:sId')
    deleteStatement(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('dId', ParseUUIDPipe) dId: string,
        @Param('sId', ParseUUIDPipe) sId: string,
        @Query('x-token') token: string,
    ) {
        const tokenTest = this.configService.getOrThrow('ADMIN_TOKEN');
        if (token !== tokenTest)
            throw new ForbiddenException('Forbidden resource.');
        return this.dhittoService.deleteStatement(id, dId, sId);
    }

    @Post(':id/dhittos')
    createDhitto(
        @Body() createDhittoDto: CreateDhittoDto,
        @Param('id', ParseUUIDPipe) customerId: string,
        @GetUser('email') email: string,
        @GetUser('fullName') name: string,
    ) {
        return this.dhittoService.createDhitto(
            createDhittoDto,
            customerId,
            email,
            name,
        );
    }

    @Patch(':id')
    updateCustomer(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDhittoDto: UpdateCustomerDto,
    ) {
        return this.dhittoService.updateCustomer(id, updateDhittoDto);
    }

    @Delete(':id')
    removeCustomer(@Param('id', ParseUUIDPipe) id: string) {
        return this.dhittoService.removeCustomer(id);
    }
}

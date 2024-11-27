import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { BankRecordService } from './bank-record.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    CreateBankDto,
    CreateBankRecordDto,
} from './dto/create-bank-record.dto';
import { UpdateBankRecordDto } from './dto/update-bank-record.dto';
import { GetUser } from 'src/commons/decorators/getuser.decorator';
import { dayjs } from 'src/utils/date';

@ApiBearerAuth()
@ApiTags('banks')
@Controller('banks')
export class BankRecordController {
    constructor(private readonly bankRecordService: BankRecordService) {}

    @Post()
    async create(
        @Body() createRecordDto: CreateBankDto,
        @GetUser('sub') userId: string,
    ) {
        return await this.bankRecordService.createBank(createRecordDto, userId);
    }

    @Post('bank-records')
    async createBankRecords(@Body() createBankRecord: CreateBankRecordDto) {
        return await this.bankRecordService.createBankRecord(createBankRecord);
    }
    /*
     *
     *  get all banks
     *
     * */
    @Get()
    async getAllBanks(@GetUser('sub') userId: string) {
        return await this.bankRecordService.getAllBanks(userId);
    }

    /*
     *
     * get bank record based on date and bankId
     * */
    @Get('bank-records')
    async getAll(
        @GetUser('sub') userId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
        @Query('bankId') bankId?: string,
        @Query('date') date?: string,
        @Query('search') search?: string,
    ) {
        const _date = date
            ? dayjs.utc(date).startOf('d').toISOString()
            : undefined;

        return await this.bankRecordService.getAllRecords(
            { page, capacity, bankId, date: _date, search },
            userId,
        );
    }

    /*
     * update bank record
     *   */

    @Patch(':id/bank-records/:rid')
    async update(
        @Param('id', ParseUUIDPipe) bankId: string,
        @Param('rid', ParseUUIDPipe) rid: string,
        @Body() updateBankRecordDto: UpdateBankRecordDto,
        @GetUser('sub') userId: string,
    ) {
        return await this.bankRecordService.update(
            bankId,
            updateBankRecordDto,
            rid,
            userId,
        );
    }

    /*
     *
     * delete bank record
     *  */
    @Delete(':id/bank-records/:rid')
    async delete(
        @Param('id', ParseUUIDPipe) bankId: string,
        @Param('rid', ParseUUIDPipe) recordId: string,
        @GetUser('sub') userId: string,
    ) {
        return await this.bankRecordService.deleteBankRecord(
            bankId,
            userId,
            recordId,
        );
    }

    /* delete bank  */
    @Delete(':id')
    async deleteBank(
        @Param('id', ParseUUIDPipe) bankId: string,
        @GetUser('sub') userId: string,
    ) {
        return await this.bankRecordService.deleteBank(bankId, userId);
    }
}

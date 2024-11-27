import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { burn } from 'src/utils/burn';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/commons/decorators/public.decorator';

@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Get('burner/:id')
    getBurnedId(@Param('id') id: string) {
        return burn(id);
    }

    @Get(':token/:resource')
    @Public()
    async getSalesInvoice(
        @Param('token') token: string,
        @Param('resource') resource: string,
        @Res() response: Response,
    ) {
        return response
            .setHeader('Content-Type', 'text/html')
            .send(
                await this.uploadService.generateBillFactory(token, resource),
            );
    }
}

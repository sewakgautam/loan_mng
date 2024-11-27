import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from './commons/decorators/getuser.decorator';
import { sendMail } from './utils/sendmail.helper';
import { Public } from './commons/decorators/public.decorator';

@ApiBearerAuth()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get('dashboard')
    getHello(@GetUser('sub') userId: string) {
        return this.appService.getDashboardInfo(userId);
    }


    @Public()
    @Post('sendEmail')
    async getEmail(
        @Body() data: { to: string; subject: string; text: string },
    ) {
        // console.log(data);
        return await sendMail(data); 
    }
}

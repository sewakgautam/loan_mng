import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/commons/decorators/public.decorator';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
    constructor(private readonly notifyService: NotifyService) {}

    @Public()
    @Get(':email/:message')
    test(@Param('email') to: string, @Param('message') message: string) {
        return this.notifyService.notifyMe<string>()(() => {
            return {
                data: message,
                to,
                subject: 'Test',
            };
        })((d) => {
            return {
                html: `<strong style="font-size: 30px">${d.data}</strong>`,
            };
        });
    }
}

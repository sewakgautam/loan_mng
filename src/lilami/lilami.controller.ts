import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Query,
} from '@nestjs/common';
import { LilamiService } from './lilami.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLilamiDto } from './dto/create-lilami.dto';
import { GetUser } from 'src/commons/decorators/getuser.decorator';

@ApiTags('lilami')
@ApiBearerAuth()
@Controller('lilami')
export class LilamiController {
    constructor(private readonly lilamiService: LilamiService) {}

    @Post()
    lilamiThisDhitto(
        @Body() createLilamiDto: CreateLilamiDto,
        @GetUser('email') email: string,
        @GetUser('fullName') name: string,
    ) {
        return this.lilamiService.lilamiThisDhitto(
            createLilamiDto,
            email,
            name,
        );
    }

    @Get(':id')
    getOneLilami(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser('sub') userId: string,
    ) {
        return this.lilamiService.getOneLilami(id, userId);
    }

    @Delete(':id')
    deleteLilami(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser('sub') userId: string,
    ) {
        return this.lilamiService.deleteLilami(id, userId);
    }

    @Get()
    getLilamiDhittos(
        @Query('page', ParseIntPipe) page?: number,
        @Query('capacity', ParseIntPipe) capacity?: number,
    ) {
        return this.lilamiService.getLilamiDhittos({ page, capacity });
    }
}

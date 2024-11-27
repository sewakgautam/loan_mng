import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('image-upload')
@Controller('image-upload')
@ApiBearerAuth()
export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
        @UploadedFile()
        image: Express.Multer.File,
    ) {
        console.log(image);
        return this.imageUploadService.uploadableImage(image.buffer);
    }
}

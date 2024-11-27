import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { IMG_PROC } from './token';
import * as sharp from 'sharp';

@Module({
    controllers: [ImageUploadController],
    providers: [
        ImageUploadService,
        {
            provide: IMG_PROC,
            useValue: sharp,
        },
    ],
})
export class ImageUploadModule {}

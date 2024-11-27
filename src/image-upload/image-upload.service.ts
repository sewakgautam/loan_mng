import { Inject, Injectable } from '@nestjs/common';
import { IMG_PROC } from './token';
import * as sharp from 'sharp';

@Injectable()
export class ImageUploadService {
    constructor(@Inject(IMG_PROC) private readonly _sharp: typeof sharp) {}

    private async transformImage(image: Buffer) {
        return await this._sharp(image)
            .resize(100, 100)
            .png({
                quality: 100,
            })
            .toBuffer();
    }

    private async _uploadableImage(image: Buffer) {
        const prefix = 'data:image/png;base64, ';
        return {
            image: prefix + image.toString('base64'),
        };
    }

    async uploadableImage(image: Buffer) {
        return await this._uploadableImage(await this.transformImage(image));
    }
}

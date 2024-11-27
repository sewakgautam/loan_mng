import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { SalesModule } from 'src/sales/sales.module';
import { DhittoModule } from 'src/dhitto/dhitto.module';

@Module({
    imports: [SalesModule, DhittoModule],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}

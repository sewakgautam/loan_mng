import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/@guards/jwt.guard';
import { DhittoModule } from './dhitto/dhitto.module';
import { BankRecordModule } from './bank-record/bank-record.module';
import { SalesModule } from './sales/sales.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { UploadModule } from './upload/upload.module';
import { LilamiModule } from './lilami/lilami.module';
import { NotifyModule } from './notify/notify.module';
import { PrismaService } from './prisma.service';
import { ErrorsInterceptor } from './@interceptors/error.interceptor';

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        DhittoModule,
        BankRecordModule,
        SalesModule,
        ScheduleModule.forRoot(),
        ImageUploadModule,
        UploadModule,
        LilamiModule,
        NotifyModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor,
        },
        AppService,
        PrismaService,
    ],
})
export class AppModule {}

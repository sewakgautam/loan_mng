import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:5173',
    });

    const config = app.get<ConfigService>(ConfigService);

    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true }),
    );
    // app.useGlobalInterceptors(new ErrorsInterceptor());

    const options = new DocumentBuilder()
        .setTitle('Loan Management dashboard')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    const PORT = config.getOrThrow('PORT');

    await app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
    // await app.listen(4000, () => console.log(`Server Started on port 4000 `));
}
bootstrap();

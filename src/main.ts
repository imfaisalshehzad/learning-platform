import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ExcludeNullInterceptor} from "./utils/excludeNull.interceptor";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import session from "express-session";
import {DocumentBuilder, SwaggerDocumentOptions, SwaggerModule} from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import compression from "compression";


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            credentials: true,
            origin: process.env.CLIENT_URL
        }
    });
    const configService = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.useGlobalInterceptors(new ExcludeNullInterceptor());
    app.enableCors();
    app.use(cookieParser());
    app.use(compression());
    app.use(
        session({
            secret: configService.get('SESSION_SECRET'),
            resave: false,
            saveUninitialized: false,
        }),
    );

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Glu Learning')
        .setDescription('Glu Learning API')
        .setVersion('1.0')
        .addTag('GLU')
        .addBearerAuth()
        .build();

    const options: SwaggerDocumentOptions =  {
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('apidoc', app, document);
    await app.listen(3000);
}

bootstrap();

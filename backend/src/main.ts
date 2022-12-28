import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";
import {AppDataSource} from "./config/typeorm.datasource";
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
})
  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('pug');
  const validationPipe = new ValidationPipe({
    whitelist: true, 
    forbidUnknownValues: true,
    transform: true,
    transformOptions: {
      enableCircularCheck: true, 
    },
    exceptionFactory(errors) {
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      return true;
    },
  });
  app.useGlobalPipes(validationPipe);
  const config = new DocumentBuilder()
      .setTitle('Ylimpiads')
      .setDescription('Ylimpiads API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

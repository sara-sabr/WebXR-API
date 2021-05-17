/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';


async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./certs/privateKey.pem'),
    cert: readFileSync('./certs/certificate.pem')
  }
  let corsOptions = {
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization']
  }
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('XR API')
    .setDescription('The WEBXR API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();

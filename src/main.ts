/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';


async function bootstrap() {

  let app;

  // SSL for local
  if (process.env.IS_AZURE === 'true') {
    app = await NestFactory.create(AppModule);  
  } else {
    const httpsOptions = {
      key: readFileSync('./certs/privateKey.pem'),
      cert: readFileSync('./certs/certificate.pem')
    }
    app = await NestFactory.create(AppModule, {httpsOptions});  
  }
  
  // CORS
  let corsOptions = {
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization']
  }  
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('XR API')
    .setDescription('The WEBXR API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();

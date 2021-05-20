/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PhotosModule } from './photos/photos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthModule } from './health/Health.module';
import { AudioModule } from './audio/audio.module';

@Module({
  controllers: [AppController],
  imports: [PhotosModule, 
            AuthModule, 
            HealthModule,
            UsersModule, 
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'client'),
            }), AudioModule,
           ],
})
export class AppModule {}

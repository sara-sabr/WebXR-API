/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PhotosModule, AuthModule, UsersModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  }),],
})
export class AppModule {}

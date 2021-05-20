import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AudioService } from './audio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';


@Controller('audio')
export class AudioController {
    constructor(private audioService: AudioService){};
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
      await this.audioService.upload(file);
      return 'Successful'
    }
}

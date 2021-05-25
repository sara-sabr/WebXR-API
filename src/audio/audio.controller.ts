import { Controller, Post, UseInterceptors, UploadedFile, Get, Header, Res } from '@nestjs/common';
import { AudioService } from './audio.service';
import {WriteStream, createWriteStream} from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/constants';
import { ChatbotService } from 'src/chatbot/chatbot.service';
import { Response } from 'express';


@Controller('audio')
export class AudioController {
    constructor(private audioService: AudioService, private chatBotService: ChatbotService){};
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
    async upload(@UploadedFile() file: Express.Multer.File): Promise<void> {
      const resultText = await this.audioService.speechToText(file);
      const chatbotResponse = await this.chatBotService.getAnswer(resultText);
      const audioResult = await this.audioService.convertTextToAudio(chatbotResponse);
      //return audioResult;
    }
    @Get('test')
    @Header('Content-Type', 'audio/mpeg')
    @Public()
    async sample(@Res() response: Response): Promise<void>{
      const mp3File = await this.audioService.convertTextToAudio('Hello and welcome');
      response.send(mp3File);
      // mp3File.
      // let stream = createWriteStream()
      // response.pipe(mp3File);
    }

}

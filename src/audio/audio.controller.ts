import { Controller, Post, UseInterceptors, UploadedFile, Get, Header, Res } from '@nestjs/common';
import { AudioService } from './audio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
    async upload(@UploadedFile() file: Express.Multer.File, @Res() response:Response): Promise<void> {
      const resultText = await this.audioService.speechToText(file);
      const chatbotResponse = await this.chatBotService.getAnswer(resultText);
      const audioStream = await this.audioService.convertTextToAudio(chatbotResponse);
      audioStream.pipe(response);
    }
}

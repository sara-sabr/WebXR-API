import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  providers: [ChatbotService],
  exports: [ChatbotService],
  controllers: [ChatbotController]
})
export class ChatbotModule {}

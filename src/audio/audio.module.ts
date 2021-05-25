import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { ChatbotModule } from 'src/chatbot/chatbot.module';

@Module({
    imports: [ChatbotModule],
    controllers: [AudioController],
    providers: [AudioService],
})
export class AudioModule {}

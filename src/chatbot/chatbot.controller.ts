import { Controller,Get} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatbotService } from 'src/chatbot/chatbot.service';


@Controller('chatbot')
export class ChatbotController {
    constructor(private chatbotService: ChatbotService){};

    @Get('refresh')
    @ApiOperation({description: "Refresh the chatbot faq list."})
    @ApiBearerAuth()
    async refresh(): Promise<string> {
        this.chatbotService.refreshFaq();
      return "Done";
    }
}

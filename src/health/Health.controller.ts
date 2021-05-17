import { Controller, Get } from "@nestjs/common";
import { Public } from "src/auth/constants";

@Controller()
export class HealthController {  
  @Public()
  @Get(['/health', '/'])
  getHealth() {
    return "OK";
  }
}

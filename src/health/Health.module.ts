import { HealthController } from "./Health.controller";
import { Module } from '@nestjs/common';

@Module({
  controllers: [HealthController]
})
export class HealthModule {}

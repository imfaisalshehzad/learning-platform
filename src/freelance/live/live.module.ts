import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LiveFreelanceSessionEntity} from "./entities/live.entity";

@Module({
  imports:[TypeOrmModule.forFeature([LiveFreelanceSessionEntity])],
  controllers: [LiveController],
  providers: [LiveService],
  exports:[LiveService],
})
export class LiveFreelanceModule {}

import { Module } from '@nestjs/common';
import { DaysOffService } from './daysoff.service';
import { DaysOffController } from './daysoff.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DaysOffEntity} from "./entities/daysoff.entity";

@Module({
  imports:[TypeOrmModule.forFeature([DaysOffEntity])],
  controllers: [DaysOffController],
  providers: [DaysOffService]
})
export class DaysOffModule {}

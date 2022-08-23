import { Module } from '@nestjs/common';
import { SchoolLiveService } from './live.service';
import { SchoolLiveController } from './live.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolLiveSession} from "./entities/live.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SchoolLiveSession])],
  controllers: [SchoolLiveController],
  providers: [SchoolLiveService]
})
export class SchoolLiveSessionModule {}

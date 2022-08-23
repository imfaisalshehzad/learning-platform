import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AvailabilityEntity} from "./entities/availability.entity";

@Module({
  imports:[TypeOrmModule.forFeature([AvailabilityEntity])],
  controllers: [AvailabilityController],
  providers: [AvailabilityService]
})
export class AvailabilityModule {}

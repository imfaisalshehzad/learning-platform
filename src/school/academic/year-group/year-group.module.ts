import { Module } from '@nestjs/common';
import { YearGroupService } from './year-group.service';
import { YearGroupController } from './year-group.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {YearGroupEntity} from "./entities/year-group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([YearGroupEntity])],
  controllers: [YearGroupController],
  providers: [YearGroupService]
})
export class SchoolYearGroupModule {}

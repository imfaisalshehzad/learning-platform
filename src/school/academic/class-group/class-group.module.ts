import { Module } from '@nestjs/common';
import { ClassGroupService } from './class-group.service';
import { ClassGroupController } from './class-group.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClassGroupEntity} from "./entities/class-group.entity";

@Module({
  imports:[TypeOrmModule.forFeature([ClassGroupEntity])],
  controllers: [ClassGroupController],
  providers: [ClassGroupService]
})
export class SchoolClassGroupModule {}

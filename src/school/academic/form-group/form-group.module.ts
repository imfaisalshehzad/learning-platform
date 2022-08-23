import { Module } from '@nestjs/common';
import { FormGroupService } from './form-group.service';
import { FormGroupController } from './form-group.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FormGroupEntity} from "./entities/form-group.entity";

@Module({
  imports:[TypeOrmModule.forFeature([FormGroupEntity])],
  controllers: [FormGroupController],
  providers: [FormGroupService]
})
export class SchoolFormGroupModule {}

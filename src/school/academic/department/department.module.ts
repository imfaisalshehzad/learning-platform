import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolDepartmentEntity} from "./entities/department.entity";

@Module({
  imports:[TypeOrmModule.forFeature([SchoolDepartmentEntity])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class SchoolDepartmentModule {}
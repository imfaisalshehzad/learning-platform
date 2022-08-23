import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolSubjectEntity} from "./entities/subject.entity";

@Module({
  imports:[TypeOrmModule.forFeature([SchoolSubjectEntity])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SchoolSubjectsModule {}

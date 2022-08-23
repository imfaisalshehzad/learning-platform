import { Module } from '@nestjs/common';
import { FreelanceSubjectService } from './subject.service';
import { FreelanceSubjectController } from './subject.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FreelanceSubjectEntity} from "./entities/subject.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FreelanceSubjectEntity])],
  controllers: [FreelanceSubjectController],
  providers: [FreelanceSubjectService]
})
export class FreelanceSubjectModule {}

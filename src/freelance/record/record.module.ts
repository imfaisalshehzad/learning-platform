import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecordFreelanceSessionEntity} from "./entities/record.entity";
import {UploadModule} from "../../upload/upload.module";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";


@Module({
  imports:[
      TypeOrmModule.forFeature([
          RecordFreelanceSessionEntity,
          TeacherEntity
      ]),
      UploadModule,
  ],
  controllers: [RecordController],
  providers: [RecordService]
})
export class RecordFreelanceModule {}

import { Module } from '@nestjs/common';
import { SchoolRecordSessionService } from './record.service';
import { SchoolRecordSessionController } from './record.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolRecordSession} from "./entities/record.entity";
import {UsersModule} from "../../../../users/users.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([SchoolRecordSession]),
      UsersModule,
  ],
  controllers: [SchoolRecordSessionController],
  providers: [SchoolRecordSessionService]
})
export class SchoolRecordSessionModule {}

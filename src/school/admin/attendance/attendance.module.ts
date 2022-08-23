import {Module} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {AttendanceController} from './attendance.controller';
import {SchoolTimetableBlocksModule} from "../../academic/timetables/blocks/blocks.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimetableBlocksEntity} from "../../academic/timetables/blocks/entities/timetable.blocks.entity";
import {TimetableBlockFeedbackEntity} from "../../academic/timetables/blocks/block-feedback/entities/block-feedback.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TimetableBlocksEntity,
            TimetableBlockFeedbackEntity,
        ]),
        SchoolTimetableBlocksModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService]
})
export class SchoolAttendanceModule {}

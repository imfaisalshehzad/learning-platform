import {Module} from '@nestjs/common';
import {BlocksService} from './blocks.service';
import {BlocksController} from './blocks.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimetableBlocksEntity} from "./entities/timetable.blocks.entity";
import {TimetableBlockFeedbackModule} from './block-feedback/block-feedback.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TimetableBlocksEntity,
        ]),
        TimetableBlockFeedbackModule,
    ],
    controllers: [BlocksController],
    providers: [BlocksService],
})
export class SchoolTimetableBlocksModule {}

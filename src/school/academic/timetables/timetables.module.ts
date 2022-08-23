import {Module} from '@nestjs/common';
import {TimetablesService} from './timetables.service';
import {TimetablesController} from './timetables.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimetableEntity} from "./entities/timetable.entity";
import {RouterModule, Routes} from "@nestjs/core";
import {SchoolTimetableBlocksModule} from "./blocks/blocks.module";
import {TimetableBlockFeedbackModule} from "./blocks/block-feedback/block-feedback.module";

const routers: Routes = [
    {
        path: 'timetable',
        module: SchoolTimetableBlocksModule,
        children: [
            {
                path: 'block',
                module: TimetableBlockFeedbackModule,
            },
        ]
    },
]

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TimetableEntity,
        ]),
        RouterModule.register(routers),
        SchoolTimetableBlocksModule,
    ],
    controllers: [TimetablesController],
    providers: [TimetablesService],
})
export class SchoolTimetablesModule {
}

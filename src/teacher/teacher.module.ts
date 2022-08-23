import {Module} from '@nestjs/common';
import {TeacherService} from './teacher.service';
import {TeacherController} from './teacher.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TeacherEntity} from "./entities/teacher.entity";
import {LiveFreelanceSessionEntity} from "../freelance/live/entities/live.entity";
import {RecordFreelanceSessionEntity} from "../freelance/record/entities/record.entity";
import {RouterModule, Routes} from "@nestjs/core";
import {SchoolRecordSessionModule} from "./school/lesson/record/record.module";
import {SchoolLiveSessionModule} from "./school/lesson/live/live.module";
import {UsersModule} from "../users/users.module";
import {FreelanceFavourite} from "../freelance/favourite/entities/favourite.entity";
import {FreelanceReviewEntity} from "../freelance/reviews/entities/review.entity";


const routers: Routes = [
    {
        path: 'teacher',
        module: SchoolRecordSessionModule,
    },
    {
        path: 'teacher',
        module: SchoolLiveSessionModule,
    },
]


@Module({
    imports: [
        TypeOrmModule.forFeature([
            TeacherEntity,
            LiveFreelanceSessionEntity,
            RecordFreelanceSessionEntity,
            FreelanceFavourite,
            FreelanceReviewEntity,
        ]),
        RouterModule.register(routers),
        SchoolRecordSessionModule,
        SchoolLiveSessionModule,
        UsersModule,
    ],
    controllers: [TeacherController],
    providers: [TeacherService],
    exports: [TeacherService],
})
export class TeacherModule {
}

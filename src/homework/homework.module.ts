import {Module} from '@nestjs/common';
import {HomeworkService} from './homework.service';
import {HomeworkController} from './homework.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolHomeworkEntity} from "./entities/homework.entity";
import {SchoolHomeworkSubmissionsEntity} from "./entities/homework.submissions.entity";
import {SchoolHomeworkMarkEntity} from "./entities/homework.mark.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        SchoolHomeworkEntity,
        SchoolHomeworkSubmissionsEntity,
        SchoolHomeworkMarkEntity,
    ]),
        UsersModule,
    ],
    controllers: [HomeworkController],
    providers: [HomeworkService]
})
export class SchoolHomeworkModule {
}

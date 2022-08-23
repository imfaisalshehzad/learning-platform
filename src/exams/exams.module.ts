import {Module} from '@nestjs/common';
import {ExamsService} from './exams.service';
import {ExamsController} from './exams.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolExamEntity} from "./entities/exam.entity";
import {SchoolExamResultEntity} from "./entities/exam.results.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        SchoolExamEntity,
        SchoolExamResultEntity,
    ]),
        UsersModule
    ],
    controllers: [ExamsController],
    providers: [ExamsService]
})
export class SchoolExamsModule {
}

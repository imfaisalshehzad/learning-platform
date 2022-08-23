import {Module} from '@nestjs/common';
import {SchoolService} from './school.service';
import {SchoolController} from './school.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolEntity} from "./entities/school.entity";
import {SchoolDepartmentModule} from './academic/department/department.module';
import {SchoolSubjectsModule} from './academic/subjects/subjects.module';
import {SchoolYearGroupModule} from './academic/year-group/year-group.module';
import {SchoolClassGroupModule} from './academic/class-group/class-group.module';
import {SchoolTimetablesModule} from './academic/timetables/timetables.module';
import {SchoolSessionsModule} from './academic/sessions/sessions.module';
import {SchoolSyllabusModule} from './academic/syllabus/syllabus.module';
import {SchoolAttendanceModule} from './admin/attendance/attendance.module';
import {SchoolCalendarModule} from './admin/calendar/calendar.module';
import {RouterModule, Routes} from "@nestjs/core";
import {SchoolFormGroupModule} from "./academic/form-group/form-group.module";
import { SchoolTermsModule } from './academic/terms/terms.module';


const routers: Routes = [
    {
        path: 'school',
        module: SchoolDepartmentModule,
    },
    {
        path: 'school',
        module: SchoolSubjectsModule,
    },
    {
        path: 'school',
        module: SchoolYearGroupModule,
    },
    {
        path: 'school',
        module: SchoolFormGroupModule,
    },
    {
        path: 'school',
        module: SchoolClassGroupModule,
    },
    {
        path: 'school',
        module: SchoolSessionsModule,
    },
    {
        path: 'school',
        module: SchoolSyllabusModule,
    },
    {
        path: 'school',
        module: SchoolTermsModule,
    },
]


@Module({
    imports: [
        TypeOrmModule.forFeature([SchoolEntity]),
        RouterModule.register(routers),
        SchoolDepartmentModule,
        SchoolSubjectsModule,
        SchoolYearGroupModule,
        SchoolFormGroupModule,
        SchoolClassGroupModule,
        SchoolTimetablesModule,
        SchoolSessionsModule,
        SchoolSyllabusModule,
        SchoolAttendanceModule,
        SchoolCalendarModule,
        SchoolTermsModule,
    ],
    controllers: [SchoolController],
    providers: [SchoolService]
})
export class SchoolModule {
}

import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, OneToMany, OneToOne} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {SchoolDepartmentEntity} from "../academic/department/entities/department.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import {StudentEntity} from "../../student/entities/student.entity";
import {YearGroupEntity} from "../academic/year-group/entities/year-group.entity";
import {FormGroupEntity} from "../academic/form-group/entities/form-group.entity";
import {ClassGroupEntity} from "../academic/class-group/entities/class-group.entity";
import {TimetableEntity} from "../academic/timetables/entities/timetable.entity";
import {SchoolHomeworkEntity} from "../../homework/entities/homework.entity";
import {SchoolTermsEntity} from "../academic/terms/entities/term.entity";
import {TimetableBlocksEntity} from "../academic/timetables/blocks/entities/timetable.blocks.entity";
import {SchoolRecordSession} from "../../teacher/school/lesson/record/entities/record.entity";

@Entity()
export class SchoolEntity extends BaseTable {

    @Column()
    name: string

    /**
     * @OneToOne
     **/

    @OneToOne(() => UserEntity,
        (user: UserEntity) => user.school,
        {}
    )
    public user: UserEntity


    /**
     * @OneToMany
     * @TeacherEntity
     * @StudentEntity
     * @SchoolDepartmentEntity
     * @YearGroupEntity
     * @FormGroupEntity
     * @ClassGroupEntity
     * @TimetableEntity
     * @SchoolHomeworkEntity
     * @SchoolTermsEntity
     **/

    @OneToMany(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.school,
        {
            nullable: true,
        })
    public teacher: TeacherEntity

    @OneToMany(() => StudentEntity,
        (student: StudentEntity) => student.school,
        {
            nullable: true,
        })
    public student: StudentEntity

    @OneToMany(
        () => SchoolDepartmentEntity,
        (department: SchoolDepartmentEntity) => department.school,
        {}
    )
    public department: SchoolDepartmentEntity[]

    @OneToMany(
        () => YearGroupEntity,
        (yearGroup: YearGroupEntity) => yearGroup.school,
        {}
    )
    public yearGroup: YearGroupEntity[]


    @OneToMany(
        () => FormGroupEntity,
        (formGroup: FormGroupEntity) => formGroup.school,
        {}
    )
    public formGroup: FormGroupEntity[]

    @OneToMany(
        () => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.school,
        {}
    )
    public classGroup: ClassGroupEntity[]

    @OneToMany(
        () => TimetableEntity,
        (timetable: TimetableEntity) => timetable.school,
        {}
    )
    public timetable: TimetableEntity[]

    @OneToMany(
        () => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.school,
        {}
    )
    public homework: SchoolHomeworkEntity[]


    @OneToMany(
        () => SchoolTermsEntity,
        (terms: SchoolTermsEntity) => terms.school,
        {}
    )
    public terms: SchoolTermsEntity[]

    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.school,
        {}
    )
    public blocks: TimetableBlocksEntity[]

    @OneToMany(
        () => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.school,
        {}
    )
    public schoolRecord: SchoolRecordSession[]


}

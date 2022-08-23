import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {TeacherEntity} from "../../../../teacher/entities/teacher.entity";
import {StudentEntity} from "../../../../student/entities/student.entity";
import {YearGroupEntity} from "../../year-group/entities/year-group.entity";
import {SchoolDepartmentEntity} from "../../department/entities/department.entity";
import {SchoolSubjectEntity} from "../../subjects/entities/subject.entity";
import {TimetableBlocksEntity} from "../../timetables/blocks/entities/timetable.blocks.entity";
import {SchoolHomeworkEntity} from "../../../../homework/entities/homework.entity";
import {SchoolExamEntity} from "../../../../exams/entities/exam.entity";
import {SchoolFeedbackEntity} from "../../../../feedback/entities/feedback.entity";
import {SchoolRecordSession} from "../../../../teacher/school/lesson/record/entities/record.entity";
import {SchoolLiveSession} from "../../../../teacher/school/lesson/live/entities/live.entity";


@Entity()
export class ClassGroupEntity extends BaseTable {


    @Column()
    public name: string

    /**
     * @ManyToOne
     * @SchoolEntity
     * @YearGroupEntity
     * @SchoolDepartmentEntity
     * @SchoolSubjectEntity
     */

    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.classGroup,
    )
    public school: SchoolEntity

    @ManyToOne(() => YearGroupEntity,
        (yearGroup: YearGroupEntity) => yearGroup.classGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public yearGroup: YearGroupEntity

    @ManyToOne(() => SchoolDepartmentEntity,
        (department: SchoolDepartmentEntity) => department.classGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public department: SchoolDepartmentEntity

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.classGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public subject: SchoolSubjectEntity


    /**
     * @OneToMany
     * @TimetableBlocksEntity
     * @SchoolHomeworkEntity
     * @SchoolExamEntity
     * @SchoolFeedbackEntity
     */

    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.classGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity[]

    @OneToMany(
        () => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.classGroup,
        {
            nullable: true,
        }
    )
    public homework: SchoolHomeworkEntity[];

    @OneToMany(
        () => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.classGroup,
        {
            nullable: true,
        }
    )
    public exam: SchoolExamEntity[];

    @OneToMany(
        () => SchoolFeedbackEntity,
        (feedback: SchoolFeedbackEntity) => feedback.classGroup,
        {
            nullable: true,
        }
    )
    public feedback: SchoolFeedbackEntity[];

    @OneToMany(
        () => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.classGroup,
        {
            nullable: true,
        }
    )
    public schoolRecord: SchoolRecordSession[];

   @OneToMany(
        () => SchoolLiveSession,
        (schoolLive: SchoolLiveSession) => schoolLive.classGroup,
        {
            nullable: true,
        }
    )
    public schoolLive: SchoolLiveSession[];

    /**
     * @ManyToMany
     * @TeacherEntity
     * @StudentEntity
     */

    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.classGroup,
        {
            eager: false,
            nullable: false,
        })
    public teacher: TeacherEntity[]


    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.classGroup,
        {
            eager: false,
            nullable: false,
        })
    public student: StudentEntity[]


}

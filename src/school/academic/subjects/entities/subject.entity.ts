import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne} from "typeorm";
import {SchoolDepartmentEntity} from "../../department/entities/department.entity";
import {SchoolEntity} from "../../../entities/school.entity";
import {ClassGroupEntity} from "../../class-group/entities/class-group.entity";
import {TimetableBlocksEntity} from "../../timetables/blocks/entities/timetable.blocks.entity";
import {SchoolHomeworkEntity} from "../../../../homework/entities/homework.entity";
import {SchoolExamEntity} from "../../../../exams/entities/exam.entity";
import {SchoolFeedbackEntity} from "../../../../feedback/entities/feedback.entity";
import {SchoolLiveSession} from "../../../../teacher/school/lesson/live/entities/live.entity";
import {SchoolRecordSession} from "../../../../teacher/school/lesson/record/entities/record.entity";

@Entity()
export class SchoolSubjectEntity extends BaseTable {

    @Column()
    public name: string

    /**
     * @OneToOne
     * @SchoolEntity
     */

    @OneToOne(() => SchoolEntity, {
        eager: false,
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    public school: SchoolEntity

    /**
     * @OneToMany
     * @ClassGroupEntity
     * @TimetableBlocksEntity
     * @SchoolHomeworkEntity
     * @SchoolExamEntity
     * @SchoolFeedbackEntity
     */

    @OneToMany(
        () => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.subject,
        {
            eager: false,
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity[]

    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.subject,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity[]

    @OneToMany(
        () => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.subject,
        {
            nullable: true,
        }
    )
    public homework: SchoolHomeworkEntity[];

    @OneToMany(
        () => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.subject,
        {
            nullable: true,
        }
    )
    public exam: SchoolExamEntity[];

    @OneToMany(
        () => SchoolFeedbackEntity,
        (feedback: SchoolFeedbackEntity) => feedback.subject,
        {
            nullable: true,
        }
    )
    public feedback: SchoolFeedbackEntity[];


    @OneToMany(() => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.subject,
        {
            nullable: true,
        }
    )
    public schoolRecord: SchoolRecordSession


    @OneToMany(() => SchoolLiveSession,
        (schoolLive: SchoolLiveSession) => schoolLive.subject,
        {}
    )
    public schoolLive: SchoolLiveSession

    /**
     * @ManyToMany
     * @SchoolDepartmentEntity
     * @SchoolLiveSession
     */

    @ManyToMany(() => SchoolDepartmentEntity,
        (department: SchoolDepartmentEntity) => department.subject,
        {
            eager: false,
        })
    @JoinTable()
    department: SchoolDepartmentEntity[];



}

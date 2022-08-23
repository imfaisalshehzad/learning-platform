import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {ENUM_ACTIVE, GENDER_ENUM} from "../../utils/enum/enum.types";
import {Expose} from "class-transformer";
import {SchoolEntity} from "../../school/entities/school.entity";
import {FormGroupEntity} from "../../school/academic/form-group/entities/form-group.entity";
import {ClassGroupEntity} from "../../school/academic/class-group/entities/class-group.entity";
import {TimetableBlocksEntity} from "../../school/academic/timetables/blocks/entities/timetable.blocks.entity";
import {SchoolHomeworkEntity} from "../../homework/entities/homework.entity";
import {SchoolHomeworkSubmissionsEntity} from "../../homework/entities/homework.submissions.entity";
import {SchoolExamEntity} from "../../exams/entities/exam.entity";
import {SchoolExamResultEntity} from "../../exams/entities/exam.results.entity";
import {SchoolFeedbackEntity} from "../../feedback/entities/feedback.entity";
import {TimetableBlockFeedbackEntity} from "../../school/academic/timetables/blocks/block-feedback/entities/block-feedback.entity";
import {SchoolLiveSession} from "../../teacher/school/lesson/live/entities/live.entity";
import {SchoolRecordSession} from "../../teacher/school/lesson/record/entities/record.entity";
import {FreelanceFavourite} from "../../freelance/favourite/entities/favourite.entity";
import {FreelanceReviewEntity} from "../../freelance/reviews/entities/review.entity";


@Entity()
export class StudentEntity extends BaseTable {

    /**
     * @Column
     */

    @Column()
    public firstName: string

    @Column()
    public lastName: string

    @Column({
        type: "enum",
        enum: GENDER_ENUM,
        default: GENDER_ENUM.NONE,
    })
    @Expose()
    public gender: GENDER_ENUM

    @Column({default: null})
    public fatherName: string

    @Column({default: null})
    public motherName: string

    @Column({default: null})
    public rollNumber: string

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    @Expose()
    public isVerifiedByAdmin: ENUM_ACTIVE

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    @Expose()
    public parentStatus: ENUM_ACTIVE

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    @Expose()
    public isVerifiedBySchool: ENUM_ACTIVE

    /**
     * @OneToOne
     * @UserEntity
     */

    @OneToOne(() => UserEntity,
        (user: UserEntity) => user.student,
        {}
    )
    public user: UserEntity

    /**
     * @ManyToOne
     * @SchoolEntity
     */

    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.student,
        {
            eager: false,
            nullable: true,
        })
    @JoinColumn()
    public school: SchoolEntity

    /**
     * @OneToMany
     * @SchoolHomeworkSubmissionsEntity
     * @SchoolExamResultEntity
     * @FreelanceFavourite
     * @FreelanceReviewEntity
     */

    @OneToMany(
        () => SchoolHomeworkSubmissionsEntity,
        (submissions: SchoolHomeworkSubmissionsEntity) => submissions.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public submissions: SchoolHomeworkSubmissionsEntity[]

    @OneToMany(
        () => SchoolExamResultEntity,
        (results: SchoolExamResultEntity) => results.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public results: SchoolExamResultEntity[]

   @OneToMany(
        () => FreelanceFavourite,
        (favourite: FreelanceFavourite) => favourite.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public favourite: FreelanceFavourite[]

    @OneToMany(
        () => FreelanceReviewEntity,
        (review: FreelanceReviewEntity) => review.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public review: FreelanceReviewEntity[]

    /**
     * @ManyToMany
     * @FormGroupEntity
     * @ClassGroupEntity
     * @TimetableBlocksEntity
     * @SchoolHomeworkEntity
     * @SchoolExamEntity
     * @SchoolFeedbackEntity
     * @TimetableBlockFeedbackEntity
     * @SchoolLiveSession
     * @SchoolRecordSession
     */


    @ManyToMany(() => FormGroupEntity,
        (formGroup: FormGroupEntity) => formGroup.student,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public formGroup: FormGroupEntity[];

    @ManyToMany(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.student,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public classGroup: ClassGroupEntity[];

    @ManyToMany(() => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.student,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public blocks: TimetableBlocksEntity[];

    @ManyToMany(() => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.student,
        {
            eager: false,
            nullable: true,
        })
    public homework: SchoolHomeworkEntity[];

    @ManyToMany(() => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.student,
        {
            eager: false,
            nullable: true,
        })
    exam: SchoolExamEntity[];

    @ManyToMany(() => SchoolFeedbackEntity,
        (feedback: SchoolFeedbackEntity) => feedback.student,
        {
            eager: false,
            nullable: true,
        })
    public feedback: SchoolFeedbackEntity[];

    @ManyToMany(
        () => TimetableBlockFeedbackEntity,
        (blockFeedback: TimetableBlockFeedbackEntity) => blockFeedback.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public blockFeedback: TimetableBlockFeedbackEntity[]

    @ManyToMany(
        () => SchoolLiveSession,
        (schoolLive: SchoolLiveSession) => schoolLive.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public schoolLive: SchoolLiveSession[]


    @ManyToMany(
        () => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.student,
        {
            eager: false,
            nullable: false,
        }
    )
    public schoolRecord: SchoolRecordSession[]


}

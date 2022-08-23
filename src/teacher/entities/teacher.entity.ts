import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {FreelanceSubjectEntity} from "../../freelance/subject/entities/subject.entity";
import {ExperienceEntity} from "../../experience/entities/experience.entity";
import {AvailabilityEntity} from "../../availability/entities/availability.entity";
import {DaysOffEntity} from "../../daysoff/entities/daysoff.entity";
import {RecordFreelanceSessionEntity} from "../../freelance/record/entities/record.entity";
import {LiveFreelanceSessionEntity} from "../../freelance/live/entities/live.entity";
import {EducationEntity} from "../../education/entities/education.entity";
import {SchoolDepartmentEntity} from "../../school/academic/department/entities/department.entity";
import {SchoolEntity} from "../../school/entities/school.entity";
import {YearGroupEntity} from "../../school/academic/year-group/entities/year-group.entity";
import {FormGroupEntity} from "../../school/academic/form-group/entities/form-group.entity";
import {ClassGroupEntity} from "../../school/academic/class-group/entities/class-group.entity";
import {TimetableBlocksEntity} from "../../school/academic/timetables/blocks/entities/timetable.blocks.entity";
import {SchoolHomeworkEntity} from "../../homework/entities/homework.entity";
import {SchoolHomeworkMarkEntity} from "../../homework/entities/homework.mark.entity";
import {SchoolExamEntity} from "../../exams/entities/exam.entity";
import {SchoolFeedbackEntity} from "../../feedback/entities/feedback.entity";
import {TimetableBlockFeedbackEntity} from "../../school/academic/timetables/blocks/block-feedback/entities/block-feedback.entity";
import {SchoolLiveSession} from "../school/lesson/live/entities/live.entity";
import {SchoolRecordSession} from "../school/lesson/record/entities/record.entity";
import {FreelanceFavourite} from "../../freelance/favourite/entities/favourite.entity";
import {VirtualColumn} from "../../utils/decorator/virtual-column";
import {FreelanceReviewEntity} from "../../freelance/reviews/entities/review.entity";


@Entity()
export class TeacherEntity extends BaseTable {

    /**
     * @Column
     */

    @Column()
    public firstName: string

    @Column()
    public lastName: string

    @Column({
        nullable: false,
        type: "decimal",
        default: 0
    })
    public perHour: number

    /**
     * @OneToOne
     * @UserEntity
     * @SchoolEntity
     */

    @OneToOne(() => UserEntity,
        (user: UserEntity) => user.teacher,
        {
            eager: false,
            nullable: true,
        })
    public user: UserEntity


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.teacher,
        {
            eager: false,
            nullable: true,
        })
    @JoinColumn()
    public school: SchoolEntity

    /**
     * @OneToMany
     * @ExperienceEntity
     * @AvailabilityEntity
     * @DaysOffEntity
     * @EducationEntity
     * @RecordFreelanceSessionEntity
     * @LiveFreelanceSessionEntity
     * @SchoolHomeworkEntity
     * @SchoolHomeworkMarkEntity
     * @SchoolExamEntity
     * @TimetableBlockFeedbackEntity
     * @SchoolLiveSession
     * @SchoolRecordSession
     * @FreelanceFavourite
     */

    @OneToMany(() => ExperienceEntity,
        (experience: ExperienceEntity) => experience.teacher,
        {
            eager: false,
            cascade: true,
            nullable: true,
        })
    public experience: ExperienceEntity[];

    @OneToMany(() => AvailabilityEntity,
        (availability: AvailabilityEntity) => availability.teacher,
        {
            eager: false,
            cascade: true,
            nullable: true,
        })
    public availability: AvailabilityEntity[];

    @OneToMany(() => DaysOffEntity,
        (daysOff: DaysOffEntity) => daysOff.teacher,
        {
            eager: false,
            cascade: true,
            nullable: true,
        })
    public daysOff: DaysOffEntity[];

    @OneToMany(() => EducationEntity,
        (education: EducationEntity) => education.teacher,
        {
            eager: false,
            cascade: true,
            nullable: true,
        })
    public educations: EducationEntity[];

    @OneToMany(
        () => RecordFreelanceSessionEntity,
        (record: RecordFreelanceSessionEntity) => record.teacher
    )
    public record: RecordFreelanceSessionEntity[];

    @OneToMany(
        () => LiveFreelanceSessionEntity,
        (freelanceLive: LiveFreelanceSessionEntity) => freelanceLive.teacher
    )
    public freelanceLive: LiveFreelanceSessionEntity[];


    @OneToMany(
        () => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.teacher, {
            nullable: true,
        }
    )
    public homework: SchoolHomeworkEntity[];

    @OneToMany(
        () => SchoolHomeworkMarkEntity,
        (mark: SchoolHomeworkMarkEntity) => mark.teacher, {
            nullable: true,
        }
    )
    public mark: SchoolHomeworkMarkEntity[];

    @OneToMany(
        () => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.teacher,
        {
            nullable: true,
        }
    )
    public exam: SchoolExamEntity[];

    @OneToMany(() => SchoolFeedbackEntity,
        (feedback: SchoolFeedbackEntity) => feedback.teacher,
        {
            eager: false,
            cascade: true,
            nullable: false,
        })
    public feedback: SchoolFeedbackEntity[];

    @OneToMany(() => TimetableBlockFeedbackEntity,
        (blockFeedback: TimetableBlockFeedbackEntity) => blockFeedback.teacher,
        {
            eager: false,
            cascade: true,
            nullable: false,
        })
    public blockFeedback: TimetableBlockFeedbackEntity[];

    @OneToMany(() => SchoolLiveSession,
        (schoolLive: SchoolLiveSession) => schoolLive.teacher,
        {
            eager: false,
            cascade: true,
            nullable: false,
        })
    public schoolLive: SchoolLiveSession[];

    @OneToMany(() => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.teacher,
        {
            eager: false,
            cascade: true,
            nullable: false,
        })
    public schoolRecord: SchoolRecordSession[];

    @OneToMany(
        () => FreelanceFavourite,
        (favourite: FreelanceFavourite) => favourite.teacher,
        {
            eager: false,
            nullable: false,
        }
    )
    public favourite: FreelanceFavourite[]

    @OneToMany(
        () => FreelanceReviewEntity,
        (review: FreelanceReviewEntity) => review.teacher,
        {
            eager: false,
            nullable: false,
        }
    )
    public review: FreelanceReviewEntity[]


    /**
     * @ManyToMany
     * @FreelanceSubjectEntity
     * @SchoolDepartmentEntity
     * @YearGroupEntity
     * @FormGroupEntity
     * @ClassGroupEntity
     * @TimetableBlocksEntity
     */


    @ManyToMany(
        () => FreelanceSubjectEntity,
        (subjects: FreelanceSubjectEntity) => subjects.teacher,
        {
            eager: false,
            cascade: true,
            nullable: true,
        })
    @JoinTable()
    public subjects: FreelanceSubjectEntity[];

    @ManyToMany(() => SchoolDepartmentEntity,
        (department: SchoolDepartmentEntity) => department.teacher,
        {
            eager: false,
        })
    @JoinTable()
    public department: SchoolDepartmentEntity[];


    @ManyToMany(() => YearGroupEntity,
        (yearGroup: YearGroupEntity) => yearGroup.teacher,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public yearGroup: YearGroupEntity[];


    @ManyToMany(() => FormGroupEntity,
        (formGroup: FormGroupEntity) => formGroup.teacher,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public formGroup: FormGroupEntity[];

    @ManyToMany(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.teacher,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public classGroup: ClassGroupEntity[];

    @ManyToMany(() => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.teacher,
        {
            eager: false,
            nullable: true,
        })
    @JoinTable()
    public blocks: TimetableBlocksEntity[];


    @VirtualColumn()
    public favourites_count: string;

    @VirtualColumn()
    public profile_rating: string;

}

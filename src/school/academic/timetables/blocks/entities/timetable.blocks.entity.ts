import BaseTable from "../../../../../core/entity/base.entity";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {TimetableEntity} from "../../entities/timetable.entity";
import {TeacherEntity} from "../../../../../teacher/entities/teacher.entity";
import {StudentEntity} from "../../../../../student/entities/student.entity";
import {YearGroupEntity} from "../../../year-group/entities/year-group.entity";
import {SchoolDepartmentEntity} from "../../../department/entities/department.entity";
import {SchoolSubjectEntity} from "../../../subjects/entities/subject.entity";
import {ClassGroupEntity} from "../../../class-group/entities/class-group.entity";
import {FormGroupEntity} from "../../../form-group/entities/form-group.entity";
import {TimetableBlockFeedbackEntity} from "../block-feedback/entities/block-feedback.entity";
import {SchoolEntity} from "../../../../entities/school.entity";

@Entity()
export class TimetableBlocksEntity extends BaseTable {

    /**
     * @Column
     **/

    @Column()
    public name: string

    @Column('time', {name: 'start_time'})
    public start_time: Date

    @Column('time', {name: 'end_time'})
    public end_time: Date

    @Column()
    public week_day: string

    @Column({default: null})
    public location: string

    @Column({type: 'date'})
    public block_date: Date

    @Column()
    public block_date_start_time: Date

    @Column()
    public block_date_end_time: Date

    /**
     * @OneToMany
     * @TimetableBlockFeedbackEntity
     **/

    @OneToMany(
        () => TimetableBlockFeedbackEntity,
        (blockFeedback: TimetableBlockFeedbackEntity) => blockFeedback.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public blockFeedback: TimetableBlockFeedbackEntity[]


    /**
     * @ManyToOne
     * @TimetableEntity
     * @YearGroupEntity
     * @SchoolDepartmentEntity
     * @SchoolSubjectEntity
     * @ClassGroupEntity
     * @FormGroupEntity
     **/

    @ManyToOne(() => TimetableEntity,
        (timetable: TimetableEntity) => timetable.blocks,
    )
    public timetable: TimetableEntity

    @ManyToOne(() => YearGroupEntity,
        (yearGroup: YearGroupEntity) => yearGroup.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public yearGroup: YearGroupEntity

    @ManyToOne(() => SchoolDepartmentEntity,
        (department: SchoolDepartmentEntity) => department.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public department: SchoolDepartmentEntity

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public subject: SchoolSubjectEntity

    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity

    @ManyToOne(() => FormGroupEntity,
        (formGroup: FormGroupEntity) => formGroup.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public formGroup: FormGroupEntity


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.blocks,
        {
            eager: false,
            nullable: true,
        }
    )
    public school: SchoolEntity


    /**
     * @ManyToMany
     * @TeacherEntity
     * @StudentEntity
     **/

    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.blocks,
        {
            eager: false,
            nullable: false,
        })
    public teacher: TeacherEntity[]

    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.blocks,
        {
            eager: false,
            nullable: false,
        })
    public student: StudentEntity[]


}

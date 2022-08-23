import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {FEEDBACK_ENUM} from "../../utils/enum/enum.types";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import {SchoolSubjectEntity} from "../../school/academic/subjects/entities/subject.entity";
import {ClassGroupEntity} from "../../school/academic/class-group/entities/class-group.entity";
import {StudentEntity} from "../../student/entities/student.entity";

@Entity()
export class SchoolFeedbackEntity extends BaseTable {

    @Column("text")
    comment: string

    @Column({
        type: "enum",
        enum: FEEDBACK_ENUM,
        default: FEEDBACK_ENUM.NONE,
    })
    status: FEEDBACK_ENUM


    /**
     * @ManyToOne
     * @TeacherEntity
     * @SchoolSubjectEntity
     * @ClassGroupEntity
     */

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.feedback,
        {
            nullable: false,
        }
    )
    public teacher: TeacherEntity;

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.feedback,
        {
            nullable: true,
        }
    )
    public subject: SchoolSubjectEntity;

    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.feedback,
        {
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity;


    /**
     * @ManyToMany
     * @StudentEntity
     */

    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.feedback,
        {
            eager: false,
            nullable: false,
        })
    @JoinTable()
    public student: StudentEntity[]

}

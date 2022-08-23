import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {ClassGroupEntity} from "../../school/academic/class-group/entities/class-group.entity";
import {SchoolSubjectEntity} from "../../school/academic/subjects/entities/subject.entity";
import {StudentEntity} from "../../student/entities/student.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import BaseTable from "../../core/entity/base.entity";
import {SchoolTermsEntity} from "../../school/academic/terms/entities/term.entity";
import {SchoolExamResultEntity} from "./exam.results.entity";
import {VirtualColumn} from "../../utils/decorator/virtual-column";

@Entity()
export class SchoolExamEntity extends BaseTable {

    /**
     * @Column
     */
    @Column()
    public name: string

    @Column("text")
    public description: string

    @Column({type: "decimal", default: 0})
    public expected_average: number;

    /**
     * @OneToMany
     * @SchoolExamResultEntity
     */
    @OneToMany(
        () => SchoolExamResultEntity,
        (results: SchoolExamResultEntity) => results.exam,
        {
            eager: false,
            nullable: true,
        }
    )
    public results: SchoolExamResultEntity[]


    /**
     * @ManyToOne
     * @ClassGroupEntity
     * @SchoolSubjectEntity
     * @TeacherEntity
     * @SchoolTermsEntity
     */
    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.exam,
        {
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity;

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.exam,
        {
            nullable: true,
        }
    )
    public subject: SchoolSubjectEntity;

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.exam,
        {
            nullable: true,
        }
    )
    public teacher: TeacherEntity;

    @ManyToOne(() => SchoolTermsEntity,
        (terms: SchoolTermsEntity) => terms.exam,
        {
            nullable: true,
        }
    )
    public terms: SchoolTermsEntity;

    /**
     * @ManyToMany
     */
    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.exam,
        {
            eager: false,
            nullable: false,
        })

    @JoinTable()
    public student: StudentEntity[]


}

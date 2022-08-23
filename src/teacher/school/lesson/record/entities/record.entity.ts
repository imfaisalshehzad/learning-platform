import BaseTable from "../../../../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {TeacherEntity} from "../../../../entities/teacher.entity";
import {UploadEntity} from "../../../../../upload/entities/upload.entity";
import {SchoolSubjectEntity} from "../../../../../school/academic/subjects/entities/subject.entity";
import {ClassGroupEntity} from "../../../../../school/academic/class-group/entities/class-group.entity";
import {StudentEntity} from "../../../../../student/entities/student.entity";
import {SchoolEntity} from "../../../../../school/entities/school.entity";

@Entity()
export class SchoolRecordSession extends BaseTable {


    @Column()
    public name: string;

    @Column("text")
    public description: string;

    @Column("jsonb", {nullable: false, default: {}})
    public tags: object[];


    /**
     * @ManyToOne
     * @TeacherEntity
     * @SchoolSubjectEntity
     * @ClassGroupEntity
     ***/


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.schoolRecord,
        {}
    )
    public school: SchoolEntity;

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.schoolRecord,
        {}
    )
    public teacher: TeacherEntity;

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.schoolRecord,
        {}
    )
    @JoinTable()
    public subject: SchoolSubjectEntity

    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.schoolRecord,
        {
            nullable: true,
        }
    )
    @JoinTable()
    public classGroup: ClassGroupEntity[]


    /**
     * @ManyToMany
     * @UploadEntity
     * @StudentEntity
     ***/

    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.schoolRecord,
        {
            cascade: true,
            onDelete: "CASCADE"
        }
    )
    @JoinTable()
    public resource: UploadEntity[]

    @ManyToMany(() => StudentEntity,
        (student: StudentEntity) => student.schoolRecord,
        {
            nullable: true,
        }
    )
    @JoinTable()
    public student: StudentEntity[]

}

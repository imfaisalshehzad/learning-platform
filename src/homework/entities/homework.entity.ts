import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import {UploadEntity} from "../../upload/entities/upload.entity";
import {ClassGroupEntity} from "../../school/academic/class-group/entities/class-group.entity";
import {SchoolSubjectEntity} from "../../school/academic/subjects/entities/subject.entity";
import {StudentEntity} from "../../student/entities/student.entity";
import {SchoolHomeworkSubmissionsEntity} from "./homework.submissions.entity";
import {SchoolEntity} from "../../school/entities/school.entity";

@Entity()
export class SchoolHomeworkEntity extends BaseTable {

    @Column()
    public name: string

    @Column("text")
    public description: string

    @Column({type: 'date'})
    public due_date: Date

    @Column('time', {name: 'due_time'})
    public due_time: Date

    @Column()
    public due_date_time: Date

    //SchoolEntity
    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.homework,
        {
            nullable: true,
        }
    )
    public school: SchoolEntity;

    //TEACHER
    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.homework,
        {
            nullable: true,
        }
    )
    public teacher: TeacherEntity;

    //CLASS GROUP
    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.homework,
        {
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity;

    //SUBJECT
    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.homework,
        {
            nullable: true,
        }
    )
    public subject: SchoolSubjectEntity;

    //RESOURCES
    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.homework, {
            cascade: true,
            onDelete: "CASCADE"
        })
    @JoinTable()
    public resource: UploadEntity[]


    //STUDENT
    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.homework,
        {
            eager: false,
            nullable: false,
        })

    @JoinTable()
    public student: StudentEntity[]

    /* home work */
    @OneToMany(
        () => SchoolHomeworkSubmissionsEntity,
        (submissions: SchoolHomeworkSubmissionsEntity) => submissions.homework,
        {
            nullable: false,
        }
    )
    submissions: SchoolHomeworkSubmissionsEntity[]
    /* home work */


}

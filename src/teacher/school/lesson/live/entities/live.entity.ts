import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {UploadEntity} from "../../../../../upload/entities/upload.entity";
import {SchoolSubjectEntity} from "../../../../../school/academic/subjects/entities/subject.entity";
import BaseTable from "../../../../../core/entity/base.entity";
import {TeacherEntity} from "../../../../entities/teacher.entity";
import {StudentEntity} from "../../../../../student/entities/student.entity";
import {ClassGroupEntity} from "../../../../../school/academic/class-group/entities/class-group.entity";

@Entity()
export class SchoolLiveSession extends BaseTable {

    /**
     * @Column
     ***/

    @Column()
    public name: string;

    @Column("text")
    public description: string;

    @Column("jsonb", {nullable: false, default: {}})
    public tags: object[];

    @Column({type: 'date'})
    public session_date: Date;

    @Column()
    public session_start: Date;

    @Column()
    public session_end: Date;

    @Column('time', {name: 'start_time'})
    public start_time: Date;

    @Column('time', {name: 'end_time'})
    public end_time: Date;


    /**
     * @ManyToOne
     * @SchoolSubjectEntity
     * @ClassGroupEntity
     * @TeacherEntity
     ***/

    @ManyToOne(() => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.schoolLive,
        {
            nullable: true,
        }
    )
    @JoinTable()
    public subject: SchoolSubjectEntity

    @ManyToOne(() => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.schoolLive,
        {
            nullable: true,
        }
    )
    @JoinTable()
    public classGroup: ClassGroupEntity

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.schoolLive,
        {}
    )
    public teacher: TeacherEntity;


    /**
     * @ManyToMany
     * @UploadEntity
     * @SchoolSubjectEntity
     ***/

    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.schoolLive,
        {
            cascade: true,
            onDelete: "CASCADE"
        })
    @JoinTable()
    public resource: UploadEntity[]

    @ManyToMany(() => StudentEntity,
        (student: StudentEntity) => student.schoolLive,
        {}
    )
    @JoinTable()
    public student: StudentEntity[]


}

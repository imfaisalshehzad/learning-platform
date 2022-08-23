import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {SchoolSubjectEntity} from "../../subjects/entities/subject.entity";
import {TeacherEntity} from "../../../../teacher/entities/teacher.entity";
import {ClassGroupEntity} from "../../class-group/entities/class-group.entity";
import {TimetableBlocksEntity} from "../../timetables/blocks/entities/timetable.blocks.entity";


@Entity()
export class SchoolDepartmentEntity extends BaseTable {

    @Column()
    public name: string

    /***************ManyToOne***************/


    @OneToMany(
        () => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.department,
        {
            eager: false,
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity[]


    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.department,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity[]


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.department,
    )
    public school: SchoolEntity

    /***************ManyToMany***************/
    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.department,
        {
            eager: false,
        })
    public teacher: TeacherEntity[]

    @ManyToMany(
        () => SchoolSubjectEntity,
        (subject: SchoolSubjectEntity) => subject.department,
        {
            eager: false,
        })
    public subject: SchoolSubjectEntity[]


}

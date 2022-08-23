import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {TeacherEntity} from "../../../../teacher/entities/teacher.entity";
import BaseTable from "../../../../core/entity/base.entity";
import {FormGroupEntity} from "../../form-group/entities/form-group.entity";
import {ClassGroupEntity} from "../../class-group/entities/class-group.entity";
import {TimetableBlocksEntity} from "../../timetables/blocks/entities/timetable.blocks.entity";


@Entity()
export class YearGroupEntity extends BaseTable {

    @Column()
    public name: string

    /***************ManyToOne***************/

    @OneToMany(
        () => ClassGroupEntity,
        (classGroup: ClassGroupEntity) => classGroup.yearGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public classGroup: ClassGroupEntity[]


    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.yearGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity[]


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.yearGroup,
    )
    public school: SchoolEntity


    /***************ManyToMany***************/

    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.yearGroup,
        {
            eager: false,
            nullable: true,
        })
    public teacher: TeacherEntity[]


    @ManyToMany(
    () => FormGroupEntity,
        (formGroup: FormGroupEntity) => formGroup.yearGroup,
        {
            nullable: true,
        }
    )
    @JoinTable()
    public formGroup: FormGroupEntity[]


}

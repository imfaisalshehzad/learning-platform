import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {YearGroupEntity} from "../../year-group/entities/year-group.entity";
import {TeacherEntity} from "../../../../teacher/entities/teacher.entity";
import {StudentEntity} from "../../../../student/entities/student.entity";
import {TimetableBlocksEntity} from "../../timetables/blocks/entities/timetable.blocks.entity";

@Entity()
export class FormGroupEntity extends BaseTable{

    @Column()
    public name: string

    /**
     * @OneToMany
     * @TimetableBlocksEntity
     **/

    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.formGroup,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity[]


    /**
     * @ManyToOne
     * @SchoolEntity
     **/

    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.formGroup,
    )
    public school: SchoolEntity


    /**
     * @ManyToMany
     * @TeacherEntity
     * @StudentEntity
     * @YearGroupEntity
     **/

    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.formGroup,
        {
            eager: false,
            nullable: false,
        })
    public teacher: TeacherEntity[]


    @ManyToMany(
        () => StudentEntity,
        (student: StudentEntity) => student.formGroup,
        {
            eager: false,
            nullable: false,
        }
    )
    public student: StudentEntity[]


    @ManyToMany(
        () => YearGroupEntity,
        (yearGroup: YearGroupEntity) => yearGroup.formGroup,
        {
            nullable: true,
        }
    )
    public yearGroup: YearGroupEntity[]




}

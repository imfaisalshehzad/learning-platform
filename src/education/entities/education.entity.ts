import {Column, Entity, ManyToOne} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";

@Entity()
export class EducationEntity extends BaseTable{

    @Column()
    public school: string

    @Column()
    public qualification: string

    @Column()
    public study: string

    @Column()
    public startDate: Date

    @Column()
    public endDate: Date

    @ManyToOne(() => TeacherEntity, (teacher: TeacherEntity) => teacher.educations)
    public teacher: TeacherEntity;

}

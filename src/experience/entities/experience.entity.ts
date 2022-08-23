import {Column, Entity, ManyToOne} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";

@Entity()
export class ExperienceEntity extends BaseTable {


    @Column()
    public workplace: string


    @Column()
    public position: string


    @Column()
    public department: string


    @Column()
    public description: string


    @Column()
    public startDate: Date


    @Column()
    public endDate: Date


    @ManyToOne(() => TeacherEntity, (teacher: TeacherEntity) => teacher.experience)
    public teacher: TeacherEntity;


}

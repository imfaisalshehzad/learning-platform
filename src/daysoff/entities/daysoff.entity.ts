import {Column, Entity, ManyToOne, Unique} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";

@Entity()
@Unique(['date'])
@Unique("index_user_daysOff", ['date', 'teacher'])
export class DaysOffEntity extends BaseTable {

    @Column()
    public date: Date

    @ManyToOne(() => TeacherEntity, (teacher: TeacherEntity) => teacher.daysOff)
    public teacher: TeacherEntity;

}

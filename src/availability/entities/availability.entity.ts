import {Column, Entity, ManyToOne, Unique} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";

@Entity()
@Unique("uq_user_schedule", ["day", "start_time", "end_time", "teacher"])
export class AvailabilityEntity extends BaseTable {

    @Column()
    public day: string;

    @Column('time', {name: 'start_time'})
    public start_time: Date;

    @Column('time', {name: 'end_time'})
    public end_time: Date;

    @ManyToOne(() => TeacherEntity, (teacher: TeacherEntity) => teacher.availability)
    public teacher: TeacherEntity;


}

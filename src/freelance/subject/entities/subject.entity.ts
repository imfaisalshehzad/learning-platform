import {
    Column,
    Entity, ManyToMany,
} from "typeorm";
import BaseTable from "../../../core/entity/base.entity";
import {RecordFreelanceSessionEntity} from "../../record/entities/record.entity";
import {LiveFreelanceSessionEntity} from "../../live/entities/live.entity";
import {TeacherEntity} from "../../../teacher/entities/teacher.entity";

@Entity()
export class FreelanceSubjectEntity extends BaseTable {

    @Column({unique: true})
    public name: string

    @ManyToMany(
        () => RecordFreelanceSessionEntity,
        (record: RecordFreelanceSessionEntity) => record.subjects,
        {
            eager: false,
        })
    public record: RecordFreelanceSessionEntity[]

    @ManyToMany(
        () => LiveFreelanceSessionEntity,
        (freelanceLive: LiveFreelanceSessionEntity) => freelanceLive.subjects,
        {
            eager: false,
        }
    )
    public freelanceLive: LiveFreelanceSessionEntity[]

    @ManyToMany(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.subjects,
        {
            eager: false,
        })
    public teacher: TeacherEntity[]


}

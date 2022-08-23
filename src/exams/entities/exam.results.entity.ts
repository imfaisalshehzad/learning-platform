import {Column, Entity, ManyToOne} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {SchoolExamEntity} from "./exam.entity";
import {StudentEntity} from "../../student/entities/student.entity";


@Entity()
export class SchoolExamResultEntity extends BaseTable {

    @Column("text")
    public comment: string

    @Column({type: "decimal", default: 0})
    public percentage: number;


    @ManyToOne(() => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.results,
        {
            nullable: true,
        }
    )
    public exam: SchoolExamEntity;


    @ManyToOne(() => StudentEntity,
        (student: StudentEntity) => student.results,
        {
            nullable: true,
        }
    )
    public student: StudentEntity;


}

import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {SchoolExamEntity} from "../../../../exams/entities/exam.entity";

@Entity()
export class SchoolTermsEntity extends BaseTable{

    @Column()
    name: string

    /**
     * @ManyToOne
     **/

    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.terms,
        {
            nullable: true,
        }
    )
    public school: SchoolEntity;

    /**
     * @OneToMany
     **/

    @OneToMany(
        () => SchoolExamEntity,
        (exam: SchoolExamEntity) => exam.terms,
        {
            nullable: true,
        }
    )
    public exam: SchoolExamEntity[];


}

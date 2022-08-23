import {Column, Entity, ManyToOne} from "typeorm";
import BaseTable from "../../../core/entity/base.entity";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";
import {Expose} from "class-transformer";
import {StudentEntity} from "../../../student/entities/student.entity";
import {TeacherEntity} from "../../../teacher/entities/teacher.entity";

@Entity()
export class FreelanceReviewEntity extends BaseTable {

    @Column("text")
    public description;

    @Column({type: "decimal", default: 0})
    public rating: number;

    @Column({
        type: "enum",
        enum: FREELANCE_FAVOURITE,
        default: FREELANCE_FAVOURITE.NONE,
    })
    @Expose()
    public type: FREELANCE_FAVOURITE

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.TRUE,
    })
    public status: ENUM_ACTIVE

    /**
     * @ManyToOne
     * @StudentEntity
     * @TeacherEntity
     * @RecordFreelanceSessionEntity
     */

    @ManyToOne(() => StudentEntity,
        (student: StudentEntity) => student.review,
        {}
    )
    public student: StudentEntity;

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.review,
        {}
    )
    public teacher: TeacherEntity;

    //@todo purchased table relation goes here

}

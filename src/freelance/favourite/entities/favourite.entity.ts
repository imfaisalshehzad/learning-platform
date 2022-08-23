import BaseTable from "../../../core/entity/base.entity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";
import {RecordFreelanceSessionEntity} from "../../record/entities/record.entity";
import {StudentEntity} from "../../../student/entities/student.entity";
import {LiveFreelanceSessionEntity} from "../../live/entities/live.entity";
import {TeacherEntity} from "../../../teacher/entities/teacher.entity";

@Entity()
export class FreelanceFavourite extends BaseTable {

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public is_favourite: ENUM_ACTIVE

    @Column({
        type: "enum",
        enum: FREELANCE_FAVOURITE,
        default: FREELANCE_FAVOURITE.NONE,
    })
    public type: FREELANCE_FAVOURITE

    /**
     * @ManyToOne
     * @RecordFreelanceSessionEntity
     * @LiveFreelanceSessionEntity
     * @StudentEntity
     * @TeacherEntity
     */

    @ManyToOne(() => RecordFreelanceSessionEntity,
        (freelanceRecord: RecordFreelanceSessionEntity) => freelanceRecord.favourite,
        {
            nullable: true,
        }
    )
    @JoinColumn()
    public freelanceRecord: RecordFreelanceSessionEntity;

    @ManyToOne(() => LiveFreelanceSessionEntity,
        (freelanceLive: LiveFreelanceSessionEntity) => freelanceLive.favourite,
        {
            nullable: true,
        }
    )
    @JoinColumn()
    public freelanceLive: LiveFreelanceSessionEntity;

    @ManyToOne(() => StudentEntity,
        (student: StudentEntity) => student.favourite,
        {
            nullable: true,
        }
    )
    @JoinColumn()
    public student: StudentEntity;

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.favourite,
        {
            nullable: true,
        }
    )
    @JoinColumn()
    public teacher: TeacherEntity;


}

import BaseTable from "../../../../../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {FEEDBACK_ENUM, REGISTER_ATTENDANCE_ENUM} from "../../../../../../utils/enum/enum.types";
import {TimetableBlocksEntity} from "../../entities/timetable.blocks.entity";
import {StudentEntity} from "../../../../../../student/entities/student.entity";
import {TeacherEntity} from "../../../../../../teacher/entities/teacher.entity";

@Entity()
export class TimetableBlockFeedbackEntity extends BaseTable {

    /**
     * @Column
     **/

    @Column("text", {default: null})
    public comment: string

    @Column({
        type: "enum",
        enum: FEEDBACK_ENUM,
        default: FEEDBACK_ENUM.NONE,
    })
    public status: FEEDBACK_ENUM

    @Column({
        type: "enum",
        enum: REGISTER_ATTENDANCE_ENUM,
        default: REGISTER_ATTENDANCE_ENUM.NONE,
    })
    public attendance: REGISTER_ATTENDANCE_ENUM

    /**
     * @ManyToOne
     * @TimetableBlocksEntity
     * @TeacherEntity
     * @StudentEntity
     **/

    @ManyToOne(() => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.blockFeedback,
        {
            eager: false,
            nullable: true,
        }
    )
    public blocks: TimetableBlocksEntity


    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.blockFeedback,
        {
            eager: false,
            nullable: true,
        }
    )
    public teacher: TeacherEntity

    /**
     * @ManyToMany
     * @StudentEntity
     **/

    @ManyToMany(() => StudentEntity,
        (student: StudentEntity) => student.blockFeedback,
        {
            eager: false,
            nullable: true,
        }
    )
    @JoinTable()
    public student: StudentEntity[]


}

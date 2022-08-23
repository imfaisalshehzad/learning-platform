import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, ManyToOne} from "typeorm";
import {SchoolHomeworkSubmissionsEntity} from "./homework.submissions.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import {ENUM_ACTIVE} from "../../utils/enum/enum.types";

@Entity()
export class SchoolHomeworkMarkEntity extends BaseTable {

    @Column("text")
    public teacherComment: string

    @Column({
        type:"boolean",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public status: ENUM_ACTIVE

    @ManyToOne(() => SchoolHomeworkSubmissionsEntity,
        (submissions: SchoolHomeworkSubmissionsEntity) => submissions.mark,
        {
            nullable: true,
        }
    )
    public submissions: SchoolHomeworkSubmissionsEntity;

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.mark,
        {
            nullable: true,
        }
    )
    public teacher: TeacherEntity;




}

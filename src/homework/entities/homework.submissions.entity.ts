import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {SchoolHomeworkEntity} from "./homework.entity";
import {SchoolHomeworkMarkEntity} from "./homework.mark.entity";
import {StudentEntity} from "../../student/entities/student.entity";
import {ENUM_ACTIVE} from "../../utils/enum/enum.types";
import {UploadEntity} from "../../upload/entities/upload.entity";

@Entity()
export class SchoolHomeworkSubmissionsEntity extends BaseTable {

    @Column("text")
    public studentComment: string

    @Column()
    public submitted: Date

    @Column({
        type: "boolean",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public handIn: ENUM_ACTIVE

    @OneToMany(
        () => SchoolHomeworkMarkEntity,
        (mark: SchoolHomeworkMarkEntity) => mark.submissions,
        {
            nullable: true,
        }
    )
    mark: SchoolHomeworkMarkEntity[]

    @ManyToOne(() => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.submissions,
        {
            nullable: true,
        }
    )
    public homework: SchoolHomeworkEntity;

    @ManyToOne(() => StudentEntity,
        (student: StudentEntity) => student.submissions,
        {
            nullable: true,
        }
    )
    public student: StudentEntity;

    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.submission,
        {
            cascade: true,
            onDelete: "CASCADE"
        })
    @JoinTable()
    public resource: UploadEntity[]

}

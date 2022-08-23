import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import BaseTable from "../../../core/entity/base.entity";
import {FreelanceSubjectEntity} from "../../subject/entities/subject.entity";
import {UploadEntity} from "../../../upload/entities/upload.entity";
import {TeacherEntity} from "../../../teacher/entities/teacher.entity";
import {ENUM_ACTIVE} from "../../../utils/enum/enum.types";
import {FreelanceFavourite} from "../../favourite/entities/favourite.entity";
import {VirtualColumn} from "../../../utils/decorator/virtual-column";

@Entity()
export class RecordFreelanceSessionEntity extends BaseTable {

    @Column()
    public name: string;

    @Column({type: "decimal", default: 0})
    public price: number;

    @Column("text")
    public description: string;

    @Column("jsonb", {nullable: false, default: {}})
    public tags: object[];

    @Column({
        type: "boolean",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public isApproved: ENUM_ACTIVE

    /**
     * @OneToMany
     * @FreelanceFavourite
     */

    @OneToMany(
        () => FreelanceFavourite,
        (favourite: FreelanceFavourite) => favourite.freelanceRecord,
        {
            nullable: true,
        }
    )
    public favourite: FreelanceFavourite[]


    /**
     * @ManyToOne
     * @TeacherEntity
     */

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.record,
        {}
    )
    public teacher: TeacherEntity;


    /**
     * @ManyToMany
     * @FreelanceSubjectEntity
     * @UploadEntity
     */


    @ManyToMany(() => FreelanceSubjectEntity,
        (subjects: FreelanceSubjectEntity) => subjects.record,
        {}
    )
    @JoinTable()
    public subjects: FreelanceSubjectEntity[]

    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.record,
        {
            cascade: true,
            onDelete: "CASCADE"
        }
    )
    @JoinTable()
    public resource: UploadEntity[]

    @VirtualColumn()
    public teacher_favourites_count: string

    @VirtualColumn()
    public teacher_profile_count: string

}

import BaseTable from "../../../core/entity/base.entity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {FreelanceSubjectEntity} from "../../subject/entities/subject.entity";
import {UploadEntity} from "../../../upload/entities/upload.entity";
import {Expose} from "class-transformer";
import {LIVE_SESSION_TYPE} from "../../../utils/enum/enum.types";
import {FreelanceReviewEntity} from "../../reviews/entities/review.entity";
import {TeacherEntity} from "../../../teacher/entities/teacher.entity";
import {FreelanceFavourite} from "../../favourite/entities/favourite.entity";


@Entity()
export class LiveFreelanceSessionEntity extends BaseTable {

    @Column({
        type: "enum",
        enum: LIVE_SESSION_TYPE,
        default: LIVE_SESSION_TYPE.PUBLIC,
    })
    @Expose()
    public type: LIVE_SESSION_TYPE

    @Column({type: 'date'})
    public session_date: Date;

    @Column()
    public session_start: Date;

    @Column()
    public session_end: Date;

    @Column('time', {name: 'start_time'})
    public start_time: Date;

    @Column('time', {name: 'end_time'})
    public end_time: Date;

    @Column()
    public name: string;

    @Column({default: 0})
    public number_of_students: number;

    @Column({type: "decimal", default: 0})
    public price: number;

    @Column("text")
    public description: string;

    @Column("jsonb", {nullable: false, default: {}})
    public tags: object[];

    @ManyToOne(() => TeacherEntity,
        (teacher: TeacherEntity) => teacher.freelanceLive,
        {}
    )
    public teacher: TeacherEntity;

    /**
     * @OneToMany
     * @FreelanceFavourite
     */

    @OneToMany(
        () => FreelanceFavourite,
        (favourite: FreelanceFavourite) => favourite.freelanceLive,
        {
            eager: false,
            nullable: false,
        }
    )
    public favourite: FreelanceFavourite[]

    /**
     * @ManyToMany
     * @FreelanceSubjectEntity
     * @UploadEntity
     * @FreelanceReviewEntity
     */

    @ManyToMany(() => FreelanceSubjectEntity,
        (subjects: FreelanceSubjectEntity) => subjects.freelanceLive,
        {}
    )
    @JoinTable()
    public subjects: FreelanceSubjectEntity[]

    @ManyToMany(() => UploadEntity,
        (resource: UploadEntity) => resource.freelanceLive,
        {
            cascade: true,
            onDelete: "CASCADE"
        })
    @JoinTable()
    public resource: UploadEntity[]



}

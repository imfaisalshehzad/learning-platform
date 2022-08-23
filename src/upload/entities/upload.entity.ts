import {Column, Entity, ManyToMany} from "typeorm";
import BaseTable from "../../core/entity/base.entity";
import {Expose} from "class-transformer";
import {RecordFreelanceSessionEntity} from "../../freelance/record/entities/record.entity";
import {LiveFreelanceSessionEntity} from "../../freelance/live/entities/live.entity";
import {SchoolHomeworkEntity} from "../../homework/entities/homework.entity";
import {SchoolHomeworkSubmissionsEntity} from "../../homework/entities/homework.submissions.entity";
import {SchoolLiveSession} from "../../teacher/school/lesson/live/entities/live.entity";
import {SchoolRecordSession} from "../../teacher/school/lesson/record/entities/record.entity";

export enum UPLOAD_TYPE {
    RESOURCES = "RESOURCES",
    COVER_IMAGE = "COVER_IMAGE",
}

export enum SESSION_TYPE {
    RECORDED = "RECORDED",
    LIVE = "LIVE",
    HOMEWORK = "HOMEWORK",
    EXAM = "EXAM",
}

export enum PROFILE_TYPE {
    FREELANCE = "FREELANCE",
    SCHOOL = "SCHOOL",
}


@Entity()
export class UploadEntity extends BaseTable {

    @Column({
        type: "enum",
        enum: UPLOAD_TYPE,
        default: UPLOAD_TYPE.RESOURCES,
    })
    @Expose()
    public type: UPLOAD_TYPE

    @Column({
        type: "enum",
        enum: SESSION_TYPE,
        default: SESSION_TYPE.RECORDED,
    })
    @Expose()
    public session: SESSION_TYPE

    @Column({
        type: "enum",
        enum: PROFILE_TYPE,
        default: PROFILE_TYPE.FREELANCE,
    })
    @Expose()
    public profile: PROFILE_TYPE

    @Column({type: "text"})
    public file: string;

    @Column()
    public originalName: string

    @Column()
    public mimetype: string

    @Column()
    public size: number

    /**
     * @ManyToMany
     * @Freelance
     * @RecordFreelanceSessionEntity
     * @LiveFreelanceSessionEntity
     ***/

    @ManyToMany(() => RecordFreelanceSessionEntity,
        (record: RecordFreelanceSessionEntity) => record.resource,
        {}
    )
    public record: RecordFreelanceSessionEntity[]

    @ManyToMany(() => LiveFreelanceSessionEntity,
        (freelanceLive: LiveFreelanceSessionEntity) => freelanceLive.resource,
        {}
    )
    public freelanceLive: LiveFreelanceSessionEntity[]


    /**
     * @ManyToMany
     * @School
     * @SchoolLiveSession
     * @SchoolRecordSession
     * @SchoolHomeworkEntity
     * @SchoolHomeworkSubmissionsEntity
     ***/

    @ManyToMany(() => SchoolLiveSession,
        (schoolLive: SchoolLiveSession) => schoolLive.resource,
        {}
    )
    public schoolLive: SchoolLiveSession[]


    @ManyToMany(() => SchoolRecordSession,
        (schoolRecord: SchoolRecordSession) => schoolRecord.resource,
        {}
    )
    public schoolRecord: SchoolRecordSession[]


    @ManyToMany(() => SchoolHomeworkEntity,
        (homework: SchoolHomeworkEntity) => homework.resource,
        {}
    )
    public homework: SchoolHomeworkEntity[]

    @ManyToMany(() => SchoolHomeworkSubmissionsEntity,
        (submission: SchoolHomeworkSubmissionsEntity) => submission.resource,
        {}
    )
    public submission: SchoolHomeworkSubmissionsEntity[]


}

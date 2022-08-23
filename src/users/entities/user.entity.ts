import {
    Column,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
    OneToMany,
    OneToOne,
} from "typeorm";
import {Exclude, Expose} from "class-transformer";
import {AddressEntity} from "./address.entity";
import {PostEntity} from "../../post/entities/post.entity";
import BaseTable from "../../core/entity/base.entity";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";
import {StudentEntity} from "../../student/entities/student.entity";
import {ENUM_ACTIVE, USER_ROLE} from "../../utils/enum/enum.types";
import {SchoolEntity} from "../../school/entities/school.entity";
import {RoleEntity} from "../../roles/entities/role.entity";


@Entity()
export class UserEntity extends BaseTable {

    @Column({
        unique: true
    })
    @Expose()
    public email: string;

    @Expose()
    @Column()
    public name: string

    @Exclude()
    @Column()
    public password: string

    @Column({
        type: "enum",
        enum: USER_ROLE,
    })
    @Expose()
    public role: USER_ROLE

    @Column({default: null})
    @Expose()
    public phone: string;

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public isPhoneNumberConfirmed: ENUM_ACTIVE

    @Column({
        nullable: true
    })
    @Exclude()
    public currentHashedRefreshToken?: string;

    @Column({default: null, type: "text"})
    public about: string

    @Column({
        type: "enum",
        enum: ENUM_ACTIVE,
        default: ENUM_ACTIVE.FALSE,
    })
    public isActive: ENUM_ACTIVE

    @OneToOne(() => AddressEntity, {
        eager: false,
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    public address: AddressEntity

    @OneToOne(() => TeacherEntity, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    public teacher: TeacherEntity

    @OneToOne(() => StudentEntity, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    public student: StudentEntity

    @OneToOne(() => SchoolEntity, {
        eager: false,
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    public school: SchoolEntity

    @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
    public posts: PostEntity[];

    @ManyToMany(() => RoleEntity, (profile: RoleEntity) => profile.user, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    public profile: RoleEntity[]


    constructor(partial: Partial<UserEntity>) {
        super();
        Object.assign(this, partial)
    }
}

import BaseTable from "../../core/entity/base.entity";
import {Column, Entity, ManyToMany} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";

@Entity()
export class RoleEntity extends BaseTable {

    @Column({unique: true})
    public name: string

    @ManyToMany(() => UserEntity, (user: UserEntity) => user.profile)
    public user: UserEntity[]


}

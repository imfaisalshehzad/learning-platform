import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "./user.entity";
import BaseTable from "../../core/entity/base.entity";

@Entity()
export class AddressEntity extends BaseTable {

    @Column()
    public street: string

    @Column()
    public city: string

    @Column()
    public country: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updateAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @OneToOne(() => UserEntity, (user: UserEntity) => user.address)
    public user: UserEntity

}

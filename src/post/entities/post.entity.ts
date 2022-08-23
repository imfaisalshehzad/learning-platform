import {
    Column,
    Entity, JoinTable, ManyToMany,
    ManyToOne,
} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {CategoryEntity} from "../../categories/entities/category.entity";
import BaseTable from "../../core/entity/base.entity";

@Entity()
export class PostEntity extends BaseTable {

    @Column()
    public title: string;

    @Column()
    public content: string;

    @Column({default: false})
    isActive: boolean;

    @ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
    public author: UserEntity;

    @ManyToMany(() => CategoryEntity, (category: CategoryEntity) => category.posts)
    @JoinTable()
    public categories: CategoryEntity[]
}

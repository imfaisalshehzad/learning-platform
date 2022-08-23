import {
    Column,
    Entity, ManyToMany,
} from "typeorm";
import {PostEntity} from "../../post/entities/post.entity";
import BaseTable from "../../core/entity/base.entity";

@Entity()
export class CategoryEntity extends BaseTable {

    @Column({unique: true})
    public name: string

    @Column()
    public slug: string

    @ManyToMany(() => PostEntity, (post: PostEntity) => post.categories)
    public posts: PostEntity[]

}

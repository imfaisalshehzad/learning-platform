import {BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";


abstract class BaseTable extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updateAt: Date

    @DeleteDateColumn()
    public deletedAt: Date


}


export default BaseTable;

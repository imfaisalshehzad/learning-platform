import BaseTable from "../../../../core/entity/base.entity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {SchoolEntity} from "../../../entities/school.entity";
import {TimetableBlocksEntity} from "../blocks/entities/timetable.blocks.entity";

@Entity()
export class TimetableEntity extends BaseTable {

    @Column()
    public name: string


    @ManyToOne(() => SchoolEntity,
        (school: SchoolEntity) => school.timetable,
    )
    public school: SchoolEntity


    @OneToMany(
        () => TimetableBlocksEntity,
        (blocks: TimetableBlocksEntity) => blocks.timetable,
        {}
    )
    public blocks: TimetableBlocksEntity[]



}

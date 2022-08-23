import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateTimetableDto} from './dto/create-timetable.dto';
import {UpdateTimetableDto} from './dto/update-timetable.dto';
import {UserEntity} from "../../../users/entities/user.entity";
import {Between, FindManyOptions, MoreThan, Repository} from "typeorm";
import {TimetableEntity} from "./entities/timetable.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";
import {getStartEndDates} from "../../../utils/functions/utils.function";
import {ClassGroupEntity} from "../class-group/entities/class-group.entity";

@Injectable()
export class TimetablesService {

    private db_relations = [
        'blocks',
        'blocks.yearGroup',
        'blocks.department',
        'blocks.subject',
        'blocks.classGroup',
        'blocks.teacher',
        'blocks.teacher.user',
        'blocks.student',
        'blocks.student.user',
    ]

    constructor(
        @InjectRepository(TimetableEntity) private timetableRepository: Repository<TimetableEntity>,
    ) {
    }

    async create(createTimetableDto: CreateTimetableDto, user: UserEntity) {
        const timetable = await this.timetableRepository.create({
            ...createTimetableDto,
            school: user
        });
        await this.timetableRepository.save(timetable).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );
        return timetable;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        from?: string,
        to?: string,
        options?: FindManyOptions<TimetableEntity>
    ) {
        const where: FindManyOptions<TimetableEntity>['where'] = {
            school: {
                id: user.id
            }
        }

        let separateCount = 0;
        /* order by */
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order: FindManyOptions<TimetableEntity>['order'] = {
            [orderKey]: `${sort}`,
            blocks: {
                id: "DESC"
            }
        }
        /* order by */

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.timetableRepository.count();
        }


        const getDates = getStartEndDates(from, to);
        where.blocks = {
            block_date_start_time: Between(getDates.start_date, getDates.end_date)
        };

        const [items, count] = await this.timetableRepository.findAndCount({
            where,
            relations: this.db_relations,
            order,
            skip: offset,
            take: limit,
            ...options
        });

        return {
            items,
            total: page ? separateCount : count
        }
    }

    async findOne(
        id: number,
        sort_order?: string,
        order_by?: string,
        from?: string,
        to?: string,
    ) {
        /* order by */
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order: FindManyOptions<TimetableEntity>['order'] = {
            blocks: {
                [orderKey]: `${sort}`,
            }
        }
        /* order by */

        const where: FindManyOptions<ClassGroupEntity>['where'] = {id}
        const getDates = getStartEndDates(from, to);
        where.blocks = {
            block_date_start_time: Between(getDates.start_date, getDates.end_date)
        };

        const timetable = await this.timetableRepository.findOne({
            where,
            order,
            relations: this.db_relations,
        });
        if (!timetable) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return timetable;
    }

    async update(id: number, updateTimetableDto: UpdateTimetableDto, user: UserEntity) {
        try {
            const updateQuery = {...updateTimetableDto, user, id}
            const preloadQuery = await this.timetableRepository.preload(updateQuery);
            await this.timetableRepository.save(preloadQuery);
            const get = await this.timetableRepository.findOne({
                where: {
                    id,
                },
                relations: this.db_relations,
            });
            return get;

        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number, user: UserEntity) {
        const deleteResponse = await this.timetableRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", {id: id})
            .andWhere("schoolId = :school", {school: user.id})
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };

    }

}

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateBlockDto} from './dto/create-block.dto';
import {UpdateBlockDto} from './dto/update-block.dto';
import moment from "moment";
import {InjectRepository} from "@nestjs/typeorm";
import {Between, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {TimetableBlocksEntity} from "./entities/timetable.blocks.entity";
import {UserEntity} from "../../../../users/entities/user.entity";
import {getStartEndDates, stringToArray} from "../../../../utils/functions/utils.function";
import {PostgresErrorHandling} from "../../../../utils/postgresErrorHandling";
import {CloneBlockDto} from "./dto/clone-block.dto";
import {WEEK_DAYS} from "../../../../utils/enum/enum.types";

@Injectable()
export class BlocksService {
    private db_relations = [
        'timetable',

        'yearGroup',
        'formGroup',

        'classGroup',

        'department',
        'subject',

        'teacher',
        'teacher.user',

        'student',
        'student.user',
    ]

    constructor(
        @InjectRepository(TimetableBlocksEntity)
        private timetableBlocksRepository: Repository<TimetableBlocksEntity>,
    ) {}

    async create(createBlockDto: CreateBlockDto, user: UserEntity) {
        const date = createBlockDto.block_date;
        const time_start = createBlockDto.start_time;
        const time_end = createBlockDto.end_time;
        const event_start = moment(date + ' ' + time_start);
        const event_end = moment(date + ' ' + time_end);

        const block = await this.timetableBlocksRepository.create({
            ...createBlockDto,
            block_date_start_time: event_start,
            block_date_end_time: event_end,
            school: user
        });

        const row = await this.timetableBlocksRepository.save(block)
            .then(function (data) {
                return data;
            })
            .catch(
                function (error) {
                    throw new HttpException(
                        'Record already found.',
                        HttpStatus.BAD_REQUEST
                    );
                }
            );

        return await this.findOne(row.id);
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        timetable?: string,
        from?: string,
        to?: string,
        options?: FindManyOptions<TimetableBlocksEntity>
    ) {
        const where: FindManyOptions<TimetableBlocksEntity>['where'] = {}

        let separateCount = 0;
        let order = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        let ordering = {[order]: `${sort}`}

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.timetableBlocksRepository.count();
        }

        if (timetable) {
            const array = stringToArray(timetable, ',')
            where.timetable = {
                id: In(array)
            }
        }

        const getDates = getStartEndDates(from, to);
        where.block_date_start_time = Between(getDates.start_date, getDates.end_date);

        const [items, count] = await this.timetableBlocksRepository.findAndCount({
            where,
            relations: this.db_relations,
            order: ordering,
            skip: offset,
            take: limit,
            ...options
        });

        return {
            items,
            total: page ? separateCount : count
        }
    }

    async findOne(id: number) {

        const block = await this.timetableBlocksRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!block) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }

        return block;

    }

    async update(id: number, updateBlockDto: UpdateBlockDto) {
        const record = await this.timetableBlocksRepository.findOneOrFail({
            where: {id},
        }).catch(function (error) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        });

        try {
            let tempTeacher = []
            let tempStudent = []

            //delete teachers
            if (updateBlockDto?.teacher) {
                const record = await this.timetableBlocksRepository.findOneOrFail({
                    where: {id},
                    relations: ['teacher']
                });
                record?.teacher?.map(function (data) {
                    tempTeacher.push(data.id)
                });

                await this.timetableBlocksRepository
                    .createQueryBuilder()
                    .relation('teacher')
                    .of(record)
                    .remove(tempTeacher)
            }

            //delete students
            if (updateBlockDto?.student) {
                const record = await this.timetableBlocksRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.timetableBlocksRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }


            let updateQuery = {
                ...updateBlockDto,
                id
            }

            if (updateBlockDto.block_date && updateBlockDto.start_time && updateBlockDto.end_time) {
                const date = updateBlockDto.block_date;
                const time_start = updateBlockDto.start_time;
                const time_end = updateBlockDto.end_time;
                const event_start = moment(date + ' ' + time_start).toISOString();
                const event_end = moment(date + ' ' + time_end).toISOString();
                updateQuery = {
                    ...updateBlockDto,
                    block_date_start_time: event_start,
                    block_date_end_time: event_end,
                    id
                }
            }

            const preloadQuery = await this.timetableBlocksRepository.preload(updateQuery);
            await this.timetableBlocksRepository.save(preloadQuery);
            const get = await this.timetableBlocksRepository.findOne({
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

    async remove(id: number) {

        const deleteResponse = await this.timetableBlocksRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", {id: id})
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };

    }


    async clone(cloneBlockDto: CloneBlockDto) {
        const blocksArray = cloneBlockDto.blocks;
        const repeatOption = cloneBlockDto.repeat;
        const startDate = cloneBlockDto.start_date;
        const endDate = cloneBlockDto.end_date;
        const tempIds = [];
        blocksArray.map(function (data) {
            tempIds.push(data['id'])
        });

        const blocks = await this.timetableBlocksRepository.find({
            where: {
                id: In(tempIds)
            },
            relations: this.db_relations,
        });


        if (blocks.length > 0) {
            let result = [];

            const items = blocks.map(function (data) {
                delete data.id;
                delete data.createdAt;
                delete data.updateAt;
                delete data.deletedAt;

                const week_day = data.week_day;
                let index = WEEK_DAYS[`${week_day}`]
                let start = moment(startDate),
                    end = moment(endDate),
                    start_time_update = data.start_time,
                    end_time_update = data.end_time,
                    day = index;

                let current = start.clone();
                let clone_date;
                let event_start;
                let event_end;


                if (repeatOption === 'weekly') {
                    while (current.day(7 + day).isBefore(end)) {

                        clone_date = current.clone().format("YYYY-MM-DD");
                        event_start = moment(clone_date + ' ' + start_time_update);
                        event_end = moment(clone_date + ' ' + end_time_update);

                        data.name = `${data.name}`;
                        data.block_date = clone_date;
                        data.block_date_start_time = event_start.toDate();
                        data.block_date_end_time = event_end.toDate();

                        result.push(data);

                    }
                } else if (repeatOption === 'alternate') {
                    while (current.day(14 + day).isBefore(end)) {

                        clone_date = current.clone().format("YYYY-MM-DD");
                        event_start = moment(clone_date + ' ' + start_time_update);
                        event_end = moment(clone_date + ' ' + end_time_update);

                        data.name = `${data.name}`;
                        data.block_date = clone_date;
                        data.block_date_start_time = event_start.toDate();
                        data.block_date_end_time = event_end.toDate();

                        result.push(data);

                    }
                }

                return result;

            });//map

            if (items[0].length > 0) {
                const cloneBlock = await this.timetableBlocksRepository.create(items[0]);
                const saveClone = await this.timetableBlocksRepository.save(cloneBlock);
                return saveClone;
            } else {
                throw new HttpException("Error while doing clone.", HttpStatus.BAD_REQUEST)
            }

        } else {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

    }
}

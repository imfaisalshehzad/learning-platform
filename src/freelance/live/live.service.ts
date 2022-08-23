import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateLiveDto} from './dto/create-live.dto';
import {UpdateLiveDto} from './dto/update-live.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {LiveFreelanceSessionEntity} from "./entities/live.entity";
import {Between, FindManyOptions, MoreThan, Repository, In} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../utils/postgresErrorHandling";
import moment from "moment";
import {stringToArray} from "../../utils/functions/utils.function";


@Injectable()
export class LiveService {

    private db_relations: object = [
        'subjects',
        'resource'
    ];

    constructor(
        @InjectRepository(LiveFreelanceSessionEntity)
        private liveFreelanceRepo: Repository<LiveFreelanceSessionEntity>
    ) {}

    async create(createLiveDto: CreateLiveDto, user: UserEntity) {
        const date = createLiveDto.session_date;
        const time_start = createLiveDto.start_time;
        const time_end = createLiveDto.end_time;
        const session_start = moment(date + ' ' + time_start);
        const session_end = moment(date + ' ' + time_end);
        try {
            const record = await this.liveFreelanceRepo.create({
                ...createLiveDto,
                session_end,
                session_start,
                teacher: user.teacher,
            });

            await this.liveFreelanceRepo.save(record);
            return record;

        } catch (error) {
            PostgresErrorHandling(error)
        }
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        order_by?: string,
        sort_order?: string,
        from?: string,
        to?: string,
        subject?: string,
        options?: FindManyOptions<LiveFreelanceSessionEntity>
    ) {

        try {
            const where: FindManyOptions<LiveFreelanceSessionEntity>['where'] = {

            }

            let separateCount = 0;
            let order = (order_by) ? order_by : 'id';
            let sort = (sort_order) ? sort_order : 'desc';
            let ordering = {[order]: `${sort}`}

            if (page) {
                where.id = MoreThan(page)
                separateCount = await this.liveFreelanceRepo.count();
            }

            if (from && to) {
                const from_date = moment(from).startOf("day").toDate();
                const to_date = moment(to).endOf("day").toDate();
                where.session_start = Between(from_date, to_date);
            } else {
                const current_time = moment().toDate();
                where.session_start = MoreThan(current_time);

            }

            if (subject) {
                const array = stringToArray(subject, ',')
                where.subjects = {
                    id: In(array)
                }
            }

            const [items, count] = await this.liveFreelanceRepo.findAndCount({
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
        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async findOne(id: number, user: UserEntity) {
        const session = await this.liveFreelanceRepo.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!session) {
            throw new HttpException('Session not found.', HttpStatus.BAD_REQUEST)
        }
        return session
    }

    async update(id: number, updateLiveDto: UpdateLiveDto, user: UserEntity) {
        try {
            const date = updateLiveDto.session_date;
            const time_start = updateLiveDto.start_time;
            const time_end = updateLiveDto.end_time;
            const session_start = moment(date + ' ' + time_start).toISOString();
            const session_end = moment(date + ' ' + time_end).toISOString();
            const preloadQuery = await this.liveFreelanceRepo.preload({
                ...updateLiveDto,
                session_start,
                session_end,
                teacher: user.teacher,
                id
            });
            await this.liveFreelanceRepo.save(preloadQuery)
            return await this.liveFreelanceRepo.findOne({
                where: {id,},
                relations: this.db_relations,
            })
        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number, user: UserEntity) {
        const deleteSession = await this.liveFreelanceRepo.delete({
            id,
            teacher: {
                id: user.teacher.id
            }
        });
        if (!deleteSession.affected) {
            throw new HttpException("Session not found", HttpStatus.BAD_REQUEST);
        }
    }
}

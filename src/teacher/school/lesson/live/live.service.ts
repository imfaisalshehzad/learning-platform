import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateLiveDto} from './dto/create-live.dto';
import {UpdateLiveDto} from './dto/update-live.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolLiveSession} from "./entities/live.entity";
import {Between, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../../../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../../../utils/postgresErrorHandling";
import {joinDateAndTime, stringToArray} from "../../../../utils/functions/utils.function";
import moment from "moment";

@Injectable()
export class SchoolLiveService {

    private db_relations = [
        'subject',
        'classGroup',
        'teacher',
        'resource',
        'student',
    ]

    constructor(
        @InjectRepository(SchoolLiveSession) private schoolLiveRepository: Repository<SchoolLiveSession>,
    ) {}

    async create(createLiveDto: CreateLiveDto, user: UserEntity) {

        const date = createLiveDto.session_date;
        const time_start = createLiveDto.start_time;
        const time_end = createLiveDto.end_time;
        const session_start = joinDateAndTime(date, time_start);
        const session_end = joinDateAndTime(date, time_end);

        try {
            const record = await this.schoolLiveRepository.create({
                ...createLiveDto,
                session_end,
                session_start,
                teacher: user.teacher,
            });

            const result = await this.schoolLiveRepository.save(record);
            return await this.findOne(result.id);

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
        options?: FindManyOptions<SchoolLiveSession>
    ) {

        try {
            const where: FindManyOptions<SchoolLiveSession>['where'] = {}
            let separateCount = 0;
            let order = (order_by) ? order_by : 'id';
            let sort = (sort_order) ? sort_order : 'desc';
            let ordering = {[order]: `${sort}`}

            if (page) {
                where.id = MoreThan(page)
                separateCount = await this.schoolLiveRepository.count();
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
                where.subject = {
                    id: In(array)
                }
            }

            const [items, count] = await this.schoolLiveRepository.findAndCount({
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

    async findOne(id: number) {
        const session = await this.schoolLiveRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!session) {
            throw new HttpException('Session not found.', HttpStatus.BAD_REQUEST)
        }
        return session;
    }

    async update(id: number, updateLiveDto: UpdateLiveDto, user: UserEntity) {

        try {
            let tempStudent = []
            let date,
                query,
                time_start,
                time_end,
                session_start,
                session_end;

            //delete students
            if (updateLiveDto?.student) {
                const record = await this.schoolLiveRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.schoolLiveRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            query = {
                ...updateLiveDto,
                teacher: user.teacher,
                id,
            }

            if (updateLiveDto.session_date && updateLiveDto.start_time && updateLiveDto.end_time) {
                date = updateLiveDto.session_date;
                time_start = updateLiveDto.start_time;
                time_end = updateLiveDto.end_time;
                session_start = joinDateAndTime(date, time_start);
                session_end = joinDateAndTime(date, time_end);

                query = {
                    ...updateLiveDto,
                    session_start,
                    session_end,
                    teacher: user.teacher,
                    id
                }
            }

            const preloadQuery = await this.schoolLiveRepository.preload(query);
            await this.schoolLiveRepository.save(preloadQuery)
            return await this.schoolLiveRepository.findOne({
                where: {id,},
                relations: this.db_relations,
            })
        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number, user: UserEntity) {
        const deleteSession = await this.schoolLiveRepository.delete({
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

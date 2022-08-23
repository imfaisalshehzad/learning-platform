import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateSchoolRecordDto} from './dto/create-record.dto';
import {UpdateSchoolRecordDto} from './dto/update-record.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Equal, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {SchoolRecordSession} from "./entities/record.entity";
import {UserEntity} from "../../../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../../../utils/postgresErrorHandling";
import {stringToArray} from "../../../../utils/functions/utils.function";
import {UsersService} from "../../../../users/users.service";

@Injectable()
export class SchoolRecordSessionService {

    private db_relations = [
        'subject',
        'classGroup',
        'resource',
        'student',
        'teacher',
    ]

    constructor(
        @InjectRepository(SchoolRecordSession)
        private recordSchoolRepository: Repository<SchoolRecordSession>,
        private userServices: UsersService,
    ) {}

    async create(createRecordDto: CreateSchoolRecordDto, user: UserEntity) {

        const loggedIn = await this.userServices.getTeacherOrStudent(user);

        try {
            const record = await this.recordSchoolRepository.create({
                ...createRecordDto,
                teacher: loggedIn?.teacher,
                school: loggedIn?.teacher?.school
            });
            await this.recordSchoolRepository.save(record);
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
        options?: FindManyOptions<SchoolRecordSession>,
    ) {
        const loggedIn = await this.userServices.getTeacherOrStudent(user);
        try {
            const where: FindManyOptions<SchoolRecordSession>['where'] = {
                teacher: { id: Equal(loggedIn?.teacher?.id) },
                school: { id: Equal(loggedIn?.teacher?.school?.id) }
            }

            let separateCount = 0;
            let order = (order_by) ? order_by : 'id';
            let sort = (sort_order) ? sort_order : 'desc';
            let ordering = {[order]: `${sort}`}

            if (page) {
                where.id = MoreThan(page)
                separateCount = await this.recordSchoolRepository.count();
            }

            if (subject) {
                const array = stringToArray(subject, ',')
                where.subject = {
                    id: In(array)
                }
            }

            const [items, count] = await this.recordSchoolRepository.findAndCount({
                where,
                order: ordering,
                skip: offset,
                take: limit,
                relations: this.db_relations,
                ...options
            });

            return {
                items,
                total: page ? separateCount : count
            }

        } catch (e) {
            PostgresErrorHandling(e)
        }

    }

    async findOne(id: number, user: UserEntity) {
        const loggedIn = await this.userServices.getTeacherOrStudent(user);
        const record = await this.recordSchoolRepository.findOne({
            where: {
                id,
                teacher: { id: Equal(loggedIn?.teacher?.id) },
                school: { id: Equal(loggedIn?.teacher?.school?.id) }
            },
            relations: this.db_relations,
        });
        if (!record) {
            throw new HttpException('Session not found.', HttpStatus.BAD_REQUEST)
        }
        return record;

    }

    async update(id: number, updateRecordDto: UpdateSchoolRecordDto, user: UserEntity) {
        const loggedIn = await this.userServices.getTeacherOrStudent(user);

        try {
            let tempStudent = []

            //delete students
            if (updateRecordDto?.student) {
                const record = await this.recordSchoolRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.recordSchoolRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            const updateQuery = {...updateRecordDto, user, id}
            const preloadQuery = await this.recordSchoolRepository.preload(updateQuery);
            await this.recordSchoolRepository.save(preloadQuery);
            const get = await this.recordSchoolRepository.findOne({
                where: {
                    id,
                    teacher: { id: Equal(loggedIn?.teacher?.id) },
                    school: { id: Equal(loggedIn?.teacher?.school?.id) }
                },
                relations: this.db_relations,
            });
            return get;

        } catch (e) {
            PostgresErrorHandling(e);
        }

    }

    async remove(id: number, user: UserEntity) {
        const loggedIn = await this.userServices.getTeacherOrStudent(user);
        const deleteSession = await this.recordSchoolRepository.delete({
            id,
            teacher: { id: Equal(loggedIn?.teacher?.id) },
            school: { id: Equal(loggedIn?.teacher?.school?.id) }
        });
        if (!deleteSession.affected) {
            throw new HttpException("Session not found", HttpStatus.BAD_REQUEST);
        }
    }
}

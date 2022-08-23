import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateFeedbackDto} from './dto/create-feedback.dto';
import {UpdateFeedbackDto} from './dto/update-feedback.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolFeedbackEntity} from "./entities/feedback.entity";
import {Equal, FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";
import {FEEDBACK_ENUM, WEEK_DAYS} from "../utils/enum/enum.types";

@Injectable()
export class FeedbackService {

    private db_relation = [
        'teacher',
        'subject',
        'classGroup',
        'student',
        'student.user',
    ]

    constructor(
        @InjectRepository(SchoolFeedbackEntity)
        private feedbackRepository: Repository<SchoolFeedbackEntity>,
        private userService: UsersService
    ) {
    }

    async create(createFeedbackDto: CreateFeedbackDto, user: UserEntity) {
        const loggedIn = await this.userService.getTeacherOrStudent((user));
        const feedback = await this.feedbackRepository.create({
            ...createFeedbackDto,
            teacher: loggedIn.teacher,
        });

        await this.feedbackRepository.save(feedback);
        return feedback;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        status?: string,
        options?: FindManyOptions<SchoolFeedbackEntity>
    ) {
        const where: FindManyOptions<SchoolFeedbackEntity>['where'] = {}

        let separateCount = 0;
        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.feedbackRepository.count();
        }

        if (status){
            let value = status.toUpperCase()
            where.status = Equal(FEEDBACK_ENUM[`${value}`])
        }

        const [items, count] = await this.feedbackRepository.findAndCount({
            where,
            relations: this.db_relation,
            order: {
                id: "DESC"
            },
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
        const feedback = await this.feedbackRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relation,
        });

        if (!feedback) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return feedback
    }

    async update(id: number, updateFeedbackDto: UpdateFeedbackDto, user: UserEntity) {
        const record = await this.feedbackRepository.findOneOrFail({
            where: {id},
            relations: ['student'],
        }).catch(function (error) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        });

        try {
            let tempStudent = []

            //delete students
            if (updateFeedbackDto?.student) {
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.feedbackRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            let updateQuery = {...updateFeedbackDto, id}

            const preloadQuery = await this.feedbackRepository.preload(updateQuery);
            await this.feedbackRepository.save(preloadQuery)
            const get = await this.findOne(id);
            return get;

        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number, user: UserEntity) {
        const deleteRow = await this.feedbackRepository.delete({
            id,
        });

        if (!deleteRow.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

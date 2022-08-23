import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateBlockFeedbackDto} from './dto/create-block-feedback.dto';
import {UpdateBlockFeedbackDto} from './dto/update-block-feedback.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Equal, FindManyOptions, MoreThan, Repository} from "typeorm";
import {TimetableBlockFeedbackEntity} from "./entities/block-feedback.entity";
import {UserEntity} from "../../../../../users/entities/user.entity";
import {UsersService} from "../../../../../users/users.service";
import {PostgresErrorHandling} from "../../../../../utils/postgresErrorHandling";
import {REGISTER_ATTENDANCE_ENUM} from "../../../../../utils/enum/enum.types";

@Injectable()
export class TimetableBlockFeedbackService {
    private db_relations = [
        'blocks',
        'student',
    ]

    constructor(
        @InjectRepository(TimetableBlockFeedbackEntity)
        private blockFeedbackRepository: Repository<TimetableBlockFeedbackEntity>,
        private userService: UsersService,
    ) {}

    async create(createBlockFeedbackDto: CreateBlockFeedbackDto, user: UserEntity) {
        const loggedIn = await this.userService.getTeacherOrStudent(user);
        const blockFeedback = await this.blockFeedbackRepository.create({
            ...createBlockFeedbackDto,
            teacher: loggedIn?.teacher,
        });

        const row = await this.blockFeedbackRepository.save(blockFeedback)
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

        return row;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        status?: string,
        options?: FindManyOptions<TimetableBlockFeedbackEntity>
    ) {
        const where: FindManyOptions<TimetableBlockFeedbackEntity>['where'] = {}

        let separateCount = 0;
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order: FindManyOptions<TimetableBlockFeedbackEntity>['order'] = {
            [orderKey]: `${sort}`,
        }

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.blockFeedbackRepository.count();
        }

        if (status) {
            status = status.toUpperCase()
            let value = REGISTER_ATTENDANCE_ENUM[`${status}`]
            where.attendance = Equal(value)
        }

        const [items, count] = await this.blockFeedbackRepository.findAndCount({
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

    async findOne(id: number) {
        const block = await this.blockFeedbackRepository.findOne({
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

    async update(id: number, updateBlockFeedbackDto: UpdateBlockFeedbackDto) {
        const record = await this.blockFeedbackRepository.findOneOrFail({
            where: {id},
            relations: ['student']
        }).catch(function (error) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        });

        try {
            let tempStudent = []

            //delete students
            if (updateBlockFeedbackDto?.student) {
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.blockFeedbackRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            const preloadQuery = await this.blockFeedbackRepository.preload({
                ...updateBlockFeedbackDto,
                id
            });
            await this.blockFeedbackRepository.save(preloadQuery);
            return await this.findOne(id);

        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number) {
        const deleteResponse = await this.blockFeedbackRepository
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
}

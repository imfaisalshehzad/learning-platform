import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateClassGroupDto} from './dto/create-class-group.dto';
import {UpdateClassGroupDto} from './dto/update-class-group.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {ClassGroupEntity} from "./entities/class-group.entity";
import {UserEntity} from "../../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";
import {getStartEndDates, stringToArray} from "../../../utils/functions/utils.function";

@Injectable()
export class ClassGroupService {

    private db_relations = [
        'blocks',
        'yearGroup',
        'department',
        'subject',
        'teacher',
        'teacher.user',
        'student',
        'student.user',
    ]

    constructor(
        @InjectRepository(ClassGroupEntity)
        private classGroupRepository: Repository<ClassGroupEntity>,
    ) {
    }

    async create(createClassGroupDto: CreateClassGroupDto, user: UserEntity) {
        const classGroup = await this.classGroupRepository.create({
            ...createClassGroupDto,
            school: user
        });

        await this.classGroupRepository.save(classGroup).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return classGroup;
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
        subject?: string,
        options?: FindManyOptions<ClassGroupEntity>
    ) {

        let separateCount = 0;

        const where: FindManyOptions<ClassGroupEntity>['where'] = {}
        if(from && to){
            const getDates = getStartEndDates(from, to);
            where.blocks = {
                block_date_start_time: Between(getDates.start_date, getDates.end_date)
            };
        }

        if(subject){
            const array = stringToArray(subject, ',')
            where.subject = {
                id: In(array)
            }
        }

        /* order by */
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order: FindManyOptions<ClassGroupEntity>['order'] = {
            [orderKey]: `${sort}`,
            blocks: {
                id: "DESC"
            }
        }
        /* order by */

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.classGroupRepository.count();
        }

        const [items, count] = await this.classGroupRepository.findAndCount({
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
        from?: string,
        to?: string,
        options?: FindManyOptions<ClassGroupEntity>
    ) {

        const where: FindManyOptions<ClassGroupEntity>['where'] = {
            id,
        }

        const getDates = getStartEndDates(from, to);
        where.blocks = {
            block_date_start_time: Between(getDates.start_date, getDates.end_date)
        };

        /* order by */
        const order: FindManyOptions<ClassGroupEntity>['order'] = {
            blocks: {
                id: "DESC"
            }
        }
        /* order by */

        const classGroup = await this.classGroupRepository.findOne({
            where,
            order,
            relations: this.db_relations,
            ...options
        });

        if (!classGroup) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return classGroup;
    }

    async update(id: number, updateClassGroupDto: UpdateClassGroupDto, user: UserEntity) {

        try {
            let tempTeacher = []
            let tempStudent = []

            //delete teachers
            if (updateClassGroupDto?.teacher) {
                const record = await this.classGroupRepository.findOneOrFail({
                    where: {id},
                    relations: ['teacher']
                });
                record?.teacher?.map(function (data) {
                    tempTeacher.push(data.id)
                });

                await this.classGroupRepository
                    .createQueryBuilder()
                    .relation('teacher')
                    .of(record)
                    .remove(tempTeacher)
            }

            //delete students
            if (updateClassGroupDto?.student) {
                const record = await this.classGroupRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.classGroupRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            const updateQuery = {...updateClassGroupDto, user, id}
            const preloadQuery = await this.classGroupRepository.preload(updateQuery);
            await this.classGroupRepository.save(preloadQuery);
            const get = await this.classGroupRepository.findOne({
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

        const deleteResponse = await this.classGroupRepository
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

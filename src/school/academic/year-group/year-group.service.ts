import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateYearGroupDto} from './dto/create-year-group.dto';
import {UpdateYearGroupDto} from './dto/update-year-group.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {YearGroupEntity} from "./entities/year-group.entity";
import {UserEntity} from "../../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";

@Injectable()
export class YearGroupService {

    private db_relations = [
        'formGroup',
        'formGroup.teacher',
        'formGroup.teacher.user',

        'formGroup.student',
        'formGroup.student.user',

        'teacher',
        'teacher.user',
    ]

    constructor(
        @InjectRepository(YearGroupEntity)
        private yearGroupRepository: Repository<YearGroupEntity>,
    ) {}

    async create(createYearGroupDto: CreateYearGroupDto, user: UserEntity) {

        const yearGroup = await this.yearGroupRepository.create({
            ...createYearGroupDto,
            school: user
        });

        await this.yearGroupRepository.save(yearGroup).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );
        return yearGroup;

    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        options?: FindManyOptions<YearGroupEntity>
    ) {
        const where: FindManyOptions<YearGroupEntity>['where'] = {
            school:{
                id: user.id
            }
        }

        let separateCount = 0;
        let order = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        let ordering = {[order]: `${sort}`}

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.yearGroupRepository.count();
        }

        const [items, count] = await this.yearGroupRepository.findAndCount({
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
        const yearGroup = await this.yearGroupRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!yearGroup) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return yearGroup;
    }

    async update(id: number, updateYearGroupDto: UpdateYearGroupDto, user: UserEntity) {

        try {
            let temp = []
            if(updateYearGroupDto?.teacher){
                const record = await this.yearGroupRepository.findOneOrFail({
                    where: {id},
                    relations:['teacher']
                });
                record?.teacher?.map(function (data) {
                    temp.push(data.id)
                });

                await this.yearGroupRepository
                    .createQueryBuilder()
                    .relation('teacher')
                    .of(record)
                    .remove(temp)

            }
            const updateQuery = {...updateYearGroupDto, user, id}
            const preloadQuery = await this.yearGroupRepository.preload(updateQuery);
            await this.yearGroupRepository.save(preloadQuery);
            const get = await this.yearGroupRepository.findOne({
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

        const deleteResponse = await this.yearGroupRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", { id: id })
            .andWhere("schoolId = :school", { school: user.id })
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };
    }
}

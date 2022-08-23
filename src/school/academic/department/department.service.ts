import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {UserEntity} from "../../../users/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolDepartmentEntity} from "./entities/department.entity";
import {Between, FindManyOptions, MoreThan, Repository} from "typeorm";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";
import {getStartEndDates} from "../../../utils/functions/utils.function";

@Injectable()
export class DepartmentService {
    private db_relations = [
        'teacher',
        'teacher.user',
        'subject',
        'classGroup',
        'classGroup.blocks',

    ]
    constructor(
        @InjectRepository(SchoolDepartmentEntity)
        private departmentRepository: Repository<SchoolDepartmentEntity>,
    ) {}

    async create(createDepartmentDto: CreateDepartmentDto, user: UserEntity) {
        const department = await this.departmentRepository.create({
            ...createDepartmentDto,
            school: user
        });

        await this.departmentRepository.save(department).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );
        return department;
    }

    async findAll(
        user: UserEntity,
        offset?:number,
        limit?:number,
        page?:number,
        sort_order?:string,
        order_by?:string,
        from?: string,
        to?: string,
        options?: FindManyOptions<SchoolDepartmentEntity>
    ) {
        const where: FindManyOptions<SchoolDepartmentEntity>['where'] = {
            school:{
                id: user.id
            }
        }

        let separateCount = 0;

        /* order by */
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order : FindManyOptions<SchoolDepartmentEntity>['order'] = {
            [orderKey]: `${sort}`,
            classGroup: {
                blocks:{
                    id: "DESC"
                }
            }
        }
        /* order by */

        const getDates = getStartEndDates(from, to);
        where.classGroup = {
            blocks:{
                block_date_start_time: Between(getDates.start_date, getDates.end_date)
            }
        };

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.departmentRepository.count();
        }

        const [items, count] = await this.departmentRepository.findAndCount({
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
        sort_order?:string,
        order_by?:string,
        from?: string,
        to?: string,
    ) {

        const where: FindManyOptions<SchoolDepartmentEntity>['where'] = {id}
        /* order by */
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order : FindManyOptions<SchoolDepartmentEntity>['order'] = {
            classGroup: {
                blocks:{
                    [orderKey]: `${sort}`,
                }
            }
        }
        /* order by */
        const getDates = getStartEndDates(from, to);
        where.classGroup = {
            blocks:{
                block_date_start_time: Between(getDates.start_date, getDates.end_date)
            }
        };

        const department = await this.departmentRepository.findOne({
            where,
            relations: this.db_relations,
            order,
        });

        if (!department) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return department;

    }

    async update(id: number, updateDepartmentDto: UpdateDepartmentDto, user: UserEntity) {

        try {
            let temp = []
            if(updateDepartmentDto?.teacher){
                const record = await this.departmentRepository.findOneOrFail({
                    where: {id},
                    relations:['teacher']
                });
                record?.teacher?.map(function (data) {
                    temp.push(data.id)
                });

                await this.departmentRepository
                    .createQueryBuilder()
                    .relation('teacher')
                    .of(record)
                    .remove(temp)

            }
            const updateQuery = {...updateDepartmentDto, user, id}
            const preloadQuery = await this.departmentRepository.preload(updateQuery);
            await this.departmentRepository.save(preloadQuery);
            const get = await this.departmentRepository.findOne({
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
        const deleteResponse = await this.departmentRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }
    }

}

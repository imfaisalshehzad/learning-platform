import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateFormGroupDto} from './dto/create-form-group.dto';
import {UpdateFormGroupDto} from './dto/update-form-group.dto';
import {UserEntity} from "../../../users/entities/user.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {FormGroupEntity} from "./entities/form-group.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";

@Injectable()
export class FormGroupService {

    private db_relations = [
        'yearGroup',
        'yearGroup.teacher',
        'yearGroup.teacher.user',

        'teacher',
        'teacher.user',

        'student',
        'student.user',
    ]

    constructor(
        @InjectRepository(FormGroupEntity)
        private formGroupRepository: Repository<FormGroupEntity>,
    ) {}


    async create(createFormGroupDto: CreateFormGroupDto, user: UserEntity) {

        const formGroup = await this.formGroupRepository.create({
            ...createFormGroupDto,
            school: user
        });

        await this.formGroupRepository.save(formGroup).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return formGroup;

    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        options?: FindManyOptions<FormGroupEntity>
    ) {

        const where: FindManyOptions<FormGroupEntity>['where'] = {
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
            separateCount = await this.formGroupRepository.count();
        }

        const [items, count] = await this.formGroupRepository.findAndCount({
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

    async findOne(id: number, user: UserEntity) {
        const formGroup = await this.formGroupRepository.findOne({
            where: {
                id,
                school:{
                    id: user.id
                }
            },
            relations: this.db_relations,
        });

        if (!formGroup) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return formGroup;
    }

    async update(id: number, updateFormGroupDto: UpdateFormGroupDto, user: UserEntity) {

        try {
            let tempTeacher = []
            let tempStudent = []
            let tempYearGroup = []

            //delete teachers
            if(updateFormGroupDto?.teacher){
                const record = await this.formGroupRepository.findOneOrFail({
                    where: {id},
                    relations:['teacher']
                });
                record?.teacher?.map(function (data) {
                    tempTeacher.push(data.id)
                });

                await this.formGroupRepository
                    .createQueryBuilder()
                    .relation('teacher')
                    .of(record)
                    .remove(tempTeacher)
            }

            //delete students
            if(updateFormGroupDto?.student){
                const record = await this.formGroupRepository.findOneOrFail({
                    where: {id},
                    relations:['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.formGroupRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            //delete year group
            if(updateFormGroupDto?.yearGroup){
                const record = await this.formGroupRepository.findOneOrFail({
                    where: {id},
                    relations:['yearGroup']
                });
                record?.yearGroup?.map(function (data) {
                    tempYearGroup.push(data.id)
                });

                await this.formGroupRepository
                    .createQueryBuilder()
                    .relation('yearGroup')
                    .of(record)
                    .remove(tempYearGroup)
            }

            const updateQuery = {...updateFormGroupDto, user, id}
            const preloadQuery = await this.formGroupRepository.preload(updateQuery);
            await this.formGroupRepository.save(preloadQuery);
            const get = await this.formGroupRepository.findOne({
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

        const deleteResponse = await this.formGroupRepository
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

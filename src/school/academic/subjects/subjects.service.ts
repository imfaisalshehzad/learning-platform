import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateSubjectDto} from './dto/create-subject.dto';
import {UpdateSubjectDto} from './dto/update-subject.dto';
import {UserEntity} from "../../../users/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolSubjectEntity} from "./entities/subject.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {PostgresErrorHandling} from "../../../utils/postgresErrorHandling";

@Injectable()
export class SubjectsService {
    private db_relations = [
        'department',
        'department.teacher',
        'department.teacher.user',
        'department.teacher.user.profile',
    ]
    constructor(
        @InjectRepository(SchoolSubjectEntity)
        private subjectRepository: Repository<SchoolSubjectEntity>
    ) {}

    async create(createSubjectDto: CreateSubjectDto, user: UserEntity) {
        const subject = await this.subjectRepository.create({
            ...createSubjectDto,
            school: user
        });

        await this.subjectRepository.save(subject).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );
        return subject;
    }

    async findAll(
        user: UserEntity,
        offset?:number,
        limit?:number,
        page?:number,
        sort_order?:string,
        order_by?:string,
        options?: FindManyOptions<SchoolSubjectEntity>
    ) {
        const where: FindManyOptions<SchoolSubjectEntity>['where'] = {
            // school:{
            //     id: user.id
            // }
        }

        let separateCount = 0;
        let order = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        let ordering = {[order]: `${sort}`}

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.subjectRepository.count();
        }

        const [items, count] = await this.subjectRepository.findAndCount({
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
        const department = await this.subjectRepository.findOne({
            relations: this.db_relations,
            where: {
                id,
            },
        });

        if (!department) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return department;
    }

    async update(id: number, updateSubjectDto: UpdateSubjectDto, user: UserEntity) {
        try {
            let temp = []
            if(updateSubjectDto?.department){
                const findSubject = await this.subjectRepository.findOneOrFail({
                    where: {id},
                    relations: ['department']
                });
                findSubject?.department?.map(function (data) {
                    temp.push(data.id)
                });

                await this.subjectRepository
                    .createQueryBuilder()
                    .relation('department')
                    .of(findSubject)
                    .remove(temp)

            }
            const updateQuery = {...updateSubjectDto, user, id}
            const preloadQuery = await this.subjectRepository.preload(updateQuery);
            await this.subjectRepository.save(preloadQuery);
            const getSubject = await this.subjectRepository.findOne({
                where: {
                    id,
                },
                relations: this.db_relations,
            });
            return getSubject;

        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number) {
        const deleteResponse = await this.subjectRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }
    }
}

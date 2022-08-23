import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateSubjectDto} from './dto/create-subject.dto';
import {UpdateSubjectDto} from './dto/update-subject.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FreelanceSubjectEntity} from "./entities/subject.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";

@Injectable()
export class FreelanceSubjectService {

    private db_relations = [
       "teacher"
    ]

    constructor(
        @InjectRepository(FreelanceSubjectEntity)
        private subjectRepository: Repository<FreelanceSubjectEntity>
    ) {}

    async create(createSubjectDto: CreateSubjectDto, user: UserEntity) {
        const subject = await this.subjectRepository.create({
            ...createSubjectDto,
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
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        options?: FindManyOptions<FreelanceSubjectEntity>,
    ) {
        const where: FindManyOptions<FreelanceSubjectEntity>['where'] = {}

        let separateCount = 0;
        let order = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        let ordering = { [order]: `${sort}`}

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

    async findOne(id: number, user: UserEntity) {
        const subject = await this.subjectRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!subject) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return subject
    }

    async update(id: number, updateSubjectDto: UpdateSubjectDto, user: UserEntity) {
        const update = await this.subjectRepository.update({
                id,
            },
            updateSubjectDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.subjectRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        })
    }

    async remove(id: number, user: UserEntity) {
        const deleteSubject = await this.subjectRepository.delete({
            id,
        });
        if (!deleteSubject.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

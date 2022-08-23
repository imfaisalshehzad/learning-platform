import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateEducationDto} from './dto/create-education.dto';
import {UpdateEducationDto} from './dto/update-education.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {EducationEntity} from "./entities/education.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

@Injectable()
export class EducationService {

    private db_relations = []

    constructor(
        @InjectRepository(EducationEntity)
        private educationRepository: Repository<EducationEntity>,
    ) {}

    async create(createEducationDto: CreateEducationDto, user: UserEntity) {
        const education = await this.educationRepository.create({
            ...createEducationDto,
            teacher: user.teacher,
        });
        await this.educationRepository.save(education);
        return education;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<EducationEntity>,
    ) {
        const where: FindManyOptions<EducationEntity>['where'] = {
            'teacher': {
                id: user.id
            }
        };
        let separateCount = 0;

        if (page) {
            where.id = MoreThan(page);
            separateCount = await this.educationRepository.count();
        }


        const [items, count] = await this.educationRepository.findAndCount({
            where,
            order: {
                id: "DESC",
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

    async findOne(id: number, user: UserEntity) {
        const education = await this.educationRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
        });

        if (!education) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return education
    }

    async update(id: number, updateEducationDto: UpdateEducationDto, user: UserEntity) {
        const update = await this.educationRepository.update({
                id,
                teacher: {
                    id: user.id
                }
            },
            updateEducationDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.educationRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
        })
    }

    async remove(id: number, user: UserEntity) {
        const deleteRow = await this.educationRepository.delete({
            id,
            teacher: {
                id: user.id
            }
        });

        if (!deleteRow.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

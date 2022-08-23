import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateExperienceDto} from './dto/create-experience.dto';
import {UpdateExperienceDto} from './dto/update-experience.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ExperienceEntity} from "./entities/experience.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

@Injectable()
export class ExperienceService {

    constructor(
        @InjectRepository(ExperienceEntity)
        private experienceRepository: Repository<ExperienceEntity>
    ) {}

    async create(createExperienceDto: CreateExperienceDto, user: UserEntity) {
        const experience = await this.experienceRepository.create({
            ...createExperienceDto,
            teacher: user.teacher,
        });

        await this.experienceRepository.save(experience);
        return experience;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<ExperienceEntity>
    ) {
        const where: FindManyOptions<ExperienceEntity>['where'] = {
            teacher: {
                id: user.id
            }
        }

        let separateCount = 0;
        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.experienceRepository.count();
        }

        const [items, count] = await this.experienceRepository.findAndCount({
            where,
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

    async findOne(id: number, user: UserEntity) {
        const experience = await this.experienceRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
            relations: ['user']
        });

        if (!experience) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return experience
    }

    async update(id: number, updateExperienceDto: UpdateExperienceDto, user: UserEntity) {
        const update = await this.experienceRepository.update({
                id,
                teacher: {
                    id: user.id
                }
            },
            updateExperienceDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.experienceRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
            relations: ['user']
        })
    }

    async remove(id: number, user: UserEntity) {
        const deleteRow = await this.experienceRepository.delete({
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

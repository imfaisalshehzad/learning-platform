import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateDaysOffDto} from './dto/create-daysoff.dto';
import {UpdateDaysOffDto} from './dto/update-daysoff.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DaysOffEntity} from "./entities/daysoff.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

@Injectable()
export class DaysOffService {

    private db_relations = []
    constructor(
        @InjectRepository(DaysOffEntity)
        private daysOffRepository: Repository<DaysOffEntity>,
    ) {}


    async create(createDaysOffDto: CreateDaysOffDto, user: UserEntity) {
        const daysOff = await this.daysOffRepository.create({
            ...createDaysOffDto,
            teacher: user.teacher,
        });

        await this.daysOffRepository.save(daysOff).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );
        return daysOff;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<DaysOffEntity>,
    ) {
        const where: FindManyOptions<DaysOffEntity>['where'] = {
            teacher: {
                id: user.id
            }
        }

        let separateCount = 0;

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.daysOffRepository.count();
        }

        const [items, count] = await this.daysOffRepository.findAndCount({
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
        const daysOff = await this.daysOffRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
            relations: ['user']
        });

        if (!daysOff) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return daysOff;
    }

    async update(id: number, updateDaysOffDto: UpdateDaysOffDto, user: UserEntity) {
        const update = await this.daysOffRepository.update({
                id,
                teacher: {
                    id: user.id
                }
            },
            updateDaysOffDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.daysOffRepository.findOne({
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
        const daysOff = await this.daysOffRepository.delete({
            id,
            teacher: {
                id: user.id
            }
        });
        if (!daysOff.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

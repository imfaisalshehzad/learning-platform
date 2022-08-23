import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateAvailabilityDto} from './dto/create-availability.dto';
import {UpdateAvailabilityDto} from './dto/update-availability.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {AvailabilityEntity} from "./entities/availability.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

@Injectable()
export class AvailabilityService {

    private db_relations = []
    constructor(
        @InjectRepository(AvailabilityEntity)
        private availabilityRepository: Repository<AvailabilityEntity>,
    ) {}

    async create(createAvailabilityDto: CreateAvailabilityDto, user: UserEntity) {
        const availability = await this.availabilityRepository.create({
            ...createAvailabilityDto,
            teacher: user.teacher,
        });

        await this.availabilityRepository.save(availability).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return availability;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<AvailabilityEntity>
    ) {
        const where: FindManyOptions<AvailabilityEntity>['where'] = {
            teacher: {
                id: user.id
            }
        }

        let separateCount = 0;

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.availabilityRepository.count();
        }

        const [items, count] = await this.availabilityRepository.find({
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
        const availability = await this.availabilityRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
        });

        if (!availability) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return availability
    }

    async update(id: number, updateAvailabilityDto: UpdateAvailabilityDto, user: UserEntity) {
        const update = await this.availabilityRepository.update({
                id,
                teacher: {
                    id: user.id
                }
            },
            updateAvailabilityDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.availabilityRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.id
                }
            },
        })
    }

    async remove(id: number, user: UserEntity) {
        const deleteAvailability = await this.availabilityRepository.delete({
            id,
            teacher: {
                id: user.id
            }
        });
        if (!deleteAvailability.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateTermDto} from './dto/create-term.dto';
import {UpdateTermDto} from './dto/update-term.dto';
import {UserEntity} from "../../../users/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolTermsEntity} from "./entities/term.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {ClassGroupEntity} from "../class-group/entities/class-group.entity";

@Injectable()
export class TermsService {

    private db_relations = [
        'school',
    ]

    constructor(@InjectRepository(SchoolTermsEntity) private termsRepository: Repository<SchoolTermsEntity>) {}

    async create(createTermDto: CreateTermDto, user: UserEntity) {
        const terms = await this.termsRepository.create({
            ...createTermDto,
            school: user,
        });

        await this.termsRepository.save(terms).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return terms;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        options?: FindManyOptions<SchoolTermsEntity>
    ) {
        const where: FindManyOptions<SchoolTermsEntity>['where'] = {
            school: {
                id: user.id
            }
        }

        let separateCount = 0;
        let orderKey = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        const order: FindManyOptions<ClassGroupEntity>['order'] = {
            [orderKey]: `${sort}`,
        }

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.termsRepository.count();
        }

        const [items, count] = await this.termsRepository.find({
            where,
            order,
            relations: this.db_relations,
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
        const terms = await this.termsRepository.findOne({
            where: {
                id,
            },
        });

        if (!terms) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return terms
    }

    async update(id: number, updateTermDto: UpdateTermDto, user: UserEntity) {
        const update = await this.termsRepository.update({
                id,
                school: {
                    id: user.id
                }
            },
            updateTermDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.termsRepository.findOne({
            where: {
                id,
                school: {
                    id: user.id
                }
            },
        })
    }

    async remove(id: number, user: UserEntity) {
        const deleteAvailability = await this.termsRepository.delete({
            id,
            school: {
                id: user.id
            }
        });
        if (!deleteAvailability.affected) {
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
        }
    }
}

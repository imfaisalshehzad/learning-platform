import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateFavouriteDto} from './dto/create-favourite.dto';
import {UpdateFavouriteDto} from './dto/update-favourite.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FreelanceFavourite} from "./entities/favourite.entity";
import {Equal, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../utils/postgresErrorHandling";
import {FREELANCE_FAVOURITE} from "../../utils/enum/enum.types";

@Injectable()
export class FavouriteService {

    private db_relations = [
        'teacher',
        'student',
        'freelanceRecord',
        'freelanceLive',
    ]

    constructor(
        @InjectRepository(FreelanceFavourite)
        private freelanceFavouriteRepository: Repository<FreelanceFavourite>,
    ) {}

    async create(createFavouriteDto: CreateFavouriteDto, user: UserEntity) {
        const experience = await this.freelanceFavouriteRepository.create({
            ...createFavouriteDto,
            student: user,
        });

        await this.freelanceFavouriteRepository.save(experience);
        return experience;
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        order_by?: string,
        sort_order?: string,
        from?: string,
        to?: string,
        status?: string,
        options?: FindManyOptions<FreelanceFavourite>
    ) {

        try {
            const where: FindManyOptions<FreelanceFavourite>['where'] = {}

            let separateCount = 0;
            let order = (order_by) ? order_by : 'id';
            let sort = (sort_order) ? sort_order : 'desc';
            let ordering = {[order]: `${sort}`}

            if (page) {
                where.id = MoreThan(page)
                separateCount = await this.freelanceFavouriteRepository.count();
            }

            if (status) {
                where.type = Equal(FREELANCE_FAVOURITE[`${status}`])
            }

            const [items, count] = await this.freelanceFavouriteRepository.findAndCount({
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

        } catch (e) {
            PostgresErrorHandling(e)
        }

    }

    async findOne(id: number) {
        const favourite = await this.freelanceFavouriteRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!favourite) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return favourite
    }

    async update(id: number, updateFavouriteDto: UpdateFavouriteDto, user: UserEntity) {
        const update = await this.freelanceFavouriteRepository.update({
                id,
            },
            updateFavouriteDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.freelanceFavouriteRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        })
    }

}

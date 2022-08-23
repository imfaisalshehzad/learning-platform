import {Injectable} from '@nestjs/common';
import {CreateReviewDto} from './dto/create-review.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FreelanceReviewEntity} from "./entities/review.entity";
import {UserEntity} from "../../users/entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class ReviewsService {

    constructor(
        @InjectRepository(FreelanceReviewEntity)
        private reviewsRepository: Repository<FreelanceReviewEntity>
    ) {}

    async create(createReviewDto: CreateReviewDto, user: UserEntity) {
        const reviews = await this.reviewsRepository.create({
            ...createReviewDto,
            teacher: user.teacher,
        });

        await this.reviewsRepository.save(reviews);
        return reviews;
    }

    async findAll() {
        return `This action returns all review`;
    }

    async findOne(id: number) {
        return `This action returns a #${id} review`;
    }

    async update(id: number, updateReviewDto: UpdateReviewDto) {
        return `This action updates a #${id} review`;
    }

    async remove(id: number) {
        return `This action removes a #${id} review`;
    }
}

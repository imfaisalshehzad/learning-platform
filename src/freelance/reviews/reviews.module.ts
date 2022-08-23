import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FreelanceReviewEntity} from "./entities/review.entity";

@Module({
  imports:[TypeOrmModule.forFeature([FreelanceReviewEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class FreelanceReviewsModule {}

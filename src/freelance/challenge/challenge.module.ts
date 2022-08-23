import {Module} from '@nestjs/common';
import {ChallengeService} from './challenge.service';
import {ChallengeController} from './challenge.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FreelanceReviewChallenge} from "./entities/challenge.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FreelanceReviewChallenge])],
    controllers: [ChallengeController],
    providers: [ChallengeService]
})
export class ChallengeModule {}

import {Module} from '@nestjs/common';
import {TimetableBlockFeedbackService} from './block-feedback.service';
import {TimetableBlockFeedbackController} from './block-feedback.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimetableBlockFeedbackEntity} from "./entities/block-feedback.entity";
import {UsersModule} from "../../../../../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TimetableBlockFeedbackEntity]),
        UsersModule,
    ],
    controllers: [TimetableBlockFeedbackController],
    providers: [TimetableBlockFeedbackService]
})
export class TimetableBlockFeedbackModule {}

import {Module} from '@nestjs/common';
import {EducationService} from './education.service';
import {EducationController} from './education.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EducationEntity} from "./entities/education.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EducationEntity])],
    controllers: [EducationController],
    providers: [EducationService]
})
export class EducationModule {}

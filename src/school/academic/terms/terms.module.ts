import {Module} from '@nestjs/common';
import {TermsService} from './terms.service';
import {TermsController} from './terms.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolTermsEntity} from "./entities/term.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SchoolTermsEntity])],
    controllers: [TermsController],
    providers: [TermsService]
})
export class SchoolTermsModule {}

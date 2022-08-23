import {Module} from '@nestjs/common';
import {FavouriteService} from './favourite.service';
import {FavouriteController} from './favourite.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FreelanceFavourite} from "./entities/favourite.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FreelanceFavourite])],
    controllers: [FavouriteController],
    providers: [FavouriteService]
})
export class FavouriteModule {}

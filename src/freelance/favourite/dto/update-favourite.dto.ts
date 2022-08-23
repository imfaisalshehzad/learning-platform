import { PartialType } from '@nestjs/swagger';
import { CreateFavouriteDto } from './create-favourite.dto';
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";

export class UpdateFavouriteDto {


    @IsOptional()
    @IsNumber()
    @IsEnum(ENUM_ACTIVE, {
        message: `favourite value should be ` + Object.values(ENUM_ACTIVE).join(', ')
    })
    is_favourite: ENUM_ACTIVE



}

import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import {IsEnum, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {


    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsOptional()
    rating: number

    @IsString()
    @IsEnum(FREELANCE_FAVOURITE, {
        message: `type value should be ` + Object.values(ENUM_ACTIVE).join(', ')
    })
    @IsOptional()
    type: FREELANCE_FAVOURITE

    @IsString()
    @IsEnum(ENUM_ACTIVE, {
        message: `status value should be ` + Object.values(ENUM_ACTIVE).join(', ')
    })
    @IsOptional()
    status: ENUM_ACTIVE

    @IsObject()
    @IsOptional()
    teacher: object

    @IsString()
    @IsOptional()
    record: object

    @IsString()
    @IsOptional()
    freelanceLive: object


}

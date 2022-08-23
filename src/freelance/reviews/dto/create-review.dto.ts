import {IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";

export class CreateReviewDto {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    rating: number

    @IsString()
    @IsEnum(FREELANCE_FAVOURITE, {
        message: `type value should be ` + Object.values(FREELANCE_FAVOURITE).join(', ')
    })
    @IsNotEmpty()
    type: FREELANCE_FAVOURITE

    @IsString()
    @IsEnum(ENUM_ACTIVE, {
        message: `status value should be ` + Object.values(ENUM_ACTIVE).join(', ')
    })
    @IsNotEmpty()
    status: ENUM_ACTIVE

    @IsObject()
    @IsNotEmpty()
    teacher: object

    @IsString()
    @IsOptional()
    record: object

    @IsString()
    @IsOptional()
    freelanceLive: object

}

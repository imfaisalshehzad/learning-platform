import {IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {ENUM_ACTIVE, FREELANCE_FAVOURITE} from "../../../utils/enum/enum.types";

export class CreateFavouriteDto {

    @IsNumber()
    @IsNotEmpty()
    @IsEnum(ENUM_ACTIVE, {
        message: `is_favourite value should be ` + Object.values(ENUM_ACTIVE).join(', ')
    })
    is_favourite: ENUM_ACTIVE

    @IsNotEmpty()
    @IsString()
    @IsEnum(FREELANCE_FAVOURITE, {
        message: `type value should be ` + Object.values(FREELANCE_FAVOURITE).join(', ')
    })
    type: FREELANCE_FAVOURITE

    @IsOptional()
    @IsObject()
    freelanceRecord: object

    @IsOptional()
    @IsObject()
    freelanceLive: object

    @IsOptional()
    @IsObject()
    teacher: object


}

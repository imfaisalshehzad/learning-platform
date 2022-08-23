import { PartialType } from '@nestjs/swagger';
import { CreateLiveDto } from './create-live.dto';
import {
    IsArray,
    IsDateString,
    IsDecimal,
    IsEnum,
    IsMilitaryTime,
    IsNotEmpty,
    IsNumberString, IsOptional,
    IsString
} from "class-validator";
import {LIVE_SESSION_TYPE} from "../../../utils/enum/enum.types";

export class UpdateLiveDto extends PartialType(CreateLiveDto) {

    @IsOptional()
    @IsEnum(LIVE_SESSION_TYPE, {
        message: "type value should be either PUBLIC or PRIVATE."
    })
    type: LIVE_SESSION_TYPE

    @IsDateString()
    @IsOptional()
    session_date: string

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsOptional()
    start_time: string

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsOptional()
    end_time: string

    @IsString()
    @IsOptional()
    name: string

    @IsNumberString()
    @IsOptional()
    number_of_students: number

    @IsDecimal()
    @IsOptional()
    price: number

    @IsString()
    @IsOptional()
    description: string

    @IsArray()
    @IsOptional()
    tags: object[]

    @IsNotEmpty()
    @IsOptional()
    subjects: object[]

    @IsNotEmpty()
    @IsOptional()
    resource: object[]




}

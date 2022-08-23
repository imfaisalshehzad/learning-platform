import { PartialType } from '@nestjs/swagger';
import { CreateBlockDto } from './create-block.dto';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsMilitaryTime, IsNotEmpty,
    IsObject,
    IsOptional,
    IsString, ValidateIf
} from "class-validator";
import {DAYS_LIST, USER_ROLE} from "../../../../../utils/enum/enum.types";

export class UpdateBlockDto extends PartialType(CreateBlockDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    location: string;

    @IsDateString()
    @IsNotEmpty()
    block_date: string;

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    start_time: string;

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    end_time: string;

    @IsString()
    @IsOptional()
    @IsEnum(DAYS_LIST, {
        message: "week_day value should be " + Object.values(DAYS_LIST).filter(function (text) {
            return text;
        })
    })
    week_day: DAYS_LIST;

    @IsArray()
    @IsOptional()
    teacher: object[]

    @IsArray()
    @IsOptional()
    student: object[]

    @IsOptional()
    @IsObject()
    timetable: object

    //********************** optional *******************

    @IsObject()
    @IsOptional()
    department: object

    @IsObject()
    @IsOptional()
    subject: object

    @IsObject()
    @IsOptional()
    yearGroup: object

    @IsObject()
    @IsOptional()
    formGroup: object

    @IsObject()
    @IsOptional()
    classGroup: object


    @IsOptional()
    block_date_start_time: string

    @IsOptional()
    block_date_end_time: string

    //********************** optional *******************


}

import {
    IsArray,
    IsDateString,
    IsEnum,
    IsMilitaryTime,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString
} from "class-validator";
import {DAYS_LIST} from "../../../../../utils/enum/enum.types";

export class CreateBlockDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsDateString()
    @IsNotEmpty()
    block_date: string;

    @IsString()
    @IsNotEmpty()
    location: string;

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
    @IsNotEmpty()
    @IsEnum(DAYS_LIST, {
        message: "week_day value should be " + Object.values(DAYS_LIST).filter(function (text) {
            return text;
        })
    })
    week_day: DAYS_LIST;

    @IsArray()
    @IsNotEmpty()
    teacher: object[]

    @IsArray()
    @IsNotEmpty()
    student: object[]

    @IsNotEmpty()
    @IsObject()
    timetable: object

    //********************** optional *******************

    @IsObject()
    @IsNotEmpty()
    department: object

    @IsObject()
    @IsNotEmpty()
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

    //********************** optional *******************

}

import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNotEmpty, IsNumber,
    IsString
} from "class-validator";
import {REPEAT_OPTIONS} from "../../../../../utils/enum/enum.types";

export class CloneBlockDto {

    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @IsDateString()
    @IsNotEmpty()
    end_date: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(
        REPEAT_OPTIONS,{
            message: "value should be " + Object.values(REPEAT_OPTIONS).filter(function (text) {
                return text;
            })
        }
    )
    repeat: REPEAT_OPTIONS;

    @IsArray()
    @IsNotEmpty()
    blocks: object[]




}

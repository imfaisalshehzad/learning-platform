import {
    IsArray,
    IsDateString,
    IsDecimal,
    IsEnum,
    IsMilitaryTime,
    IsNotEmpty,
    IsNumberString,
    IsString
} from "class-validator";
import {LIVE_SESSION_TYPE} from "../../../utils/enum/enum.types";


export class CreateLiveDto {

    @IsNotEmpty()
    @IsEnum(LIVE_SESSION_TYPE, {
        message: "type value should be either PUBLIC or PRIVATE."
    })
    type: LIVE_SESSION_TYPE

    @IsDateString()
    @IsNotEmpty()
    session_date: string

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    start_time: string

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    end_time: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumberString()
    @IsNotEmpty()
    number_of_students: number

    @IsDecimal()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @IsNotEmpty()
    tags: object[]

    @IsNotEmpty()
    @IsArray()
    subjects: object[]

    @IsNotEmpty()
    @IsArray()
    resource: object[]


}

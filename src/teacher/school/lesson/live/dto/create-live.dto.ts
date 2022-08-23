import {IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsObject, IsString} from "class-validator";

export class CreateLiveDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsArray()
    tags: object[]

    @IsNotEmpty()
    @IsDateString()
    session_date: string

    @IsNotEmpty()
    @IsMilitaryTime({
        message: "start_time value must be a valid representation of time in the format HH:MM"
    })
    start_time: string

    @IsNotEmpty()
    @IsMilitaryTime({
        message: "end_time value must be a valid representation of time in the format HH:MM"
    })
    end_time: string

    @IsNotEmpty()
    @IsObject()
    subject: object

    @IsNotEmpty()
    @IsObject()
    classGroup: object

    @IsNotEmpty()
    @IsArray()
    resource: object[]

    @IsNotEmpty()
    @IsArray()
    student: object[]


}

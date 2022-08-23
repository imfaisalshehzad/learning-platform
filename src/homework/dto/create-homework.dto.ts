import {IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class CreateHomeworkDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @IsDateString()
    due_date: string

    @IsMilitaryTime({
        message: "due_time value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    due_time: string

    @IsObject()
    @IsNotEmpty()
    subject: object

    @IsArray()
    @IsNotEmpty()
    resource: object[]

    @IsOptional()
    @IsObject()
    classGroup: object

    @IsArray()
    @IsNotEmpty()
    student: object[]



}

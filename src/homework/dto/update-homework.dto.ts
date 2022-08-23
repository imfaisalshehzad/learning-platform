import { PartialType } from '@nestjs/swagger';
import { CreateHomeworkDto } from './create-homework.dto';
import {IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateHomeworkDto extends PartialType(CreateHomeworkDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsDateString()
    @IsNotEmpty()
    due_date: string

    @IsMilitaryTime({
        message: "due_time value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    due_time: string

    @IsObject()
    @IsOptional()
    subject: object

    @IsArray()
    @IsOptional()
    resource: object[]

    @IsOptional()
    @IsObject()
    classGroup: object

    @IsArray()
    @IsOptional()
    student: object[]

    @IsOptional()
    due_date_time: string

}

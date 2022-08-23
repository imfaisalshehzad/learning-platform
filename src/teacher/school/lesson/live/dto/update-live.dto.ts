import { PartialType } from '@nestjs/swagger';
import { CreateLiveDto } from './create-live.dto';
import {IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateLiveDto extends PartialType(CreateLiveDto) {


    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
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

    @IsOptional()
    @IsObject()
    subject: object

    @IsOptional()
    @IsObject()
    classGroup: object

    @IsOptional()
    @IsArray()
    resource: object[]

    @IsOptional()
    @IsArray()
    student: object[]



}

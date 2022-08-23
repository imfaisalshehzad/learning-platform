import {PartialType} from "@nestjs/mapped-types";
import {CreateTeacherDto} from "./create-teacher.dto";
import {IsArray, IsObject, IsOptional, IsString} from "class-validator";


export class UpdateTeacherDto extends PartialType(CreateTeacherDto){

    @IsString()
    @IsOptional()
    public firstName: string

    @IsString()
    @IsOptional()
    public lastName: string

    @IsOptional()
    public perHour: number

    @IsArray()
    @IsOptional()
    subjects: object[];


}

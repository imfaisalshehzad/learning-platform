import { PartialType } from '@nestjs/swagger';
import { CreateClassGroupDto } from './create-class-group.dto';
import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateClassGroupDto extends PartialType(CreateClassGroupDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsArray()
    @IsOptional()
    teacher: object[]

    @IsArray()
    @IsOptional()
    student: object[]



    @IsObject()
    @IsOptional()
    yearGroup: object

    @IsObject()
    @IsOptional()
    department: object

    @IsObject()
    @IsOptional()
    subject: object

}

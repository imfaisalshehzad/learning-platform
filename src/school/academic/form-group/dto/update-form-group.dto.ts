import { PartialType } from '@nestjs/swagger';
import { CreateFormGroupDto } from './create-form-group.dto';
import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateFormGroupDto extends PartialType(CreateFormGroupDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsArray()
    @IsOptional()
    yearGroup: object[]

    @IsArray()
    @IsOptional()
    teacher: object[]

    @IsArray()
    @IsOptional()
    student: object[]

}

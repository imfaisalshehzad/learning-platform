import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import {IsArray, IsOptional, IsString} from "class-validator";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsArray()
    @IsOptional()
    teacher: object[]

}

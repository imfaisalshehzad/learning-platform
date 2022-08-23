import { PartialType } from '@nestjs/swagger';
import { CreateYearGroupDto } from './create-year-group.dto';
import {IsArray, IsOptional, IsString} from "class-validator";

export class UpdateYearGroupDto extends PartialType(CreateYearGroupDto) {


    @IsString()
    @IsOptional()
    name: string

    @IsArray()
    @IsOptional()
    teacher: object[]


}

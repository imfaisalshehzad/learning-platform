import { PartialType } from '@nestjs/swagger';
import { CreateSchoolRecordDto } from './create-record.dto';
import {IsArray, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateSchoolRecordDto extends PartialType(CreateSchoolRecordDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsArray()
    @IsOptional()
    tags: object[]

    @IsObject()
    @IsOptional()
    subject: object

    @IsObject()
    @IsOptional()
    classGroup: object[]

    @IsArray()
    @IsOptional()
    resource: object[]

    @IsArray()
    @IsOptional()
    student: object[]


}

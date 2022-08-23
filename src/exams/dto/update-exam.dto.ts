import { PartialType } from '@nestjs/swagger';
import { CreateExamDto } from './create-exam.dto';
import {IsArray, IsNumber, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateExamDto extends PartialType(CreateExamDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsObject()
    @IsOptional()
    classGroup: object

    @IsObject()
    @IsOptional()
    terms: object

    @IsNumber()
    @IsOptional()
    expected_average: number

    @IsObject()
    @IsOptional()
    subject: object

    @IsArray()
    @IsOptional()
    student: object[]


}

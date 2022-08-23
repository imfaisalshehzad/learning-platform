import {IsDecimal, IsObject, IsOptional, IsString} from "class-validator";
import {PartialType} from "@nestjs/swagger";
import {CreateExamResultsDto} from "./create-exam-results.dto";

export class UpdateExamResultsDto extends PartialType(CreateExamResultsDto) {

    @IsOptional()
    @IsDecimal()
    percentage: number

    @IsOptional()
    @IsString()
    comment: string

    @IsOptional()
    @IsObject()
    exam: object

    @IsOptional()
    @IsObject()
    student: object



}

import {IsDecimal, IsNotEmpty, IsObject, IsString} from "class-validator";

export class CreateExamResultsDto {

    @IsNotEmpty()
    @IsDecimal()
    percentage: number

    @IsNotEmpty()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsObject()
    exam: object

    @IsNotEmpty()
    @IsObject()
    student: object



}

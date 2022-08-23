import {IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";

export class CreateExamDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsObject()
    @IsOptional()
    classGroup: object

    @IsObject()
    @IsNotEmpty()
    terms: object

    @IsObject()
    @IsNotEmpty()
    subject: object

    @IsArray()
    @IsNotEmpty()
    student: object[]

    @IsNumber()
    @IsOptional()
    expected_average: number


}

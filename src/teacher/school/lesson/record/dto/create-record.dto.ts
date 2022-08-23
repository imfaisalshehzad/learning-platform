import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class CreateSchoolRecordDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @IsNotEmpty()
    tags: object[]

    @IsObject()
    @IsNotEmpty()
    subject: object

    @IsObject()
    @IsOptional()
    classGroup: object[]

    @IsArray()
    @IsNotEmpty()
    resource: object[]

    @IsArray()
    @IsNotEmpty()
    student: object[]

}

import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class CreateFormGroupDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsNotEmpty()
    yearGroup: object[]

    @IsArray()
    @IsOptional()
    teacher: object[]

    @IsArray()
    @IsOptional()
    student: object[]



}

import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsOptional()
    teacher: object[]

}

import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateSubjectDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsOptional()
    department: object[]

}

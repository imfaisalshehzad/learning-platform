import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTeacherDto {

    @IsString()
    public firstName: string

    @IsString()
    public lastName: string

    @IsNotEmpty()
    @IsArray()
    @IsOptional()
    subjects: object[]


}

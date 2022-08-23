import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateYearGroupDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsOptional()
    teacher: object[]


}

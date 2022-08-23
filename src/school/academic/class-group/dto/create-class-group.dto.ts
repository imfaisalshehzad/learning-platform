import {IsArray, IsNotEmpty, IsObject, IsString} from "class-validator";

export class CreateClassGroupDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsObject()
    @IsNotEmpty()
    yearGroup: object

    @IsObject()
    @IsNotEmpty()
    department: object

    @IsObject()
    @IsNotEmpty()
    subject: object

    @IsArray()
    @IsNotEmpty()
    teacher: object[]

    @IsArray()
    @IsNotEmpty()
    student: object[]


}

import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class SubmitHomeworkDto {

    @IsString()
    @IsNotEmpty()
    studentComment: string

    @IsObject()
    @IsNotEmpty()
    homework: object

    @IsOptional()
    @IsArray()
    resource: object[]

    //

}

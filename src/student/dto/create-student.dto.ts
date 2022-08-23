import {IsOptional, IsString} from "class-validator";

export class CreateStudentDto {


    @IsString()
    @IsOptional()
    public firstName: string

    @IsString()
    @IsOptional()
    public lastName: string

    @IsString()
    @IsOptional()
    public rollNumber: string

}

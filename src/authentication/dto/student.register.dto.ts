import {IsAlphanumeric, IsNotEmpty, IsOptional, IsString} from "class-validator";


export class StudentAuthDto {

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsAlphanumeric()
    @IsNotEmpty()
    rollNumber: string

    @IsString()
    @IsOptional()
    gender: string

    @IsString()
    @IsOptional()
    fatherName: string

    @IsOptional()
    @IsString()
    motherName: string

    @IsString()
    @IsOptional()
    school: string

}

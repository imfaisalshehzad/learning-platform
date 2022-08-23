import {IsNotEmpty, IsNumber, IsString} from "class-validator";


export class TeacherAuthDto {

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    @IsNumber()
    perHour: number

}

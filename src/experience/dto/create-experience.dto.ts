import {
    IsDateString,
    IsNotEmpty,
    IsString
} from "class-validator";

export class CreateExperienceDto {

    @IsString()
    @IsNotEmpty()
    workplace: string

    @IsString()
    @IsNotEmpty()
    position: string


    @IsString()
    @IsNotEmpty()
    department: string

    @IsString()
    @IsNotEmpty()
    description: string


    @IsDateString()
    @IsNotEmpty()
    startDate: string;


    @IsDateString()
    @IsNotEmpty()
    endDate: string


}

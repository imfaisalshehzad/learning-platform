import {IsNotEmpty, IsString} from "class-validator";

export class CreateTimetableDto {


    @IsString()
    @IsNotEmpty()
    name: string


}

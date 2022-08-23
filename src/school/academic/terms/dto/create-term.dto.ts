import {IsNotEmpty, IsString} from "class-validator";

export class CreateTermDto {

    @IsString()
    @IsNotEmpty()
    name: string

}

import {IsNotEmpty, IsString} from "class-validator";


export class CheckVerificationDto {

    @IsString()
    @IsNotEmpty()
    code: string

}

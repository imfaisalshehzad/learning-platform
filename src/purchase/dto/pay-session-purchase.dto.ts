import {IsNotEmpty, IsString} from "class-validator";

export class PaySessionPurchaseDto {


    @IsNotEmpty()
    @IsString()
    card_name: string

    @IsNotEmpty()
    @IsString()
    card_number: string

    @IsNotEmpty()
    @IsString()
    card_expiry_month: string

    @IsNotEmpty()
    @IsString()
    card_expiry_year: string


}

import {IsDecimal, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateSessionPayPurchaseDto {

    @ApiProperty({ required: true, description: 'order_amount' })
    @IsNotEmpty()
    @IsDecimal()
    order_amount: number


}

import {
    IsDecimal,
    IsNotEmpty,
    IsString,
    IsArray,
} from "class-validator";

export class CreateRecordDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsDecimal()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @IsNotEmpty()
    tags: object[]

    @IsNotEmpty()
    @IsArray()
    subjects: object[]

    @IsNotEmpty()
    @IsArray()
    resource: object[]

}

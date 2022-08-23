import {IsArray, IsBoolean, IsNotEmpty, isNumber, IsObject, IsString, ValidateIf} from 'class-validator'

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @IsNotEmpty()
    @IsArray()
    categories: object[];

}

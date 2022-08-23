import {PartialType} from '@nestjs/mapped-types';
import {CreatePostDto} from './create-post.dto';
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdatePostDto extends PartialType(CreatePostDto) {

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;


    @IsArray()
    @IsOptional()
    categories: object[];

}

import {
    IsOptional,
} from "class-validator";

export class CreateUserDto {

    @IsOptional()
    password?: string;

    @IsOptional()
    teacher?: object

    @IsOptional()
    student?: object

    @IsOptional()
    school?: object

}

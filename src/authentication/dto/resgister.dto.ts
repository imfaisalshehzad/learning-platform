import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty, IsNumber,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Matches,
    MinLength, ValidateIf, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {USER_ROLE} from "../../utils/enum/enum.types";
import {TeacherAuthDto} from "./teacher.teacher.dto";
import {StudentAuthDto} from "./student.register.dto";
import {CreateSchoolDto} from "../../school/dto/create-school.dto";


export class RegisterDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    about: string;

    @IsPhoneNumber()
    @IsOptional()
    phone: string;

    @IsNotEmpty()
    @IsEnum(USER_ROLE, {
        message: "Role values should be " + Object.values(USER_ROLE).filter(function (img) {
            return img !== "admin";
        })
    })
    role: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: "Phone Number is not valid. Please input with country code and number i.e +971501111111"
    })
    phoneNumber: string;

    @ValidateIf(o => o.role === `${USER_ROLE.TEACHER}`)
    @ValidateNested({each: true})
    @Type(() => TeacherAuthDto)
    @IsObject()
    teacher: TeacherAuthDto

    @ValidateIf(o => o.role === `${USER_ROLE.STUDENT}`)
    @ValidateNested({each: true})
    @Type(() => StudentAuthDto)
    @IsObject()
    student: StudentAuthDto


    @ValidateIf(o => o.role === `${USER_ROLE.SCHOOL}`)
    @ValidateNested({each: true})
    @Type(() => CreateSchoolDto)
    @IsObject()
    school: CreateSchoolDto


    @IsOptional()
    @IsNumber()
    isPhoneNumberConfirmed: number

    @IsOptional()
    @IsNumber()
    isActive: number


    @ValidateIf(o => o.role === `${USER_ROLE.STUDENT}` || o.role === `${USER_ROLE.TEACHER}`)
    // @IsNotEmpty()
    // @IsArray()
    // @ValidateNested({each: true})
    profile: object[]

}

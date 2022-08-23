import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {FindOneParams} from "../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";



@ApiBearerAuth()
@ApiTags('Student')
@Controller('student')
@UseInterceptors(ClassSerializerInterceptor)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(RoleGuard(RoleEnum.STUDENT))
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param() {id}: FindOneParams) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(RoleGuard(RoleEnum.STUDENT))
  update(@Param() {id}: FindOneParams, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  remove(@Param() {id}: FindOneParams) {
    return this.studentService.remove(+id);
  }
}

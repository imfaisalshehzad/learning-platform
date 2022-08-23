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
  ClassSerializerInterceptor, Req, Query
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import RoleGuard from "../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../authentication/role.enum";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {FindOneParams} from "../utils/findOneParams";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {PaginationParams} from "../utils/types/paginationParams";
import {CreateExamResultsDto} from "./dto/create-exam-results.dto";
import {UpdateExamResultsDto} from "./dto/update-exam-results.dto";
import ProfileRoleGuard from "../authentication/profile.decorator";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Exams')
@Controller('exams')
@UseInterceptors(ClassSerializerInterceptor)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createExamDto: CreateExamDto, @Req() req: RequestWithUser) {
    return this.examsService.create(createExamDto, req.user);
  }

  @Get()
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Query()  {offset, limit, page, sort_order, order_by, subject}: PaginationParams) {
    return this.examsService.findAll(offset, limit, page, sort_order, order_by, subject);
  }

  @Get(':id')
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.examsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateExamDto: UpdateExamDto, @Req() req: RequestWithUser) {
    return this.examsService.update(+id, updateExamDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.examsService.remove(+id, req.user);
  }

  @Post('results')
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  createResults(@Body() createExamResultsDto: CreateExamResultsDto, @Req() req: RequestWithUser) {
    return this.examsService.createResults(createExamResultsDto, req.user);
  }

  @Patch('results/:id')
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  updateResults(@Param() {id}: FindOneParams, @Body() updateExamResultsDto: UpdateExamResultsDto, @Req() req: RequestWithUser) {
    return this.examsService.updateResults(+id, updateExamResultsDto, req.user);
  }

  @Delete('results/:id')
  @UseGuards(RoleGuard(RoleEnum.TEACHER))
  @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  removeResults(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.examsService.removeResults(+id, req.user);
  }

}

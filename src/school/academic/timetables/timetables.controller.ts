import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor, UseGuards, Req, Query
} from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {FindOneParams} from "../../../utils/findOneParams";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Timetables')
@Controller('timetables')
@UseInterceptors(ClassSerializerInterceptor)
export class TimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Post()
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createTimetableDto: CreateTimetableDto, @Req() req: RequestWithUser) {
    return this.timetablesService.create(createTimetableDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Query()  {offset, limit, page, sort_order, order_by, from, to}: PaginationParams, @Req() req: RequestWithUser) {
    return this.timetablesService.findAll(req.user, offset, limit, page, sort_order, order_by, from, to);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(
      @Param() {id}: FindOneParams,
      @Query()  {sort_order, order_by, from, to}: PaginationParams,
  ) {
    return this.timetablesService.findOne(+id, sort_order, order_by, from, to);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateTimetableDto: UpdateTimetableDto, @Req() req: RequestWithUser) {
    return this.timetablesService.update(+id, updateTimetableDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.timetablesService.remove(+id, req.user);
  }


}

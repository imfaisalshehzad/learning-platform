import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors, Req, Query
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import {FindOneParams} from "../../../utils/findOneParams";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Department')
@Controller('department')
@UseInterceptors(ClassSerializerInterceptor)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createDepartmentDto: CreateDepartmentDto, @Req() req: RequestWithUser) {
    return this.departmentService.create(createDepartmentDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Query()  {offset, limit, page, sort_order, order_by, from, to}: PaginationParams, @Req() req: RequestWithUser) {
    return this.departmentService.findAll(req.user, offset, limit, page, sort_order, order_by, from, to);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(
      @Param() {id}: FindOneParams,
      @Query()  {sort_order, order_by, from, to}: PaginationParams,
      @Req() req: RequestWithUser
  ) {
    return this.departmentService.findOne(+id, sort_order, order_by, from, to);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateDepartmentDto: UpdateDepartmentDto, @Req() req: RequestWithUser) {
    return this.departmentService.update(+id, updateDepartmentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.departmentService.remove(+id, req.user);
  }


}

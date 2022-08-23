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
import { FormGroupService } from './form-group.service';
import { CreateFormGroupDto } from './dto/create-form-group.dto';
import { UpdateFormGroupDto } from './dto/update-form-group.dto';
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Form Group')
@Controller('formation')
@UseInterceptors(ClassSerializerInterceptor)
export class FormGroupController {
  constructor(private readonly formGroupService: FormGroupService) {}

  @Post()
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createFormGroupDto: CreateFormGroupDto, @Req() req: RequestWithUser) {
    return this.formGroupService.create(createFormGroupDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Query()  {offset, limit, page, sort_order, order_by}: PaginationParams, @Req() req: RequestWithUser) {
    return this.formGroupService.findAll(req.user, offset, limit, page, sort_order, order_by);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.formGroupService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateFormGroupDto: UpdateFormGroupDto, @Req() req: RequestWithUser) {
    return this.formGroupService.update(+id, updateFormGroupDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.formGroupService.remove(+id, req.user);
  }
}

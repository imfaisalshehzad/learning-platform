import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor, Query
} from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {FindOneParams} from "../../../utils/findOneParams";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Terms')
@Controller('terms')
@UseInterceptors(ClassSerializerInterceptor)
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post()
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createTermDto: CreateTermDto, @Req() req: RequestWithUser) {
    return this.termsService.create(createTermDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(
      @Req() req: RequestWithUser,
      @Query()  {offset, limit, page, sort_order, order_by}: PaginationParams
  ) {
    return this.termsService.findAll(req.user, offset, limit, page, sort_order, order_by);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param() {id}: FindOneParams) {
    return this.termsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateTermDto: UpdateTermDto, @Req() req: RequestWithUser) {
    return this.termsService.update(+id, updateTermDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.termsService.remove(+id, req.user);
  }
}

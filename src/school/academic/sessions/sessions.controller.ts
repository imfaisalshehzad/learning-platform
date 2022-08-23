import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor, Query, Req, UseGuards
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import {PaginationParams} from "../../../utils/types/paginationParams";
import {FindOneParams} from "../../../utils/findOneParams";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Sessions')
@Controller('sessions')
@UseInterceptors(ClassSerializerInterceptor)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':id')
  @UseGuards(RoleGuard(RoleEnum.SCHOOL))
  @UseGuards(JwtAuthenticationGuard)
  findAll(
      @Query()  {from, to, role}: PaginationParams,
      @Param() {id}: FindOneParams,
      @Req() req: RequestWithUser
  ) {
    return this.sessionsService.findAll(req.user, +id, from, to, role);
  }

}

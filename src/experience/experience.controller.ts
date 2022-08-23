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
  Query,
  UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Experience')
@Controller('experience')
@UseInterceptors(ClassSerializerInterceptor)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createExperienceDto: CreateExperienceDto, @Req() req: RequestWithUser) {
    return this.experienceService.create(createExperienceDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(
      @Query() {offset, limit, page}: PaginationParams,
      @Req() req: RequestWithUser
  ) {
    return this.experienceService.findAll(req.user, offset, limit, page);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.experienceService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Param() {id}: FindOneParams, @Body() updateExperienceDto: UpdateExperienceDto, @Req() req: RequestWithUser) {
    return this.experienceService.update(+id, updateExperienceDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
    return this.experienceService.remove(+id, req.user);
  }


}

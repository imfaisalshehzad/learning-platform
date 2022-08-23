import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Syllabus')
@Controller('syllabus')
@UseInterceptors(ClassSerializerInterceptor)
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Post()
  create(@Body() createSyllabusDto: CreateSyllabusDto) {
    return this.syllabusService.create(createSyllabusDto);
  }

  @Get()
  findAll() {
    return this.syllabusService.findAll();
  }

  @Get(':id')
  findOne(@Param() {id}: FindOneParams) {
    return this.syllabusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param() {id}: FindOneParams, @Body() updateSyllabusDto: UpdateSyllabusDto) {
    return this.syllabusService.update(+id, updateSyllabusDto);
  }

  @Delete(':id')
  remove(@Param() {id}: FindOneParams) {
    return this.syllabusService.remove(+id);
  }
}

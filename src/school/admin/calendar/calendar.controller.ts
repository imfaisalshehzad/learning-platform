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
import {CalendarService} from './calendar.service';
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Calendar')
@Controller('calendar')
@UseInterceptors(ClassSerializerInterceptor)
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {
    }

    @Get()
    findAll() {
        return this.calendarService.findAll();
    }

    @Get(':id')
    findOne(@Param() {id}: FindOneParams) {
        return this.calendarService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param() {id}: FindOneParams) {
        return this.calendarService.remove(+id);
    }
}

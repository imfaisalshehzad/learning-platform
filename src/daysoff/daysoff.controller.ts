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
import {DaysOffService} from './daysoff.service';
import {CreateDaysOffDto} from './dto/create-daysoff.dto';
import {UpdateDaysOffDto} from './dto/update-daysoff.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Vacations')
@Controller('vacations')
@UseInterceptors(ClassSerializerInterceptor)
export class DaysOffController {
    constructor(private readonly daysOffService: DaysOffService) {
    }

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createDaysOffDto: CreateDaysOffDto, @Req() req: RequestWithUser) {
        return this.daysOffService.create(createDaysOffDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query() {offset, limit, page}: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.daysOffService.findAll(req.user, offset, limit, page);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.daysOffService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateDaysOffDto: UpdateDaysOffDto, @Req() req: RequestWithUser) {
        return this.daysOffService.update(+id, updateDaysOffDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.daysOffService.remove(+id, req.user);
    }
}

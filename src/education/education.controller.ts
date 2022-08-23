import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    Query,
    UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import {EducationService} from './education.service';
import {CreateEducationDto} from './dto/create-education.dto';
import {UpdateEducationDto} from './dto/update-education.dto';
import RequestWithUser from "../authentication/requestWithUser.interface";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {PaginationParams} from "../utils/types/paginationParams";
import {FindOneParams} from "../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Education')
@Controller('education')
@UseInterceptors(ClassSerializerInterceptor)
export class EducationController {
    constructor(private readonly educationService: EducationService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createEducationDto: CreateEducationDto, @Req() req: RequestWithUser) {
        return this.educationService.create(createEducationDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {offset, limit, page}: PaginationParams, @Req() req: RequestWithUser) {
        return this.educationService.findAll(req.user, offset, limit, page);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.educationService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthenticationGuard)
    update(
        @Param() {id}: FindOneParams,
        @Body() updateEducationDto: UpdateEducationDto,
        @Req() req: RequestWithUser
    ) {
        return this.educationService.update(+id, updateEducationDto, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    remove(
        @Param() {id}: FindOneParams,
        @Req() req: RequestWithUser
    ) {
        return this.educationService.remove(+id, req.user);
    }
}

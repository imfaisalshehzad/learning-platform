import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards, Req, Query, UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import {UploadService} from './upload.service';
import {CreateUploadDto} from './dto/create-upload.dto';
import {UpdateUploadDto} from './dto/update-upload.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {FormDataRequest} from "nestjs-form-data";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";




@ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
@UseInterceptors(ClassSerializerInterceptor)
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
    ) {}

    @Post()
    @FormDataRequest()
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createUploadDto: CreateUploadDto) {
        const res = this.uploadService.create(createUploadDto);
        return res;
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {offset, limit, page}: PaginationParams, @Req() req: RequestWithUser) {
        return this.uploadService.findAll(req.user, offset, limit, page);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.uploadService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateUploadDto: UpdateUploadDto) {
        return this.uploadService.update(+id, updateUploadDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.uploadService.remove(+id);
    }
}

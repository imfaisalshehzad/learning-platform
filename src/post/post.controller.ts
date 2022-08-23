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
import {PostService} from './post.service';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {FindOneParams} from "../utils/findOneParams";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {PaginationParams} from "../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";





@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
        return this.postService.create(createPostDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {offset, limit, page}: PaginationParams) {
        return this.postService.findAll(offset, limit, page);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.postService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(+id, updatePostDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.postService.remove(+id);
    }
}

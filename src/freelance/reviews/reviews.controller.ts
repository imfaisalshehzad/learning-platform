import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
    UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import {ReviewsService} from './reviews.service';
import {CreateReviewDto} from './dto/create-review.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import {PaginationParams} from "../../utils/types/paginationParams";
import RequestWithUser from "../../authentication/requestWithUser.interface";
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import {FindOneParams} from "../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";




@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createReviewDto: CreateReviewDto, @Req() req: RequestWithUser) {
        return this.reviewsService.create(createReviewDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.reviewsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewsService.update(+id, updateReviewDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.reviewsService.remove(+id);
    }
}

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor, UseGuards
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PaginationParams} from "../utils/types/paginationParams";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import {FindOneParams} from "../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {offset, limit, page, sort_order, order_by, role}: PaginationParams) {
        return this.usersService.findAll(offset, limit, page, sort_order, order_by, role);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.usersService.remove(+id);
    }
}

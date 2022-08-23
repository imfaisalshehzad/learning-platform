import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import {RolesService} from './roles.service';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import {FindOneParams} from "../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";




@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param() {id}: FindOneParams) {
        return this.rolesService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.rolesService.remove(+id);
    }
}
